import React, { useRef, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField as MuiTextField,
  Paper,
  Dialog,
  Divider,
  Button,
} from "@mui/material";

import "../../components/styles/Dashboard.scss";
import "../../components/styles/TransactionModal.scss";
import "../../components/styles/TagTransaction.scss";

import welcomeImage from "../../assets/svg/undraw_hello_re_3evm.svg";
import Breadcrums from "../../components/customs/Breadcrums";
import CardHistory from "../../components/customs/CardHistory";
import loading from "../../assets/lottie/Loading-2.json";

import { hasAccess } from "../../services/functions/access";
import { apDash, approverDash } from "../../services/constants/headers";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setHeader } from "../../services/slice/headerSlice";
import useParamsHook from "../../services/hooks/useParamsHook";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MobileDatePicker } from "@mui/x-date-pickers";
import Autocomplete from "../../components/customs/AutoComplete";
import dashboardSchema from "../../schemas/dashboardSchema";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import moment from "moment";
import {
  useCheckCountQuery,
  useCountScheduleQuery,
  useGjCountQuery,
  useTransactCountQuery,
  useTreasuryCountQuery,
} from "../../services/api/countApi";
import { useDashboardBalanceQuery } from "../../services/api/dashboardApi";
import { LineChart } from "@mui/x-charts/LineChart";
import { AdditionalFunction } from "../../services/functions/AdditionalFunction";
import { useBankQuery } from "../../services/api/bankApi";
import Lottie from "lottie-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { convertToPeso } = AdditionalFunction();
  const [filter, setFilter] = useState(false);

  const userData = useSelector((state) => state.auth.userData);
  const { min_amount, max_amount } = userData?.amount || {};
  const apCodes = userData?.scope_tagging?.map((item) => item?.ap_code);
  const isAP = min_amount === "0.00" && max_amount === "0.00";

  const queryParams = {
    ap: apCodes,
    min: isAP || apCodes?.length !== 0 ? "" : min_amount,
    max: isAP || apCodes?.length !== 0 ? "" : max_amount,
  };

  const { params, onFilterChange, onReset, onFromChange, onToChange } =
    useParamsHook();
  const { params: bankParams, onSearchData: searchCoa } = useParamsHook();

  const { data: badgeTagging } = useTransactCountQuery({ ap: apCodes });
  const { data: badgeCheck } = useCheckCountQuery(queryParams);
  const { data: scheduleTransaction } = useCountScheduleQuery(queryParams);
  const { data: badgeGj } = useGjCountQuery(queryParams);
  const { data: treasuryCount } = useTreasuryCountQuery({
    count: hasAccess("tagging") ? "tagging" : "treasury",
  });

  const { data: dashboardBalance, isLoading: loadingBalance } =
    useDashboardBalanceQuery(params);
  const { data: bank, isError: errorBank } = useBankQuery(bankParams);

  const debounceTimer = useRef(null);

  const {
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(dashboardSchema),
    defaultValues: {
      bank_id: null,
      month_from: null,
      month_to: null,
    },
  });

  const handleInputChange = (event, data) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      searchCoa(data);
    }, 500);
  };

  const keyToLabel = {
    Beginning: "Beginning Balance",
    "Accounts Payable": "Accounts Payable",
    "Outstanding Payable": "Outstanding Payable",
    "Outstanding Check": "Outstanding Check",
    Paid: "Paid",
    Running: "Running Balance",
  };

  const colors = {
    Beginning: "#15253B",
    "Accounts Payable": "#f4ce92",
    "Outstanding Payable": "#B6622d",
    Paid: "green",
    "Outstanding Check": "lightBlue",
    Running: "#ccccc",
  };

  const customize = {
    height: 300,
    legend: { hidden: true },
    margin: { top: 5, left: 90, right: 70 },
  };

  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box>
        <Typography className="page-text-indicator">Dashboard</Typography>
      </Box>
      <Box className="welcome-message">
        <Box className="welcome-details">
          <Typography className="welcome-text">Welcome back!</Typography>
          <Typography className="welcome-username">
            {userData?.username?.toUpperCase()}!
          </Typography>
        </Box>
        <Box>
          <img
            src={welcomeImage}
            alt="Welcome"
            className="dashboard-welcome-image"
            draggable="false"
          />
        </Box>
      </Box>
      {hasAccess(["status_graph"]) && (
        <Paper className="dashboard-paper">
          <Typography className="page-text-indicator">Status</Typography>

          {
            <Stack
              flexDirection={"row"}
              marginInlineEnd={8}
              alignItems={"center"}
              justifyContent={"flex-end"}
            >
              <Box className={`filter-dashboard-graph ${filter ? "open" : ""}`}>
                <Autocomplete
                  control={control}
                  name={"bank_id"}
                  options={bank?.result?.data || []}
                  getOptionLabel={(option) => option?.name}
                  isOptionEqualToValue={(option, value) => option === value}
                  onClose={async () => {
                    if (watch("bank_id") !== null) {
                      const obj = {
                        bank_id: watch("bank_id")?.id,
                      };
                      onFilterChange(obj);
                    }
                  }}
                  renderInput={(params) => (
                    <MuiTextField
                      name="ap_tagging"
                      {...params}
                      placeholder="Select Bank"
                      size="small"
                      variant="outlined"
                      error={Boolean(errors.bank_id)}
                      helperText={errors.bank_id?.message}
                      className="transaction-form-date history"
                    />
                  )}
                  disableClearable
                />
                <Controller
                  name="month_from"
                  control={control}
                  render={({ field: { onChange, value, ...restField } }) => (
                    <MobileDatePicker
                      className="transaction-form-date history"
                      placeholder="From"
                      format="MMMM YYYY"
                      value={value}
                      maxDate={watch("month_to")}
                      views={["month", "year"]}
                      onClose={async () => {
                        if (watch("month_from") !== null) {
                          const obj = {
                            month_from: moment(
                              new Date(watch("month_from"))
                            ).format("YYMM"),
                          };
                          onFromChange(obj);
                        }
                      }}
                      onChange={(e) => {
                        onChange(e);
                      }}
                      slotProps={{
                        textField: {
                          error: Boolean(errors?.month_from),
                          helperText: errors?.month_from?.message,
                          inputProps: {
                            placeholder: "From",
                          },
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="month_to"
                  control={control}
                  render={({ field: { onChange, value, ...restField } }) => (
                    <MobileDatePicker
                      className="transaction-form-date history"
                      format="MMMM YYYY"
                      value={value}
                      minDate={watch("from")}
                      views={["month", "year"]}
                      onClose={async () => {
                        if (watch("month_to") !== null) {
                          const obj = {
                            month_to: moment(
                              new Date(watch("month_to"))
                            ).format("YYMM"),
                          };
                          onToChange(obj);
                        }
                      }}
                      onChange={(e) => {
                        onChange(e);
                      }}
                      slotProps={{
                        textField: {
                          error: Boolean(errors?.month_to),
                          helperText: errors?.month_to?.message,
                          inputProps: {
                            placeholder: "To",
                          },
                        },
                      }}
                    />
                  )}
                />
              </Box>

              {dashboardBalance && (
                <Stack flexDirection={"row"} alignItems={"center"}>
                  <Button
                    variant="text"
                    color="primary"
                    className="button-add-tag-transaction"
                    onClick={() => {
                      reset();
                      onReset();
                      setFilter(!filter);
                    }}
                    startIcon={
                      filter ? (
                        <FilterAltOffOutlinedIcon />
                      ) : (
                        <FilterAltOutlinedIcon />
                      )
                    }
                  >
                    {filter ? "Clear" : "Filter"}
                  </Button>
                </Stack>
              )}
            </Stack>
          }
          {
            <Box className="dashboard-card-container">
              <LineChart
                dataset={
                  dashboardBalance?.result.map((item) => ({
                    Month: new Date(`${item.Month} 1, 2000`).getMonth(), // Convert to 0-based month index
                    Beginning: item.Beginning || 0,
                    "Accounts Payable": item["Accounts Payable"] || 0,
                    "Outstanding Payable": item["Outstanding Payable"] || 0,
                    "Outstanding Check": item["Outstanding Check"] || 0,
                    Paid: item.Paid || 0,
                    Running: item.Running || 0,
                  })) || []
                }
                grid={{
                  vertical: true,
                  horizontal: true,
                }}
                xAxis={[
                  {
                    dataKey: "Month",
                    valueFormatter: (value) => {
                      return moment().month(value).format("MMMM");
                    },

                    scaleType: "point",
                  },
                ]}
                series={Object.keys(keyToLabel).map((keys) => ({
                  dataKey: keys,
                  label: keyToLabel[keys],
                  color: colors[keys],
                  valueFormatter: (value) => {
                    return convertToPeso(parseFloat(value).toFixed(2));
                  },
                  showMark: false,
                }))}
                {...customize}
                loading={loadingBalance}
              />
            </Box>
          }
        </Paper>
      )}

      <Box className="dashboard-card-container">
        {hasAccess(["ap_tag"]) &&
          apDash?.map((item, index) => {
            return (
              <CardHistory
                key={index}
                name={item?.name}
                description={"Total unread"}
                badge={
                  badgeCheck?.result?.[item?.status] ||
                  badgeTagging?.result?.[item?.status] ||
                  treasuryCount?.result?.[item?.status] ||
                  "0"
                }
                onClick={() => {
                  dispatch(setHeader(item?.name));
                  navigate(item?.path);
                }}
              />
            );
          })}

        {hasAccess(["approver"]) &&
          approverDash?.map((item, index) => {
            return (
              <CardHistory
                key={index}
                name={item?.name}
                description={"Total unread"}
                badge={
                  badgeCheck?.result?.[item?.status] ||
                  badgeTagging?.result?.[item?.status] ||
                  treasuryCount?.result?.[item?.status] ||
                  "0"
                }
                onClick={() => {
                  dispatch(setHeader(item?.name));
                  navigate(item?.path);
                }}
              />
            );
          })}
      </Box>

      {hasAccess(["status_graph"]) && (
        <Dialog open={loadingBalance} className="loading-transaction-create">
          <Lottie animationData={loading} loop />
        </Dialog>
      )}
    </Box>
  );
};

export default Dashboard;

import React, { useRef } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField as MuiTextField,
} from "@mui/material";

import "../../components/styles/Dashboard.scss";
import "../../components/styles/TransactionModal.scss";

import welcomeImage from "../../assets/svg/undraw_hello_re_3evm.svg";
import Breadcrums from "../../components/customs/Breadcrums";
import CardHistory from "../../components/customs/CardHistory";
import { hasAccess } from "../../services/functions/access";
import { apDash, approverDash } from "../../services/constants/headers";
import {
  useAccountTitlesQuery,
  useCheckCountQuery,
  useCountScheduleQuery,
  useJournalCountQuery,
  useTransactCountQuery,
  useTreasuryCountQuery,
} from "../../services/store/request";
import {
  useDashboardBalanceQuery,
  useGjCountQuery,
} from "../../services/store/seconAPIRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setHeader } from "../../services/slice/headerSlice";
import useParamsHook from "../../services/hooks/useParamsHook";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MobileDatePicker } from "@mui/x-date-pickers";
import Autocomplete from "../../components/customs/AutoComplete";
import dashboardSchema from "../../schemas/dashboardSchema";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const { min_amount, max_amount } = userData?.amount || {};
  const apCodes = userData?.scope_tagging?.map((item) => item?.ap_code);
  const isAP = min_amount === "0.00" && max_amount === "0.00";

  const queryParams = {
    ap: apCodes,
    min: isAP || apCodes?.length !== 0 ? "" : min_amount,
    max: isAP || apCodes?.length !== 0 ? "" : max_amount,
  };

  const { params } = useParamsHook();
  const { params: coaParams, onSearchData: searchCoa } = useParamsHook();

  const { data: badgeTagging } = useTransactCountQuery({ ap: apCodes });
  const { data: badgeCheck } = useCheckCountQuery(queryParams);
  const { data: badgeJournal } = useJournalCountQuery(queryParams);
  const { data: scheduleTransaction } = useCountScheduleQuery(queryParams);
  const { data: badgeGj } = useGjCountQuery(queryParams);
  const { data: treasuryCount } = useTreasuryCountQuery();

  const { data: dashboardBalance } = useDashboardBalanceQuery(params);
  const {
    data: coa,
    isLoading: loadingCoa,
    isFetching: fetchingCoa,
  } = useAccountTitlesQuery(coaParams);

  const debounceTimer = useRef(null);

  console.log(coa);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(dashboardSchema),
    defaultValues: {
      year: null,
      type: null,
      date: null,
    },
  });

  const treasuryTotal = [
    {
      name: "Beginning",
      path: "/",
      header: "",
    },
    {
      name: "Outstanding Payable",
      path: "/",
      header: "",
    },
    {
      name: "Outstanding",
      path: "/treasury/check",
      header: "For Releasing",
    },
    {
      name: "Paid",
      path: "/treasury/check",
      header: "Clearing",
    },
    {
      name: "Running",
      path: "/",
      header: "",
    },
  ];

  const handleInputChange = (event, data) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      searchCoa(data); // Call the function after 0.5 seconds
    }, 1000);
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
      {hasAccess(["preparation", "releasing", "clearing"]) && (
        <Stack flexDirection={"row"}>
          <Controller
            name="year"
            control={control}
            render={({ field: { onChange, value, ...restField } }) => (
              <MobileDatePicker
                className="transaction-form-date history"
                format="YYYY"
                value={value}
                views={["year"]}
                onChange={(e) => {
                  onChange(e);
                  setValue("type", null);
                  setValue("date", null);
                }}
                closeOnSelect
              />
            )}
          />
          <Autocomplete
            disabled={!watch("year")}
            control={control}
            onInputChange={handleInputChange}
            name={"type"}
            options={
              coa?.result?.data?.filter((coa) =>
                coa?.name?.startsWith("CIB")
              ) || []
            }
            getOptionLabel={(option) => option?.name}
            isOptionEqualToValue={(option, value) =>
              option?.status === value?.status
            }
            renderInput={(params) => (
              <MuiTextField
                name="ap_tagging"
                {...params}
                placeholder="Select Type"
                size="small"
                variant="outlined"
                error={Boolean(errors.ap)}
                helperText={errors.ap?.message}
                className="transaction-form-date history"
              />
            )}
          />
          {watch("type") !== null && (
            <Autocomplete
              control={control}
              name={"date"}
              options={[]}
              isOptionEqualToValue={(option, value) => option === value}
              renderInput={(params) => (
                <MuiTextField
                  name="ap_tagging"
                  {...params}
                  placeholder="Select Date"
                  size="small"
                  variant="outlined"
                  error={Boolean(errors.ap)}
                  helperText={errors.ap?.message}
                  className="transaction-form-date history"
                />
              )}
            />
          )}
        </Stack>
      )}
      {hasAccess(["preparation", "releasing", "clearing"]) && (
        <Box className="dashboard-card-container">
          {treasuryTotal?.map((item) => {
            return (
              <CardHistory
                key={item?.name}
                name={item.name}
                description={"Balance"}
                balance={dashboardBalance?.result?.[item?.name] || "0"}
                onClick={() => {
                  dispatch(setHeader(item?.header));
                  navigate(item?.path);
                }}
              />
            );
          })}
        </Box>
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
    </Box>
  );
};

export default Dashboard;

import { Box, Dialog, TextField as MuiTextField, Stack } from "@mui/material";
import React, { useEffect } from "react";
import "../../components/styles/TagTransaction.scss";
import "../../components/styles/TransactionModal.scss";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import historySchema from "../../schemas/historySchema";
import { DatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import Autocomplete from "../../components/customs/AutoComplete";
import { apHistoryHeader } from "../../services/constants/headers";
import { useDispatch, useSelector } from "react-redux";
import { setHeader } from "../../services/slice/headerSlice";
import HistoryTable from "./HistoryTable";
import {
  useLazyGetMonthGJQuery,
  useLazyGetMonthVPQuery,
} from "../../services/store/seconAPIRequest";
import { useHistoryContext } from "../../services/context/HistoryContext";
import TransactionModal from "../../components/customs/modal/TransactionModal";
import TransactionModalApprover from "../../components/customs/modal/TransactionModalApprover";
import { resetSync, setShownTable } from "../../services/slice/syncSlice";
import { setVoucher } from "../../services/slice/optionsSlice";

const Voucher = () => {
  const isShownTable = useSelector((state) => state.sync.isShownTable);
  const menuData = useSelector((state) => state.menu.menuData);
  const isDisplayed = useSelector((state) => state.sync.isDisplayed);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(historySchema),
    defaultValues: {
      year: null,
      type: null,
      date: null,
    },
  });
  const dispatch = useDispatch();
  const { params, getChecks, onTagYearChange } = useHistoryContext();

  const [getMonthVP, { data, isLoading, isError }] = useLazyGetMonthVPQuery();
  const [
    getMonthGJ,
    { data: gjMonth, isLoading: gjMonthLoading, isError: gjMonthError },
  ] = useLazyGetMonthGJQuery();

  const getMonthVPHandler = async () => {
    const obj = {
      year: moment(new Date(getValues("year")))
        .get("y")
        .toString(),
    };
    try {
      const res =
        watch("type")?.name === "Voucher's Payable"
          ? await getMonthVP(obj).unwrap()
          : await getMonthGJ(obj).unwrap();
    } catch (error) {}
  };

  const handleGetTransaction = async () => {
    const year = moment(new Date(getValues("year"))).format("YYYY");
    const fullDate = moment(new Date(`${watch("date")} 1, ${year}`)).format(
      "YYMM"
    );
    onTagYearChange(fullDate);
    const obj = {
      ...params,
      tagYear: fullDate,
    };
    try {
      const res = await getChecks(obj).unwrap();
      dispatch(setShownTable(true));
    } catch (error) {}
  };

  useEffect(() => {
    if (watch("type") === null) {
      dispatch(setShownTable(false));
    }
  }, [dispatch]);

  return (
    <Box className="tag-transaction-body-container history">
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
          name={"type"}
          options={apHistoryHeader || []}
          getOptionLabel={(option) => option?.name}
          isOptionEqualToValue={(option, value) =>
            option?.status === value?.status
          }
          onClose={() => {
            getMonthVPHandler();
            dispatch(setHeader(watch("type")?.name));
            dispatch(setShownTable(false));
            setValue("date", null);
          }}
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
            loading={isLoading || gjMonthLoading}
            control={control}
            name={"date"}
            options={
              isError || gjMonthError
                ? []
                : watch("type")?.name === "Voucher's Payable"
                ? data?.result || []
                : gjMonth?.result || []
            }
            isOptionEqualToValue={(option, value) => option === value}
            onClose={() => handleGetTransaction()}
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

      <Box className="history-box-container history">
        {isShownTable && <HistoryTable />}
      </Box>

      <Dialog
        open={isDisplayed}
        className="transaction-modal-dialog"
        onClose={() => {
          dispatch(resetSync());
        }}
      >
        <TransactionModalApprover history />
      </Dialog>
    </Box>
  );
};

export default Voucher;

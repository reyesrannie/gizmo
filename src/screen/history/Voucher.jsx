import { Box, TextField as MuiTextField, Stack } from "@mui/material";
import React from "react";
import "../../components/styles/TagTransaction.scss";
import "../../components/styles/TransactionModal.scss";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import historySchema from "../../schemas/historySchema";
import { DatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { useGetMonthQuery } from "../../services/store/seconAPIRequest";
import moment from "moment";
import CardHistory from "../../components/customs/CardHistory";
import Lottie from "lottie-react";
import loading from "../../assets/lottie/Loading-2.json";
import noData from "../../assets/lottie/NoData.json";
import useHistoryHook from "../../services/hooks/useHistoryHook";
import Autocomplete from "../../components/customs/AutoComplete";
import { apHistoryHeader } from "../../services/constants/headers";
import { useDispatch } from "react-redux";
import { setHeader } from "../../services/slice/headerSlice";

const Voucher = () => {
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
    },
  });
  const dispatch = useDispatch();
  const { params, onChangeDate } = useHistoryHook();

  const { data, isLoading, isError } = useGetMonthQuery(params, {
    skip: watch("year") === null,
  });

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
                const newDate = moment(new Date(e)).get("y").toString();
                onChangeDate(newDate);
                onChange(e);
              }}
              closeOnSelect
            />
          )}
        />
        <Autocomplete
          control={control}
          name={"type"}
          options={apHistoryHeader || []}
          getOptionLabel={(option) => option?.name}
          isOptionEqualToValue={(option, value) =>
            option?.status === value?.status
          }
          onClose={() => dispatch(setHeader(watch("type")?.name))}
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
      </Stack>

      <Box
        className={
          isLoading || data === undefined || isError
            ? "history-box-container history-noData"
            : "history-box-container history"
        }
      >
        {isLoading ? (
          <Lottie animationData={loading} className="loading-tag-transaction" />
        ) : isError ? (
          <Lottie animationData={noData} className="loading-tag-transaction" />
        ) : (
          data?.result?.map((item, index) => {
            return <CardHistory key={index} name={item} desc={`Transaction`} />;
          })
        )}
      </Box>
    </Box>
  );
};

export default Voucher;

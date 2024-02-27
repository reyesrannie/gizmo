import { Box, Button, Dialog, Divider, Paper, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dateSync from "../../../assets/svg/data-sync.svg";
import React, { useEffect } from "react";

import "../../styles/DateRange.scss";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import dateRangeSchema from "../../../schemas/dateRangeSchema";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { resetSync, setIsSyncing } from "../../../services/slice/syncSlice";
import moment from "moment";
import { useFistoQuery } from "../../../services/store/fistoRequest";
import { enqueueSnackbar } from "notistack";
import useFistoHook from "../../../services/hooks/useFistoHook";
import Lottie from "lottie-react";
import loading from "../../../assets/lottie/Loading.json";

const DateRange = () => {
  const dispatch = useDispatch();
  const isSyncing = useSelector((state) => state.sync.isSyncing);
  const { params, onDateRange } = useFistoHook();
  const { data, isLoading, refetch, isSuccess } = useFistoQuery(params, {
    skip: isSyncing,
  });

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(dateRangeSchema),
    defaultValues: {
      from: null,
      to: null,
    },
  });

  const submitHandler = async (submitData) => {
    const obj = {
      from: moment(submitData?.from).format("YYYY-MM-DD"),
      to: moment(submitData?.to).format("YYYY-MM-DD"),
    };

    onDateRange(obj);
    dispatch(setIsSyncing(false));
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setIsSyncing(true));
    }
  }, [isSuccess]);

  return (
    <Paper className="date-range-modal-container">
      <img
        src={dateSync}
        alt="date-range"
        className="date-range-image"
        draggable="false"
      />
      <Typography className="date-range-text">Fisto data sync</Typography>
      <Divider orientation="horizontal" className="date-range-devider" />
      <Box className="form-title-date-range">
        <Typography className="form-title-text-date-range">
          Date Range
        </Typography>
      </Box>
      <form
        className="add-date-range-form-container"
        onSubmit={handleSubmit(submitHandler)}
      >
        <Box className="select-date-range">
          <Controller
            name="from"
            control={control}
            render={({ field: { onChange, ...restField } }) => (
              <Box className="date-picker-container">
                <DatePicker
                  className="date-range-input-field"
                  label="From"
                  format="YYYY-MM-DD"
                  maxDate={watch("to")}
                  onChange={(e) => {
                    onChange(e);
                  }}
                />
                {errors.from && (
                  <Typography variant="caption" color="error">
                    {errors.from.message}
                  </Typography>
                )}
              </Box>
            )}
          />
          <Controller
            name="to"
            control={control}
            render={({ field: { onChange, ...restField } }) => (
              <Box className="date-picker-container">
                <DatePicker
                  className="date-range-input-field"
                  label="To"
                  format="YYYY-MM-DD"
                  onChange={(e) => {
                    onChange(e);
                  }}
                  minDate={watch("from")}
                />
                {errors.to && (
                  <Typography variant="caption" color="error">
                    {errors.to.message}
                  </Typography>
                )}
              </Box>
            )}
          />
        </Box>
        <Divider orientation="horizontal" className="date-range-devider" />
        <Box className="add-date-range-button-container">
          <LoadingButton
            variant="contained"
            color="warning"
            type="submit"
            className="add-date-range-button"
            disabled={Boolean(!watch("from") || !watch("to"))}
          >
            Sync
          </LoadingButton>

          <Button
            variant="contained"
            color="primary"
            className="add-date-range-button"
            onClick={() => dispatch(resetSync())}
          >
            Cancel
          </Button>
        </Box>
      </form>

      <Dialog open={!isSyncing} className="loading-user-create">
        <Lottie animationData={loading} loop={!isSyncing} />
      </Dialog>
    </Paper>
  );
};

export default DateRange;

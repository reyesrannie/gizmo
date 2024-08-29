import {
  Box,
  Button,
  Paper,
  Typography,
  TextField as MuiTextField,
  Dialog,
} from "@mui/material";
import React, { useEffect } from "react";
import "../styles/AppPrompt.scss";
import "../styles/TransactionModal.scss";
import "../styles/RolesModal.scss";

import { LoadingButton } from "@mui/lab";
import receiveImg from "../../assets/svg/receive.svg";
import { useDispatch, useSelector } from "react-redux";
import { resetPrompt } from "../../services/slice/promptSlice";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import loadingLight from "../../assets/lottie/Loading.json";

import AppTextBox from "./AppTextBox";

import Lottie from "lottie-react";

import clearingSchema from "../../schemas/clearingSchema";
import Autocomplete from "./AutoComplete";
import { useDocumentTypeQuery } from "../../services/store/request";
import { DatePicker } from "@mui/x-date-pickers";
import { setReceiveMenu, setTaxData } from "../../services/slice/menuSlice";
import moment from "moment";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const ClearCheck = () => {
  const dispatch = useDispatch();
  const disableProceed = useSelector((state) => state.prompt.disableProceed);
  const taxData = useSelector((state) => state.menu.taxData);

  const {
    data: document,
    isLoading: loadingDocument,
    isSuccess: documentSuccess,
  } = useDocumentTypeQuery({
    status: "active",
    pagination: "none",
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(clearingSchema),
    defaultValues: {
      or_document_id: null,
      or_no: "",
      or_date: null,
    },
  });

  useEffect(() => {
    if (taxData) {
      const items = {
        or_document_id: document?.result?.find(
          (item) => taxData?.or_document_id === item?.id
        ),
        or_no: taxData?.or_no,
        or_date:
          dayjs(new Date(taxData?.or_date), {
            locale: AdapterDayjs.locale,
          }) || null,
      };

      Object.entries(items).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [taxData]);

  const submitHandler = async (submitData) => {
    dispatch(
      setTaxData({
        ...submitData,
        or_document_id: submitData?.or_document_id?.id,
        or_date: moment(submitData?.or_date).format("YYYY-MM-DD"),
      })
    );
    dispatch(setReceiveMenu(false));
  };

  return (
    <Paper className="app-prompt-container">
      <img
        src={receiveImg}
        alt="Password"
        className="app-prompt-image"
        draggable="false"
      />
      <Typography className="app-prompt-title">Input OR</Typography>
      <Typography className="app-prompt-text" sx={{ marginBottom: 2 }}>
        Please fill out the following
      </Typography>

      <form
        className="form-container-transaction clearing"
        onSubmit={handleSubmit(submitHandler)}
      >
        <Autocomplete
          control={control}
          name={"or_document_id"}
          options={document?.result || []}
          getOptionLabel={(option) => `${option?.code} - ${option?.name}`}
          isOptionEqualToValue={(option, value) => option.code === value.code}
          renderInput={(params) => (
            <MuiTextField
              name="document_type"
              {...params}
              label="OR Document Type *"
              size="small"
              variant="outlined"
              error={Boolean(errors.or_document_id)}
              helperText={errors.or_document_id?.message}
              className="transaction-form-textBox receive"
            />
          )}
        />
        <AppTextBox
          control={control}
          name={"or_no"}
          label={"OR NO. *"}
          color="primary"
          className="transaction-form-textBox receive"
          error={Boolean(errors?.or_no)}
          helperText={errors?.or_no?.message}
        />

        <Controller
          name="or_date"
          control={control}
          render={({ field: { onChange, value, ...restField } }) => (
            <Box className="date-picker-container">
              <DatePicker
                className="transaction-form-date"
                label="OR Date *"
                format="MM/DD/YYYY"
                value={value}
                onChange={(e) => {
                  onChange(e);
                }}
                slotProps={{
                  textField: {
                    error: Boolean(errors?.or_date),
                    helperText: errors?.or_date?.message,
                  },
                }}
              />
            </Box>
          )}
        />
        <Box className="app-prompt-button-container">
          <LoadingButton
            disabled={disableProceed}
            variant="contained"
            color="warning"
            className="change-password-button"
            type="submit"
          >
            Proceed
          </LoadingButton>
          <Button
            variant="contained"
            color="primary"
            className="change-password-button"
            onClick={() => dispatch(setReceiveMenu(false))}
          >
            cancel
          </Button>
        </Box>
      </form>

      <Dialog open={loadingDocument} className="loading-role-create">
        <Lottie animationData={loadingLight} loop />
      </Dialog>
    </Paper>
  );
};

export default ClearCheck;

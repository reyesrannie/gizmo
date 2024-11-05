import {
  Box,
  Button,
  Paper,
  Typography,
  TextField as MuiTextField,
  Dialog,
  IconButton,
} from "@mui/material";
import React, { useEffect } from "react";
import "../styles/AppPrompt.scss";
import "../styles/TransactionModal.scss";
import "../styles/RolesModal.scss";

import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
import { LoadingButton } from "@mui/lab";
import receiveImg from "../../assets/svg/receive.svg";
import { useDispatch, useSelector } from "react-redux";
import { resetPrompt } from "../../services/slice/promptSlice";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import loadingLight from "../../assets/lottie/Loading.json";

import AppTextBox from "./AppTextBox";

import Lottie from "lottie-react";

import clearingSchema from "../../schemas/clearingSchema";
import Autocomplete from "./AutoComplete";
import {
  useDocumentTypeQuery,
  useFileCVoucherMutation,
} from "../../services/store/request";
import { DatePicker } from "@mui/x-date-pickers";
import {
  resetMenu,
  setReceiveMenu,
  setTaxData,
} from "../../services/slice/menuSlice";
import moment from "moment";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { enqueueSnackbar } from "notistack";
import { objectError } from "../../services/functions/errorResponse";

const ClearCheck = () => {
  const dispatch = useDispatch();
  const disableProceed = useSelector((state) => state.prompt.disableProceed);
  const taxData = useSelector((state) => state.menu.taxData);
  const menuData = useSelector((state) => state.menu.menuData);

  const {
    data: document,
    isLoading: loadingDocument,
    isSuccess: documentSuccess,
  } = useDocumentTypeQuery({
    status: "active",
    pagination: "none",
  });

  const [fileVoucher, { isLoading: loadingFile }] = useFileCVoucherMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(clearingSchema),
    defaultValues: {
      treasury_receipts: [
        {
          id: Date.now(),
          or_document_id: null,
          or_no: "",
          or_date: null,
        },
      ],
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
    const obj = {
      id: menuData?.id,
      treasury_receipts: submitData?.treasury_receipts?.map((item) => ({
        receipt_id: item?.or_document_id?.id,
        receipt_no: item?.or_no,
        receipt_date: moment(item?.or_date).format("YYYY-MM-DD"),
      })),
    };
    try {
      const res = await fileVoucher(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "treasury_receipts",
  });

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

      <form onSubmit={handleSubmit(submitHandler)}>
        {fields?.map((item, index) => {
          return (
            <Box className="form-container-transaction clearing" key={item?.id}>
              <Autocomplete
                control={control}
                name={`treasury_receipts.${index}.or_document_id`}
                options={document?.result || []}
                getOptionLabel={(option) => `${option?.code} - ${option?.name}`}
                isOptionEqualToValue={(option, value) =>
                  option.code === value.code
                }
                renderInput={(params) => (
                  <MuiTextField
                    name="document_type"
                    {...params}
                    label="OR Document Type *"
                    size="small"
                    variant="outlined"
                    error={Boolean(
                      errors?.treasury_receipts?.[index]?.or_document_id
                    )}
                    helperText={
                      errors?.treasury_receipts?.[index]?.or_document_id
                        ?.message
                    }
                    className="transaction-form-textBox receive"
                  />
                )}
              />
              <AppTextBox
                control={control}
                name={`treasury_receipts.${index}.or_no`}
                label={"OR NO. *"}
                color="primary"
                className="transaction-form-textBox receive"
                error={Boolean(errors?.treasury_receipts?.[index]?.or_no)}
                helperText={errors?.treasury_receipts?.[index]?.or_no?.message}
              />

              <Controller
                name={`treasury_receipts.${index}.or_date`}
                control={control}
                render={({ field: { onChange, value, ...restField } }) => (
                  <DatePicker
                    className="transaction-form-date recieve"
                    label="OR Date *"
                    format="MM/DD/YYYY"
                    value={value}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    slotProps={{
                      textField: {
                        error: Boolean(
                          errors?.treasury_receipts?.[index]?.or_date
                        ),
                        helperText:
                          errors?.treasury_receipts?.[index]?.or_date?.message,
                      },
                    }}
                  />
                )}
              />
              <IconButton
                onClick={() => {
                  remove(index);
                }}
                disabled={fields?.length === 1}
              >
                <DoNotDisturbOnOutlinedIcon
                  color={fields?.length === 1 ? "disabled" : "error"}
                />
              </IconButton>
            </Box>
          );
        })}
        <Box className="app-prompt-button-container">
          <Box>
            <Button
              variant="contained"
              color="success"
              className="change-password-button"
              onClick={() =>
                append({
                  id: Date.now(),
                  or_document_id: null,
                  or_no: "",
                  or_date: null,
                })
              }
            >
              Add
            </Button>
          </Box>
          <Box className="app-prompt-button-container buttons">
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
        </Box>
      </form>

      <Dialog
        open={loadingDocument || loadingFile}
        className="loading-role-create"
      >
        <Lottie animationData={loadingLight} loop />
      </Dialog>
    </Paper>
  );
};

export default ClearCheck;

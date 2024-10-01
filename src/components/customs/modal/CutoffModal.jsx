import { Box, Button, Dialog, Divider, Paper, Typography } from "@mui/material";
import React from "react";

import "../../styles/CompanyModal.scss";
import "../../styles/TransactionModal.scss";

import company from "../../../assets/svg/company.svg";
import loading from "../../../assets/lottie/Loading-2.json";
import Lottie from "lottie-react";

import { LoadingButton } from "@mui/lab";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { resetMenu } from "../../../services/slice/menuSlice";
import {
  useApproveCutOffMutation,
  useCreateCutOffMutation,
  useUpdateCutOffMutation,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import { objectError } from "../../../services/functions/errorResponse";
import { DatePicker } from "@mui/x-date-pickers";
import cutoffSchema from "../../../schemas/cutoffSchema";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment";

import ReasonInput from "../ReasonInput";
import { resetPrompt, setWarning } from "../../../services/slice/promptSlice";
import { hasAccess } from "../../../services/functions/access";
import TransactionDrawer from "../TransactionDrawer";

const CutoffModal = ({ view, update }) => {
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const openWarning = useSelector((state) => state.prompt.warning);

  const { enqueueSnackbar } = useSnackbar();

  const [createCutOff, { isLoading }] = useCreateCutOffMutation();
  const [updateCutOff, { isLoading: updateLoading }] =
    useUpdateCutOffMutation();
  const [approveCutOff, { isLoading: approveLoading }] =
    useApproveCutOffMutation();

  const defaultValues = {
    date: null,
  };

  const oldDate = dayjs(menuData?.date, "YYYY-MM-DD").toDate();
  const cutOffDate =
    dayjs(new Date(oldDate), { locale: AdapterDayjs.locale }) || null;
  const defaultData = {
    date: cutOffDate,
  };

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(cutoffSchema),
    defaultValues: view || update ? defaultData : defaultValues,
  });

  const submitHandler = async (submitData) => {
    const obj = {
      ...submitData,
      date: moment(submitData?.date).format("YYYY-MM-DD"),
      id: view || update ? menuData?.id : null,
    };

    try {
      const res = update
        ? await updateCutOff(obj).unwrap()
        : await createCutOff(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const returnHandler = async (submitData) => {
    const obj = {
      ...submitData,
      date: moment(menuData?.date).format("YYYY-MM-DD"),
      id: view || update ? menuData?.id : null,
    };

    try {
      const res = await updateCutOff(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const approveHandler = async (submitData) => {
    const obj = {
      date: moment(menuData?.date).format("YYYY-MM-DD"),
      id: view || update ? menuData?.id : null,
    };

    try {
      const res = await approveCutOff(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  return (
    <Paper className="company-modal-container">
      <img
        src={company}
        alt="company"
        className="company-image"
        draggable="false"
      />

      <Typography className="company-text">
        {!update && "Add Cutoff"}
        {update &&
          menuData?.state === "closed" &&
          hasAccess(["cutOff_requestor"]) &&
          "Re-open Cutoff"}
        {update &&
          menuData?.state === "pending" &&
          hasAccess(["cutOff_requestor"]) &&
          "Update Cutoff"}
        {update &&
          menuData?.state === "pending" &&
          hasAccess(["cutOff_approver"]) &&
          "Approve Close"}
        {update &&
          menuData?.state === "closed" &&
          hasAccess(["cutOff_approver"]) &&
          "Approve Reopen"}
      </Typography>
      <Divider orientation="horizontal" className="company-devider" />

      <form
        className="add-company-form-container"
        onSubmit={handleSubmit(submitHandler)}
      >
        <Controller
          name="date"
          control={control}
          render={({ field: { onChange, value, ...restField } }) => (
            <Box className="date-picker-container-transaction">
              <DatePicker
                disabled={
                  menuData?.state === "closed" || hasAccess(["cutOff_approver"])
                }
                className="transaction-form-date"
                label="Tag year month *"
                format="YY MM"
                value={value}
                views={["month", "year"]}
                onChange={(e) => {
                  onChange(e);
                }}
              />
              {errors.date && (
                <Typography variant="caption" color="error">
                  {errors.date.message}
                </Typography>
              )}
            </Box>
          )}
        />

        <Box className="add-company-button-container">
          {!view && hasAccess(["cutOff_requestor"]) && (
            <LoadingButton
              variant="contained"
              color="warning"
              type={
                update && menuData?.state === "closed" ? "button" : "submit"
              }
              className="add-company-button"
              disabled={!watch("date")}
              onClick={() =>
                update &&
                menuData?.state === "closed" &&
                dispatch(setWarning(true))
              }
            >
              {!update && "Add"}
              {update && menuData?.state === "pending" && "Update"}
              {update && menuData?.state === "closed" && "Re-open"}
            </LoadingButton>
          )}
          {!view && hasAccess(["cutOff_approver"]) && (
            <LoadingButton
              variant="contained"
              color="warning"
              className="add-company-button"
              disabled={!watch("date") || menuData?.requested_at === null}
              onClick={() =>
                menuData?.requested_at !== null && approveHandler()
              }
            >
              Approve
            </LoadingButton>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(resetMenu())}
            className="add-company-button"
          >
            {view ? "Close" : update ? "Cancel" : "Cancel"}
          </Button>
        </Box>
      </form>

      <Dialog
        open={isLoading || updateLoading || approveLoading}
        className="loading-company-create"
      >
        <Lottie animationData={loading} loop />
      </Dialog>

      <Dialog open={openWarning}>
        <ReasonInput
          title={"Reason for Re-open"}
          reasonDesc={"Please enter the reason for opening this month"}
          warning={
            "Please note that this request will be forwarded to Approver for further processing. Kindly provide a reason for this action."
          }
          confirmButton={"Confirm"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          confirmOnClick={(e) => returnHandler(e)}
        />
      </Dialog>

      <TransactionDrawer cutOff />
    </Paper>
  );
};

export default CutoffModal;

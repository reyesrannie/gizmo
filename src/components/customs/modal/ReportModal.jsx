import {
  Box,
  Button,
  Paper,
  Typography,
  TextField as MuiTextField,
  Dialog,
} from "@mui/material";
import React from "react";
import "../../styles/AppPrompt.scss";
import "../../styles/TransactionModal.scss";
import "../../styles/RolesModal.scss";

import { LoadingButton } from "@mui/lab";
import receiveImg from "../../../assets/svg/receive.svg";
import { useDispatch, useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import loadingLight from "../../../assets/lottie/Loading.json";

import Lottie from "lottie-react";

import reportSchema from "../../../schemas/reportSchema";
import { reportOptions } from "../../../services/constants/reports";
import Autocomplete from "../AutoComplete";
import { useReportQuery } from "../../../services/store/request";
import useReportHook from "../../../services/hooks/useReportHook";
import { setMenuData, setViewMenu } from "../../../services/slice/menuSlice";

const ReportModal = () => {
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(reportSchema),
    defaultValues: {
      report: null,
    },
  });

  const { params } = useReportHook();

  const {
    data: reportData,
    isError,
    isLoading,
  } = useReportQuery(
    { ...params, tag_year: menuData?.tag_year },
    {
      skip: watch("report") === null || menuData?.tag_year === undefined,
    }
  );

  const submitHandler = async (submitData) => {
    const generate = submitData?.report?.function;
    try {
      await generate(reportData, menuData, submitData?.report?.name);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper className="app-prompt-container">
      <img
        src={receiveImg}
        alt="Password"
        className="app-prompt-image"
        draggable="false"
      />
      <Typography className="app-prompt-title">Select Report</Typography>
      <Typography className="app-prompt-text" sx={{ marginBottom: 2 }}>
        To continue please select report to extract
      </Typography>

      <form
        className="form-container-transaction width"
        onSubmit={handleSubmit(submitHandler)}
      >
        <Autocomplete
          control={control}
          name={"report"}
          options={reportOptions || []}
          getOptionLabel={(option) => `${option?.name}`}
          isOptionEqualToValue={(option, value) => option?.name === value?.name}
          renderInput={(params) => (
            <MuiTextField
              name="document_type"
              {...params}
              label="Report *"
              size="small"
              variant="outlined"
              error={Boolean(errors?.report)}
              helperText={errors?.report?.message}
              className="transaction-form-textBox receive"
            />
          )}
        />
        <Box className="app-prompt-button-container">
          <LoadingButton
            disabled={reportData === undefined || isError}
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
            onClick={() => {
              dispatch(setMenuData(null));
              dispatch(setViewMenu(false));
            }}
          >
            cancel
          </Button>
        </Box>
      </form>

      <Dialog open={isLoading} className="loading-role-create">
        <Lottie animationData={loadingLight} loop />
      </Dialog>
    </Paper>
  );
};

export default ReportModal;

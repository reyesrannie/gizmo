import { Box, Button, Dialog, Divider, Paper, Typography } from "@mui/material";
import React from "react";

import "../../styles/CompanyModal.scss";
import company from "../../../assets/svg/company.svg";
import companySchema from "../../../schemas/companySchema";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Lottie from "lottie-react";

import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { resetMenu } from "../../../services/slice/menuSlice";
import {
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import { objectError } from "../../../services/functions/errorResponse";

const CompanyModal = ({ companyData, view, update }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [createCompany, { isLoading }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: updateLoading }] =
    useUpdateCompanyMutation();

  const defaultValues = {
    name: "",
    code: "",
  };

  const defaultData = {
    code: companyData?.code,
    name: companyData?.name,
  };

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(companySchema),
    defaultValues: view || update ? defaultData : defaultValues,
  });

  const submitHandler = async (submitData) => {
    const obj = {
      ...submitData,
      id: view || update ? companyData?.id : null,
    };

    if (update) {
      try {
        const res = await updateCompany(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    } else {
      try {
        const res = await createCompany(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
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
        {view ? "Company" : update ? "Update Company" : "Add Company"}
      </Typography>
      <Divider orientation="horizontal" className="company-devider" />

      <form
        className="add-company-form-container"
        onSubmit={handleSubmit(submitHandler)}
      >
        <AppTextBox
          disabled={view || update}
          control={control}
          name={"code"}
          label={"Code *"}
          color="primary"
          className="add-company-textbox"
          error={Boolean(errors?.code)}
          helperText={errors?.code?.message}
        />
        <AppTextBox
          disabled={view}
          control={control}
          name={"name"}
          label={"Name *"}
          color="primary"
          className="add-company-textbox"
          error={Boolean(errors?.name)}
          helperText={errors?.name?.message}
        />

        <Box className="add-company-button-container">
          {!view && (
            <LoadingButton
              variant="contained"
              color="warning"
              type="submit"
              className="add-company-button"
              disabled={!watch("name") || !watch("code")}
            >
              {update ? "Update" : "Add"}
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
        open={isLoading || updateLoading}
        className="loading-company-create"
      >
        <Lottie animationData={loading} loop={isLoading || updateLoading} />
      </Dialog>
    </Paper>
  );
};

export default CompanyModal;

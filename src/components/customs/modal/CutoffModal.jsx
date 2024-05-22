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
import { useDispatch } from "react-redux";
import { resetMenu } from "../../../services/slice/menuSlice";
import {
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import { objectError } from "../../../services/functions/errorResponse";
import { DatePicker } from "@mui/x-date-pickers";
import cutoffSchema from "../../../schemas/cutoffSchema";

const CutoffModal = ({ companyData, view, update }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [createCompany, { isLoading }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: updateLoading }] =
    useUpdateCompanyMutation();

  const defaultValues = {
    date: null,
  };

  const defaultData = {
    date: companyData?.date,
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
      id: view || update ? companyData?.id : null,
    };

    console.log(obj);

    // if (update) {
    //   try {
    //     const res = await updateCompany(obj).unwrap();
    //     enqueueSnackbar(res?.message, { variant: "success" });
    //     dispatch(resetMenu());
    //   } catch (error) {
    //     objectError(error, setError, enqueueSnackbar);
    //   }
    // } else {
    //   try {
    //     const res = await createCompany(obj).unwrap();
    //     enqueueSnackbar(res?.message, { variant: "success" });
    //     dispatch(resetMenu());
    //   } catch (error) {
    //     objectError(error, setError, enqueueSnackbar);
    //   }
    // }
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
        {view ? "Cutoff" : update ? "Update Cutoff" : "Add Cutoff"}
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
          {!view && (
            <LoadingButton
              variant="contained"
              color="warning"
              type="submit"
              className="add-company-button"
              disabled={!watch("date")}
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

export default CutoffModal;

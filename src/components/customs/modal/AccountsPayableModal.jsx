import React from "react";
import { Box, Button, Dialog, Divider, Paper, Typography } from "@mui/material";

import ap from "../../../assets/svg/ap.svg";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Lottie from "lottie-react";
import "../../styles/AccountsPayableModal.scss";

import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { resetMenu } from "../../../services/slice/menuSlice";
import {
  useCreateAPMutation,
  useUpdateAPMutation,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import { objectError } from "../../../services/functions/errorResponse";
import apSchema from "../../../schemas/apSchema";

const AccountsPayableModal = ({ apData, view, update }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [createAP, { isLoading }] = useCreateAPMutation();
  const [updateAP, { isLoading: updateLoading }] = useUpdateAPMutation();

  const defaultValues = {
    company_code: "",
    description: "",
  };

  const defaultData = {
    company_code: apData?.company_code,
    description: apData?.description,
  };

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(apSchema),
    defaultValues: view || update ? defaultData : defaultValues,
  });

  const submitHandler = async (submitData) => {
    const obj = {
      ...submitData,
      id: view || update ? apData?.id : null,
    };

    if (update) {
      try {
        const res = await updateAP(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    } else {
      try {
        const res = await createAP(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    }
  };

  return (
    <Paper className="ap-modal-container">
      <img src={ap} alt="ap" className="ap-image" draggable="false" />

      <Typography className="ap-text">
        {view ? "AP" : update ? "Update AP" : "Add AP"}
      </Typography>
      <Divider orientation="horizontal" className="ap-devider" />

      <form
        className="add-ap-form-container"
        onSubmit={handleSubmit(submitHandler)}
      >
        <AppTextBox
          disabled={view || update}
          control={control}
          name={"company_code"}
          label={"Code *"}
          color="primary"
          className="add-ap-textbox"
          error={Boolean(errors?.company_code)}
          helperText={errors?.company_code?.message}
        />
        <AppTextBox
          disabled={view}
          control={control}
          name={"description"}
          label={"Name *"}
          color="primary"
          className="add-ap-textbox"
          error={Boolean(errors?.description)}
          helperText={errors?.description?.message}
        />

        <Box className="add-ap-button-container">
          {!view && (
            <LoadingButton
              variant="contained"
              color="warning"
              type="submit"
              className="add-ap-button"
              disabled={!watch("company_code") || !watch("description")}
            >
              {update ? "Update" : "Add"}
            </LoadingButton>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(resetMenu())}
            className="add-ap-button"
          >
            {view ? "Close" : update ? "Cancel" : "Cancel"}
          </Button>
        </Box>
      </form>

      <Dialog open={isLoading || updateLoading} className="loading-ap-create">
        <Lottie animationData={loading} loop={isLoading || updateLoading} />
      </Dialog>
    </Paper>
  );
};

export default AccountsPayableModal;

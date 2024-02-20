import { Box, Button, Dialog, Divider, Paper, Typography } from "@mui/material";
import React from "react";

import "../../styles/VatModal.scss";
import vat from "../../../assets/svg/vat.svg";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Lottie from "lottie-react";

import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { resetMenu } from "../../../services/slice/menuSlice";
import {
  useCreateVATMutation,
  useUpdateVATMutation,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import { objectError } from "../../../services/functions/errorResponse";
import vatSchema from "../../../schemas/vatSchema";

const VatModal = ({ vatData, view, update }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [createVat, { isLoading }] = useCreateVATMutation();
  const [updateVat, { isLoading: updateLoading }] = useUpdateVATMutation();

  const defaultValues = {
    name: "",
    code: "",
  };

  const defaultData = {
    code: vatData?.code,
    name: vatData?.name,
  };

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(vatSchema),
    defaultValues: view || update ? defaultData : defaultValues,
  });

  const submitHandler = async (submitData) => {
    const obj = {
      ...submitData,
      id: view || update ? vatData?.id : null,
    };

    if (update) {
      try {
        const res = await updateVat(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    } else {
      try {
        const res = await createVat(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    }
  };

  return (
    <Paper className="vat-modal-container">
      <img src={vat} alt="vat" className="vat-image" draggable="false" />

      <Typography className="vat-text">
        {view ? "Vat" : update ? "Update Vat" : "Add Vat"}
      </Typography>
      <Divider orientation="horizontal" className="vat-devider" />

      <form
        className="add-vat-form-container"
        onSubmit={handleSubmit(submitHandler)}
      >
        <AppTextBox
          disabled={view}
          control={control}
          name={"code"}
          label={"Code *"}
          color="primary"
          className="add-vat-textbox"
          error={Boolean(errors?.code)}
          helperText={errors?.code?.message}
        />
        <AppTextBox
          disabled={view}
          control={control}
          name={"name"}
          label={"Name *"}
          color="primary"
          className="add-vat-textbox"
          error={Boolean(errors?.name)}
          helperText={errors?.name?.message}
        />

        <Box className="add-vat-button-container">
          {!view && (
            <LoadingButton
              variant="contained"
              color="warning"
              type="submit"
              className="add-vat-button"
              disabled={!watch("name") || !watch("code")}
            >
              {update ? "Update" : "Add"}
            </LoadingButton>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(resetMenu())}
            className="add-vat-button"
          >
            {view ? "Close" : update ? "Cancel" : "Cancel"}
          </Button>
        </Box>
      </form>

      <Dialog open={isLoading || updateLoading} className="loading-vat-create">
        <Lottie animationData={loading} loop={isLoading || updateLoading} />
      </Dialog>
    </Paper>
  );
};

export default VatModal;

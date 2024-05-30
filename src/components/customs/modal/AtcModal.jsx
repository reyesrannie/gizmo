import { Box, Button, Dialog, Divider, Paper, Typography } from "@mui/material";
import React from "react";

import "../../styles/AtcModal.scss";
import atc from "../../../assets/svg/atc.svg";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Lottie from "lottie-react";

import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { resetMenu } from "../../../services/slice/menuSlice";
import {
  useCreateATCMutation,
  useUpdateATCMutation,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import { objectError } from "../../../services/functions/errorResponse";
import atcSchema from "../../../schemas/atcSchema";
import socket from "../../../services/functions/serverSocket";

const AtcModal = ({ atcData, view, update }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [createAtc, { isLoading }] = useCreateATCMutation();
  const [updateAtc, { isLoading: updateLoading }] = useUpdateATCMutation();

  const defaultValues = {
    name: "",
    code: "",
  };

  const defaultData = {
    code: atcData?.code,
    name: atcData?.name,
  };

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(atcSchema),
    defaultValues: view || update ? defaultData : defaultValues,
  });

  const submitHandler = async (submitData) => {
    const obj = {
      ...submitData,
      id: view || update ? atcData?.id : null,
    };

    if (update) {
      try {
        const res = await updateAtc(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        socket.emit("atc_updated");
        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    } else {
      try {
        const res = await createAtc(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        socket.emit("atc_updated");
        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    }
  };

  return (
    <Paper className="atc-modal-container">
      <img src={atc} alt="atc" className="atc-image" draggable="false" />

      <Typography className="atc-text">
        {view ? "ATC" : update ? "Update ATC" : "Add ATC"}
      </Typography>
      <Divider orientation="horizontal" className="atc-devider" />

      <form
        className="add-atc-form-container"
        onSubmit={handleSubmit(submitHandler)}
      >
        <AppTextBox
          disabled={view || update}
          control={control}
          name={"code"}
          label={"Code *"}
          color="primary"
          className="add-atc-textbox"
          error={Boolean(errors?.code)}
          helperText={errors?.code?.message}
        />
        <AppTextBox
          disabled={view}
          control={control}
          name={"name"}
          label={"Name *"}
          color="primary"
          className="add-atc-textbox"
          error={Boolean(errors?.name)}
          helperText={errors?.name?.message}
        />

        <Box className="add-atc-button-container">
          {!view && (
            <LoadingButton
              variant="contained"
              color="warning"
              type="submit"
              className="add-atc-button"
              disabled={!watch("name") || !watch("code")}
            >
              {update ? "Update" : "Add"}
            </LoadingButton>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(resetMenu())}
            className="add-atc-button"
          >
            {view ? "Close" : update ? "Cancel" : "Cancel"}
          </Button>
        </Box>
      </form>

      <Dialog open={isLoading || updateLoading} className="loading-atc-create">
        <Lottie animationData={loading} loop={isLoading || updateLoading} />
      </Dialog>
    </Paper>
  );
};

export default AtcModal;

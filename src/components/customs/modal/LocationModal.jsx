import React from "react";

import "../../styles/LocationModal.scss";
import location from "../../../assets/svg/location.svg";
import loading from "../../../assets/lottie/Loading-2.json";

import { Box, Button, Dialog, Divider, Paper, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import locationSchema from "../../../schemas/locationSchema";
import AppTextBox from "../AppTextBox";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { resetMenu } from "../../../services/slice/menuSlice";
import {
  useCreateLocationMutation,
  useUpdateLocationMutation,
} from "../../../services/store/request";
import Lottie from "lottie-react";
import { objectError } from "../../../services/functions/errorResponse";

const LocationModal = ({ locationData, view, update }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    name: "",
    code: "",
  };

  const defaultData = {
    code: locationData?.code,
    name: locationData?.name,
  };

  const [createLocation, { isLoading }] = useCreateLocationMutation();
  const [updateLocation, { isLoading: updateLoading }] =
    useUpdateLocationMutation();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(locationSchema),
    defaultValues: view || update ? defaultData : defaultValues,
  });

  const submitHandler = async (submitData) => {
    const obj = {
      ...submitData,
      id: view || update ? locationData?.id : null,
    };

    if (update) {
      try {
        const res = await updateLocation(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    } else {
      try {
        const res = await createLocation(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    }
  };

  return (
    <Paper className="location-modal-container">
      <img
        src={location}
        alt="location"
        className="location-image"
        draggable="false"
      />

      <Typography className="location-text">
        {view ? "Location" : update ? "Update Location" : "Add Location"}
      </Typography>
      <Divider orientation="horizontal" className="location-devider" />

      <form
        className="add-location-form-container"
        onSubmit={handleSubmit(submitHandler)}
      >
        <AppTextBox
          disabled={view || update}
          control={control}
          name={"code"}
          label={"Code *"}
          color="primary"
          className="add-location-textbox"
          error={Boolean(errors?.code)}
          helperText={errors?.code?.message}
        />
        <AppTextBox
          disabled={view}
          control={control}
          name={"name"}
          label={"Name *"}
          color="primary"
          className="add-location-textbox"
          error={Boolean(errors?.name)}
          helperText={errors?.name?.message}
        />

        <Box className="add-location-button-container">
          {!view && (
            <LoadingButton
              variant="contained"
              color="warning"
              type="submit"
              className="add-location-button"
              disabled={!watch("name") || !watch("code")}
            >
              {update ? "Update" : "Add"}
            </LoadingButton>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(resetMenu())}
            className="add-location-button"
          >
            {view ? "Close" : update ? "Cancel" : "Cancel"}
          </Button>
        </Box>
      </form>

      <Dialog
        open={isLoading || updateLoading}
        className="loading-location-create"
      >
        <Lottie animationData={loading} loop={isLoading || updateLoading} />
      </Dialog>
    </Paper>
  );
};

export default LocationModal;

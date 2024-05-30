import {
  Box,
  Button,
  Dialog,
  Divider,
  Paper,
  Typography,
  TextField as MuiTextField,
} from "@mui/material";
import React from "react";

import "../../styles/DepartmentModal.scss";
import department from "../../../assets/svg/department.svg";

import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Lottie from "lottie-react";

import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { resetMenu } from "../../../services/slice/menuSlice";
import {
  useCreateDepartmentMutation,
  useLocationQuery,
  useUpdateDepartmentMutation,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import { objectError } from "../../../services/functions/errorResponse";
import departmentSchema from "../../../schemas/departmentSchema";
import Autocomplete from "../AutoComplete";
import { useEffect } from "react";
import socket from "../../../services/functions/serverSocket";

const DepartmentModal = ({ departmentData, view, update }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const {
    data: location,
    isLoading: loadingLocation,
    // isSuccess,
  } = useLocationQuery({
    status: "active",
    pagination: "none",
  });

  const [createDepartment, { isLoading: createLoading }] =
    useCreateDepartmentMutation();

  const [updateDepartment, { isLoading: updateLoading }] =
    useUpdateDepartmentMutation();

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(departmentSchema),
    defaultValues: {
      name: "",
      code: "",
      scope_location: [],
    },
  });

  useEffect(() => {
    // if (isSuccess) {
    setValue("name", departmentData?.name || "");
    setValue("code", departmentData?.code || "");
    setValue(
      "scope_location",
      departmentData?.scope_locations?.map((loc) =>
        location?.result?.find((item) => loc.location_code === item.code)
      ) || []
    );
    // }
  }, [departmentData, location, setValue]);

  const submitHandler = async (submitData) => {
    const obj = {
      ...submitData,
      scope_location: update
        ? submitData?.scope_location?.map((item) => ({
            location_id: item.id,
            location_code: item.code,
          }))
        : submitData?.scope_location?.map((item) => ({
            id: item.id,
            code: item.code,
            location: item.name,
          })),
      id: update ? departmentData?.id : null,
    };
    if (update) {
      try {
        const res = await updateDepartment(obj).unwrap();
        enqueueSnackbar(res.message, { variant: "success" });
        socket.emit("department_updated");

        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    } else {
      try {
        const res = await createDepartment(obj).unwrap();
        enqueueSnackbar(res.message, { variant: "success" });
        socket.emit("department_updated");

        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    }
  };

  return (
    <Paper className="department-modal-container">
      <img
        src={department}
        alt="department"
        className="department-image"
        draggable="false"
      />

      <Typography className="department-text">
        {view ? "Department" : update ? "Update Department" : "Add Department"}
      </Typography>
      <Divider orientation="horizontal" className="department-devider" />

      <form
        className="add-department-form-container"
        onSubmit={handleSubmit(submitHandler)}
      >
        <AppTextBox
          disabled={view || update}
          control={control}
          name={"code"}
          label={"Code *"}
          color="primary"
          className="add-department-textbox"
          error={Boolean(errors?.code)}
          helperText={errors?.code?.message}
        />
        <AppTextBox
          disabled={view}
          control={control}
          name={"name"}
          label={"Name *"}
          color="primary"
          className="add-department-textbox"
          error={Boolean(errors?.name)}
          helperText={errors?.name?.message}
        />
        <Box className="department-box-container-scope">
          <Autocomplete
            disabled={view}
            multiple
            control={control}
            name="scope_location"
            options={location?.result || []}
            getOptionLabel={(option) => `${option?.code} - ${option?.name}`}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            renderInput={(params) => (
              <MuiTextField
                name="scope_location"
                {...params}
                label="Location"
                size="small"
                variant="outlined"
                error={Boolean(errors.scope_location)}
                helperText={errors.scope_location?.message}
                className="add-department-textbox"
              />
            )}
          />
        </Box>
        <Box className="add-department-button-container">
          {!view && (
            <LoadingButton
              variant="contained"
              color="warning"
              type="submit"
              className="add-department-button"
              disabled={
                !watch("name") ||
                !watch("code") ||
                watch("scope_location")?.length === 0
              }
            >
              {update ? "Update" : "Add"}
            </LoadingButton>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(resetMenu())}
            className="add-department-button"
          >
            {view ? "Close" : update ? "Cancel" : "Cancel"}
          </Button>
        </Box>
      </form>

      <Dialog
        open={loadingLocation || createLoading || updateLoading}
        className="loading-department-create"
      >
        <Lottie
          animationData={loading}
          loop={loadingLocation || createLoading || updateLoading}
        />
      </Dialog>
    </Paper>
  );
};

export default DepartmentModal;

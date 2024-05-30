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

import "../../styles/DocumentTypeModal.scss";
import receipt from "../../../assets/svg/receipt.svg";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Lottie from "lottie-react";

import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { resetMenu } from "../../../services/slice/menuSlice";
import {
  useCreateDocumentTypeMutation,
  useUpdateDocumentTypeMutation,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import { objectError } from "../../../services/functions/errorResponse";

import documentTypeSchema from "../../../schemas/documentTypeSchema";
import Autocomplete from "../AutoComplete";
import { requiredFields } from "../../../services/constants/requiredFields";
import socket from "../../../services/functions/serverSocket";

const DocumentTypeModal = ({ dtypeData, view, update }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [createDocumentType, { isLoading }] = useCreateDocumentTypeMutation();
  const [updateDocumentType, { isLoading: updateLoading }] =
    useUpdateDocumentTypeMutation();

  const defaultValues = {
    name: "",
    code: "",
    required_fields: [],
  };

  const defaultData = {
    code: dtypeData?.code || "",
    name: dtypeData?.name || "",
    required_fields:
      dtypeData?.required_fields?.map((item) =>
        requiredFields?.find((req) => item === req.name || null)
      ) || [],
  };

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(documentTypeSchema),
    defaultValues: view || update ? defaultData : defaultValues,
  });

  const submitHandler = async (submitData) => {
    const obj = {
      ...submitData,
      required_fields: submitData?.required_fields?.map((item) => item.name),
      id: view || update ? dtypeData?.id : null,
    };

    if (update) {
      try {
        const res = await updateDocumentType(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        socket.emit("document_type_updated");
        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    } else {
      try {
        const res = await createDocumentType(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        socket.emit("document_type_updated");
        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    }
  };

  return (
    <Paper className="documentType-modal-container">
      <img
        src={receipt}
        alt="documentType"
        className="documentType-image"
        draggable="false"
      />

      <Typography className="documentType-text">
        {view ? "Type" : update ? "Update Type" : "Add Type"}
      </Typography>
      <Divider orientation="horizontal" className="documentType-devider" />

      <form
        className="add-documentType-form-container"
        onSubmit={handleSubmit(submitHandler)}
      >
        <AppTextBox
          disabled={view || update}
          control={control}
          name={"code"}
          label={"Code *"}
          color="primary"
          className="add-documentType-textbox"
          error={Boolean(errors?.code)}
          helperText={errors?.code?.message}
        />
        <AppTextBox
          disabled={view}
          control={control}
          name={"name"}
          label={"Name *"}
          color="primary"
          className="add-documentType-textbox"
          error={Boolean(errors?.wtax)}
          helperText={errors?.wtax?.message}
        />
        <Autocomplete
          multiple
          control={control}
          name="required_fields"
          options={requiredFields || []}
          getOptionLabel={(option) => option?.label}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <MuiTextField
              {...params}
              label="Required Fields *"
              size="small"
              variant="outlined"
              error={Boolean(errors.role_id)}
              helperText={errors.role_id?.message}
              className="add-documentType-textbox-autocomplete"
            />
          )}
        />

        <Box className="add-documentType-button-container">
          {!view && (
            <LoadingButton
              variant="contained"
              color="warning"
              type="submit"
              className="add-documentType-button"
              disabled={
                !watch("name") ||
                !watch("code") ||
                watch("required_fields")?.length === 0
              }
            >
              {update ? "Update" : "Add"}
            </LoadingButton>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(resetMenu())}
            className="add-documentType-button"
          >
            {view ? "Close" : update ? "Cancel" : "Cancel"}
          </Button>
        </Box>
      </form>

      <Dialog
        open={isLoading || updateLoading}
        className="loading-documentType-create"
      >
        <Lottie animationData={loading} loop={isLoading || updateLoading} />
      </Dialog>
    </Paper>
  );
};

export default DocumentTypeModal;

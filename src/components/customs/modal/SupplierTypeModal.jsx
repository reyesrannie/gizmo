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

import "../../styles/SupplierTypeModal.scss";
import supplierType from "../../../assets/svg/vat.svg";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Lottie from "lottie-react";

import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { resetMenu } from "../../../services/slice/menuSlice";
import {
  useCreateSupplierTypeMutation,
  useUpdateSupplierTypeMutation,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import { objectError } from "../../../services/functions/errorResponse";
import supplierTypeSchema from "../../../schemas/supplierTypeSchema";
import Autocomplete from "../AutoComplete";
import { supplierTypeReqFields } from "../../../services/constants/requiredFields";

const SupplierTypeModal = ({ stypeData, view, update }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [createSupplierType, { isLoading }] = useCreateSupplierTypeMutation();
  const [updateSupplierType, { isLoading: updateLoading }] =
    useUpdateSupplierTypeMutation();

  const defaultValues = {
    wtax: "",
    code: "",
    required_fields: [],
  };

  const defaultData = {
    code: stypeData?.code,
    wtax: stypeData?.wtax,
    required_fields:
      stypeData?.required_fields?.map((item) =>
        supplierTypeReqFields?.find((req) => item === req.name || null)
      ) || [],
  };

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(supplierTypeSchema),
    defaultValues: view || update ? defaultData : defaultValues,
  });

  const submitHandler = async (submitData) => {
    const obj = {
      ...submitData,
      wtax: submitData?.wtax?.includes("%")
        ? submitData?.wtax
        : submitData?.wtax + "%",
      required_fields: submitData?.required_fields?.map((item) => item.name),
      id: view || update ? stypeData?.id : null,
    };

    if (update) {
      try {
        const res = await updateSupplierType(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    } else {
      try {
        const res = await createSupplierType(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    }
  };

  return (
    <Paper className="supplierType-modal-container">
      <img
        src={supplierType}
        alt="supplierType"
        className="supplierType-image"
        draggable="false"
      />

      <Typography className="supplierType-text">
        {view ? "Type" : update ? "Update Type" : "Add Type"}
      </Typography>
      <Divider orientation="horizontal" className="supplierType-devider" />

      <form
        className="add-supplierType-form-container"
        onSubmit={handleSubmit(submitHandler)}
      >
        <AppTextBox
          disabled={view || update}
          control={control}
          name={"code"}
          label={"Code *"}
          color="primary"
          className="add-supplierType-textbox"
          error={Boolean(errors?.code)}
          helperText={errors?.code?.message}
        />
        <AppTextBox
          disabled={view}
          control={control}
          name={"wtax"}
          label={"Withholding tax *"}
          color="primary"
          className="add-supplierType-textbox"
          error={Boolean(errors?.wtax)}
          helperText={errors?.wtax?.message}
        />

        <Autocomplete
          multiple
          control={control}
          name="required_fields"
          options={supplierTypeReqFields || []}
          getOptionLabel={(option) => option?.label}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <MuiTextField
              {...params}
              label="Required Fields *"
              size="small"
              variant="outlined"
              error={Boolean(errors?.required_fields)}
              helperText={errors?.required_fields?.message}
              className="add-documentType-textbox-autocomplete"
            />
          )}
        />

        <Box className="add-supplierType-button-container">
          {!view && (
            <LoadingButton
              variant="contained"
              color="warning"
              type="submit"
              className="add-supplierType-button"
              disabled={!watch("wtax") || !watch("code")}
            >
              {update ? "Update" : "Add"}
            </LoadingButton>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(resetMenu())}
            className="add-supplierType-button"
          >
            {view ? "Close" : update ? "Cancel" : "Cancel"}
          </Button>
        </Box>
      </form>

      <Dialog
        open={isLoading || updateLoading}
        className="loading-supplierType-create"
      >
        <Lottie animationData={loading} loop={isLoading || updateLoading} />
      </Dialog>
    </Paper>
  );
};

export default SupplierTypeModal;

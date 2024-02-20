import {
  Divider,
  Paper,
  Typography,
  TextField as MuiTextField,
  Box,
  Button,
  Dialog,
  IconButton,
} from "@mui/material";
import React from "react";
import supplier from "../../../assets/svg/supplier.svg";

import "../../styles/SupplierModal.scss";
import AppTextBox from "../AppTextBox";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Autocomplete from "../AutoComplete";
import { useDispatch } from "react-redux";
import { resetMenu } from "../../../services/slice/menuSlice";
import { useSedarQuery } from "../../../services/store/sedarRequest";
import Lottie from "lottie-react";
import loading from "../../../assets/lottie/Loading.json";

import ClearIcon from "@mui/icons-material/Clear";
import {
  useApQuery,
  useCompanyQuery,
  useCreatesupplierMutation,
  useDepartmentQuery,
  useLocationQuery,
  supplieroleQuery,
  useUpdatesupplierMutation,
  useSupplierTypeQuery,
  useAtcQuery,
  useVatQuery,
} from "../../../services/store/request";
import { useEffect } from "react";
import { objectError } from "../../../services/functions/errorResponse";
import { enqueueSnackbar } from "notistack";
import supplierSchema from "../../../schemas/supplierSchema";

const SupplierModal = ({ view, update }) => {
  const { data: sTypes } = useSupplierTypeQuery({
    status: "active",
    pagination: "none",
  });
  const { data: atc } = useAtcQuery({
    status: "active",
    pagination: "none",
  });

  const { data: vat } = useVatQuery({
    status: "active",
    pagination: "none",
  });

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(supplierSchema),
    defaultValues: {
      tin: "",
      company_name: "",
      company_address: "",
      proprietor: "",
      supplier_types: [],
      supplier_atcs: [],
      supplier_vats: [],
    },
  });

  const submitHandler = async (submitData) => {
    console.log(submitData);
  };

  return (
    <Paper className="supplier-modal-container">
      <img
        src={supplier}
        alt="supplier"
        className="supplier-image"
        draggable="false"
      />
      <Typography className="supplier-text">
        {view ? "Supplier" : update ? "Update Supplier" : "Create Supplier"}
      </Typography>
      <Divider className="supplier-divider" />
      <Box className="form-title-supplier">
        <Typography className="form-title-text-supplier">
          Company Details
        </Typography>
      </Box>
      <form
        className="form-container-supplier"
        onSubmit={handleSubmit(submitHandler)}
      >
        <AppTextBox
          control={control}
          name={"company_name"}
          className="supplier-form-textBox"
          label="Company name"
          error={Boolean(errors.company_name)}
          helperText={errors.company_name?.message}
        />
        <AppTextBox
          control={control}
          name={"tin"}
          className="supplier-form-textBox"
          label="TIN"
          error={Boolean(errors.tin)}
          helperText={errors.tin?.message}
          address
          onKeyDown={(e) => {
            if (e?.target?.value?.length >= "15" && e.key !== "Backspace") {
              e.preventDefault();
            }
          }}
        />

        <AppTextBox
          control={control}
          name={"proprietor"}
          className="supplier-form-textBox"
          label="Proprietor (Optional)"
          error={Boolean(errors.proprietor)}
          helperText={errors.proprietor?.message}
        />
        <AppTextBox
          multiline
          minRows={2}
          control={control}
          name={"company_address"}
          className="supplier-form-field-textBox"
          label="Address"
          error={Boolean(errors.company_address)}
          helperText={errors.company_address?.message}
        />

        <Divider className="supplier-divider" />
        <Box className="form-title-supplier">
          <Typography className="form-title-text-supplier">Tagging</Typography>
        </Box>
        <Box>
          <Autocomplete
            multiple
            control={control}
            name={"supplier_types"}
            options={sTypes?.result || []}
            getOptionLabel={(option) => `${option?.code} - ${option?.wtax}`}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            renderInput={(params) => (
              <MuiTextField
                name="supplier_types"
                {...params}
                label="Supplier Type"
                size="small"
                variant="outlined"
                error={Boolean(errors.supplier_types)}
                helperText={errors.supplier_types?.message}
                className="supplier-form-field-autocomplete"
              />
            )}
          />
          <Autocomplete
            multiple
            control={control}
            name={"supplier_atcs"}
            options={atc?.result || []}
            getOptionLabel={(option) => `${option?.code} - ${option?.name}`}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            renderInput={(params) => (
              <MuiTextField
                name="supplier_atcs"
                {...params}
                label="ATC"
                size="small"
                variant="outlined"
                error={Boolean(errors.supplier_atcs)}
                helperText={errors.supplier_atcs?.message}
                className="supplier-form-field-autocomplete"
              />
            )}
          />
          <Autocomplete
            multiple
            control={control}
            name={"supplier_vats"}
            options={vat?.result || []}
            getOptionLabel={(option) => `${option?.code} - ${option?.name}`}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            renderInput={(params) => (
              <MuiTextField
                name="supplier_vats"
                {...params}
                label="VAT"
                size="small"
                variant="outlined"
                error={Boolean(errors.supplier_vats)}
                helperText={errors.supplier_vats?.message}
                className="supplier-form-field-autocomplete"
              />
            )}
          />
        </Box>
        <Divider className="supplier-divider" />

        <Box className="form-button-supplier">
          <Button
            color="warning"
            variant="contained"
            className="add-supplier-button"
            type="submit"
            // disabled={!isFormValid}
          >
            Submit
          </Button>
          <Button
            color="primary"
            variant="contained"
            className="add-supplier-button"
            // onClick={() => dispatch(resetMenu())}
          >
            Cancel
          </Button>
        </Box>
      </form>

      {/* <Dialog
        open={
          sedarLoading ||
          loadingAP ||
          loadingRole ||
          locationLoading ||
          companyLoading ||
          departmentLoading ||
          loadingCreatesupplier ||
          loadingUpdatesupplier
        }
        className="loading-supplier-create"
      >
        <Lottie animationData={loading} loop={sedarLoading} />
      </Dialog> */}
    </Paper>
  );
};

export default SupplierModal;

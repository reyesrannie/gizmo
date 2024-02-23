import {
  Divider,
  Paper,
  Typography,
  TextField as MuiTextField,
  Box,
  Button,
  Dialog,
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
import Lottie from "lottie-react";
import loading from "../../../assets/lottie/Loading.json";

import {
  useSupplierTypeQuery,
  useAtcQuery,
  useVatQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from "../../../services/store/request";
import { useEffect } from "react";
import { objectError } from "../../../services/functions/errorResponse";
import { enqueueSnackbar } from "notistack";
import supplierSchema from "../../../schemas/supplierSchema";

const SupplierModal = ({ supplierData, view, update }) => {
  const dispatch = useDispatch();

  const {
    data: sTypes,
    isLoading: loadingTypes,
    isSuccess: successType,
  } = useSupplierTypeQuery({
    status: "active",
    pagination: "none",
  });
  const {
    data: atc,
    isLoading: loadingAtc,
    isSuccess: successAtc,
  } = useAtcQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: vat,
    isLoading: loadingVat,
    isSuccess: successVat,
  } = useVatQuery({
    status: "active",
    pagination: "none",
  });

  const [createSupplier, { isLoading: loadingCreate }] =
    useCreateSupplierMutation();

  const [updateSupplier, { isLoading: loadingUpdate }] =
    useUpdateSupplierMutation();

  const requiredFields = ["tin", "company_name", "company_address"];
  const requiredArray = ["supplier_types", "supplier_atcs", "supplier_vats"];

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

  useEffect(() => {
    if (successType && successAtc && successVat) {
      const valuesItem = {
        tin: supplierData?.tin || "",
        company_name: supplierData?.company_name || "",
        company_address: supplierData?.company_address || "",
        proprietor: supplierData?.proprietor || "",
        supplier_types:
          supplierData?.supplier_types?.map((tags) =>
            sTypes?.result?.find((item) => tags?.type_code === item.code)
          ) || [],
        supplier_atcs:
          supplierData?.supplier_atcs?.map((tags) =>
            atc?.result?.find((item) => tags?.atc_code === item?.code)
          ) || [],
        supplier_vats:
          supplierData?.supplier_vats?.map((tags) =>
            vat?.result?.find((item) => tags?.vat_code === item?.code)
          ) || [],
      };
      Object.entries(valuesItem).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [
    successType,
    successAtc,
    successVat,
    atc,
    sTypes,
    setValue,
    supplierData,
    vat,
  ]);

  const isFormValid = requiredFields.every((field) => !!watch(field));
  const isArrayValid = requiredArray.every(
    (field) => Array.isArray(watch(field)) && watch(field).length > 0
  );

  const submitHandler = async (submitData) => {
    const obj = {
      ...submitData,
      supplier_types: update
        ? submitData?.supplier_types?.map((type) => ({
            type_id: type?.id,
            type_code: type?.code,
          }))
        : submitData?.supplier_types?.map((type) => ({
            id: type?.id,
            code: type?.code,
          })),
      supplier_atcs: update
        ? submitData?.supplier_atcs?.map((atc) => ({
            atc_id: atc?.id,
            atc_code: atc?.code,
          }))
        : submitData?.supplier_atcs?.map((atc) => ({
            id: atc?.id,
            code: atc?.code,
          })),
      supplier_vats: update
        ? submitData?.supplier_vats?.map((vat) => ({
            vat_id: vat?.id,
            vat_code: vat?.code,
          }))
        : submitData?.supplier_vats?.map((vat) => ({
            id: vat?.id,
            code: vat?.code,
          })),
      id: update ? supplierData?.id : null,
    };

    if (update || view) {
      try {
        const res = await updateSupplier(obj).unwrap();
        enqueueSnackbar(res.message, { variant: "success" });
        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    } else {
      try {
        const res = await createSupplier(obj).unwrap();
        enqueueSnackbar(res.message, { variant: "success" });
        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    }
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
          tin
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
            disabled={!isFormValid || !isArrayValid}
          >
            Submit
          </Button>
          <Button
            color="primary"
            variant="contained"
            className="add-supplier-button"
            onClick={() => dispatch(resetMenu())}
          >
            Cancel
          </Button>
        </Box>
      </form>

      <Dialog
        open={
          loadingTypes ||
          loadingCreate ||
          loadingAtc ||
          loadingVat ||
          loadingUpdate
        }
        className="loading-supplier-create"
      >
        <Lottie
          animationData={loading}
          loop={
            loadingTypes ||
            loadingCreate ||
            loadingAtc ||
            loadingVat ||
            loadingUpdate
          }
        />
      </Dialog>
    </Paper>
  );
};

export default SupplierModal;

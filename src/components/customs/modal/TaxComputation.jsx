import {
  Box,
  Divider,
  Paper,
  Typography,
  TextField as MuiTextField,
  Button,
  Dialog,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import vat from "../../../assets/svg/vat.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AppTextBox from "../AppTextBox";
import {
  setCreateTax,
  setTaxData,
  setUpdateTax,
} from "../../../services/slice/menuSlice";
import {
  useAccountTitlesQuery,
  useCreateTaxComputationMutation,
  useSupplierQuery,
  useSupplierTypeQuery,
  useUpdateTaxComputationMutation,
} from "../../../services/store/request";
import Lottie from "lottie-react";
import loadingLight from "../../../assets/lottie/Loading.json";
import taxComputationSchema from "../../../schemas/taxComputationSchema";
import Autocomplete from "../AutoComplete";
import {
  setDisableCreate,
  setSupplyType,
} from "../../../services/slice/optionsSlice";
import { supplierTypeReqFields } from "../../../services/constants/requiredFields";
import { enqueueSnackbar } from "notistack";
import { objectError } from "../../../services/functions/errorResponse";

const TaxComputation = ({ create, update, taxComputation }) => {
  const dispatch = useDispatch();
  const transactionData = useSelector((state) => state.menu.menuData);
  const taxData = useSelector((state) => state.menu.taxData);
  const supplyType = useSelector((state) => state.options.supplyType);
  const disableCreate = useSelector((state) => state.options.disableCreate);
  const voucher = useSelector((state) => state.options.voucher);

  const {
    data: tin,
    isLoading: loadingTIN,
    isSuccess: supplySuccess,
  } = useSupplierQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: accountTitles,
    isLoading: loadingTitles,
    isSuccess: successTitles,
  } = useAccountTitlesQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: supplierTypes,
    isLoading: supplierTypeLoading,
    isSuccess: supplierTypeSuccess,
  } = useSupplierTypeQuery({
    status: "active",
    pagination: "none",
  });

  const [createTaxComputation, { isLoading: loadingTax }] =
    useCreateTaxComputationMutation();
  const [updateTaxComputation, { isLoading: loadingUpdate }] =
    useUpdateTaxComputationMutation();

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(taxComputationSchema),
    defaultValues: {
      transaction_id: "",
      stype_id: null,
      coa_id: null,
      mode: "Debit",
      amount: "",
      vat_local: "",
      vat_service: "",
      nvat_local: "",
      nvat_service: "",
      vat_input_tax: "",
      wtax_payable_cr: "",
      total_invoice_amount: "",
      debit: "",
      credit: "",
      account: "",
    },
  });

  const checkField = (field) => {
    return watch("stype_id")?.required_fields?.includes(field);
  };

  useEffect(() => {
    if (successTitles && supplierTypeSuccess && supplySuccess && create) {
      const sumAmount = (taxComputation?.result || []).reduce((acc, curr) => {
        return acc + parseFloat(curr?.amount || 0);
      }, 0);

      const obj = {
        transaction_id: transactionData?.id,
        stype_id: supplierTypes?.result?.find(
          (item) => transactionData?.transactions?.supplier_type_id === item?.id
        ),
        amount: parseFloat(transactionData?.amount) - sumAmount,
      };

      Object.entries(obj).forEach(([key, value]) => {
        setValue(key, value);
      });

      const tinType = tin?.result?.find(
        (item) => item?.id === transactionData?.transactions?.supplier_id
      );

      dispatch(setSupplyType(tinType));
      setRequiredFieldsValue(parseFloat(transactionData?.amount) - sumAmount);
    }
    if (successTitles && supplierTypeSuccess && supplySuccess && update) {
      const obj = {
        transaction_id: taxData?.transaction_id,
        stype_id: supplierTypes?.result?.find(
          (item) => taxData?.stype_id === item?.id
        ),
        coa_id: accountTitles?.result?.find(
          (item) => taxData?.coa_id === item?.id
        ),
        mode: taxData?.mode,
        amount: parseFloat(taxData?.amount).toFixed(2),
        vat_local: taxData?.vat_local,
        vat_service: taxData?.vat_service,
        nvat_local: taxData?.nvat_local,
        nvat_service: taxData?.nvat_service,
        vat_input_tax: taxData?.vat_input_tax,
        wtax_payable_cr: taxData?.wtax_payable_cr,
        total_invoice_amount: taxData?.total_invoice_amount,
        debit: taxData?.debit,
        credit: taxData?.credit,
        account: taxData?.account,
      };

      Object.entries(obj).forEach(([key, value]) => {
        setValue(key, value);
      });

      const tinType = tin?.result?.find(
        (item) => item?.id === transactionData?.transactions?.supplier_id
      );

      dispatch(setSupplyType(tinType));
    }
  }, [
    successTitles,
    supplierTypes,
    supplierTypeSuccess,
    transactionData,
    tin,
    update,
    taxData,
    dispatch,
    taxComputation,
    accountTitles,
    setValue,
    supplySuccess,
  ]);

  const setRequiredFieldsValue = (amount) => {
    const sumAmount = (taxComputation?.result || []).reduce((acc, curr) => {
      return acc + parseFloat(curr?.amount || 0);
    }, 0);

    const totalAmount = update
      ? sumAmount + parseFloat(amount) - taxData?.amount
      : sumAmount + parseFloat(amount);

    const isDebit =
      watch("mode") === "Debit" ? totalAmount : parseFloat(amount);

    if (isDebit > transactionData?.amount) {
      dispatch(setDisableCreate(true));
      setError("amount", {
        type: "max",
        message: "Amount Exceeded",
      });
    } else {
      dispatch(setDisableCreate(false));

      clearErrors();
      const updatedFields = {};
      watch("stype_id")?.required_fields?.forEach((fieldName) => {
        const field = supplierTypeReqFields.find((f) => fieldName === f.name);
        if (field) {
          updatedFields[field.name] = amount / field.divide;
          updatedFields["vat_input_tax"] =
            updatedFields[field.name] * field.vit;
          updatedFields["wtax_payable_cr"] =
            (updatedFields[field.name] * parseFloat(watch("stype_id")?.wtax)) /
            100;
          updatedFields["total_invoice_amount"] =
            updatedFields["vat_input_tax"] + updatedFields[field.name];
          updatedFields["debit"] =
            watch("mode") === "Debit" ? updatedFields[field.name] : 0;
          updatedFields["credit"] =
            watch("mode") === "Credit" ? updatedFields[field.name] : 0;
          updatedFields["account"] =
            updatedFields["total_invoice_amount"] -
            updatedFields["wtax_payable_cr"];
        }
      });

      Object.entries(updatedFields).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  };

  const handleClear = () => {
    const obj = {
      vat_local: "",
      vat_service: "",
      nvat_local: "",
      nvat_service: "",
      vat_input_tax: "",
      wtax_payable_cr: "",
      total_invoice_amount: "",
      debit: "",
      credit: "",
      account: "",
    };

    Object.entries(obj).forEach(([key, value]) => {
      setValue(key, value);
    });

    setRequiredFieldsValue(watch("amount"));
  };

  const submitHandler = async (submitData) => {
    const obj = {
      ...submitData,
      transaction_id: transactionData?.transactions?.id,
      stype_id: submitData?.stype_id?.id,
      coa_id: submitData?.coa_id?.id,
      id: taxData?.id,
      voucher: voucher,
    };

    try {
      const res = update
        ? await updateTaxComputation(obj).unwrap()
        : await createTaxComputation(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(setCreateTax(false));
      dispatch(setUpdateTax(false));
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  return (
    <Paper className="transaction-modal-container">
      <img
        src={vat}
        alt="vat"
        className="transaction-image"
        draggable="false"
      />
      <Typography className="transaction-text">
        {update ? "Update Tax" : "Compute Tax"}
      </Typography>
      <Divider orientation="horizontal" className="transaction-devider" />
      <Box className="form-title-transaction">
        <Typography className="form-title-text-transaction">
          Tax Computation
        </Typography>
      </Box>

      <form
        className="form-container-transaction"
        onSubmit={handleSubmit(submitHandler)}
      >
        <Autocomplete
          control={control}
          name={"coa_id"}
          options={accountTitles?.result || []}
          getOptionLabel={(option) => `${option.code} - ${option.name}`}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <MuiTextField
              name="coa_id"
              {...params}
              label="Account Titles *"
              size="small"
              variant="outlined"
              error={Boolean(errors.coa_id)}
              helperText={errors.coa_id?.message}
              className="transaction-form-textBox"
            />
          )}
          disableClearable
        />
        <Autocomplete
          control={control}
          name={"stype_id"}
          options={
            supplyType?.supplier_types?.map((item) =>
              supplierTypes?.result?.find(
                (i) => i.id === parseInt(item.type_id)
              )
            ) || []
          }
          getOptionLabel={(option) => `${option.code} - ${option.wtax}`}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          onClose={() => {
            handleClear();
          }}
          renderInput={(params) => (
            <MuiTextField
              name="stype_id"
              {...params}
              label="Supplier Type *"
              size="small"
              variant="outlined"
              error={Boolean(errors.stype_id)}
              helperText={errors.stype_id?.message}
              className="transaction-form-textBox"
            />
          )}
          disableClearable
        />

        <Autocomplete
          control={control}
          name={"mode"}
          options={["Debit", "Credit"]}
          getOptionLabel={(option) => `${option}`}
          isOptionEqualToValue={(option, value) => option === value}
          onClose={() => {
            handleClear();
          }}
          renderInput={(params) => (
            <MuiTextField
              name="mode"
              {...params}
              label="Mode *"
              size="small"
              variant="outlined"
              error={Boolean(errors.tin)}
              helperText={errors.tin?.message}
              className="transaction-form-textBox"
            />
          )}
          disableClearable
        />

        <AppTextBox
          money
          control={control}
          name={"amount"}
          label={"Amount *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.amount)}
          helperText={errors?.amount?.message}
          onKeyUp={(e) => {
            setRequiredFieldsValue(e.target.value.replace(/,/g, ""));
          }}
        />

        {checkField("vat_local") && (
          <AppTextBox
            money
            control={control}
            name={"vat_local"}
            label={"Vat Local *"}
            color="primary"
            className="transaction-tax-textBox"
            error={Boolean(errors?.vat_local)}
            helperText={errors?.vat_local?.message}
          />
        )}
        {checkField("vat_service") && (
          <AppTextBox
            money
            control={control}
            name={"vat_service"}
            label={"Vat Service *"}
            color="primary"
            className="transaction-tax-textBox"
            error={Boolean(errors?.vat_service)}
            helperText={errors?.vat_service?.message}
          />
        )}
        {checkField("nvat_local") && (
          <AppTextBox
            money
            control={control}
            name={"nvat_local"}
            label={"Non-Vat Local *"}
            color="primary"
            className="transaction-tax-textBox"
            error={Boolean(errors?.nvat_local)}
            helperText={errors?.nvat_local?.message}
          />
        )}
        {checkField("nvat_service") && (
          <AppTextBox
            money
            control={control}
            name={"nvat_service"}
            label={"Non-Vat Service *"}
            color="primary"
            className="transaction-tax-textBox"
            error={Boolean(errors?.nvat_service)}
            helperText={errors?.nvat_service?.message}
          />
        )}
        <AppTextBox
          money
          control={control}
          name={"vat_input_tax"}
          label={"Vat Input Tax *"}
          color="primary"
          className="transaction-tax-textBox"
          error={Boolean(errors?.vat_input_tax)}
          helperText={errors?.vat_input_tax?.message}
        />
        <AppTextBox
          money
          control={control}
          name={"wtax_payable_cr"}
          label={"Wtax Payable Cr *"}
          color="primary"
          className="transaction-tax-textBox"
          error={Boolean(errors?.wtax_payable_cr)}
          helperText={errors?.wtax_payable_cr?.message}
        />
        <AppTextBox
          money
          control={control}
          name={"total_invoice_amount"}
          label={"Total Invoice Amount *"}
          color="primary"
          className="transaction-tax-textBox"
          error={Boolean(errors?.total_invoice_amount)}
          helperText={errors?.total_invoice_amount?.message}
        />
        {watch("mode") === "Debit" && (
          <AppTextBox
            money
            control={control}
            name={"debit"}
            label={"Debit *"}
            color="primary"
            className="transaction-tax-textBox"
            error={Boolean(errors?.debit)}
            helperText={errors?.debit?.message}
          />
        )}
        {watch("mode") === "Credit" && (
          <AppTextBox
            money
            control={control}
            name={"credit"}
            label={"Credit *"}
            color="primary"
            className="transaction-tax-textBox"
            error={Boolean(errors?.credit)}
            helperText={errors?.credit?.message}
          />
        )}

        <AppTextBox
          money
          control={control}
          name={"account"}
          label={"Total Amount *"}
          color="primary"
          className="transaction-tax-textBox"
          error={Boolean(errors?.account)}
          helperText={errors?.account?.message}
        />

        <Box className="form-title-transaction">
          <Divider orientation="horizontal" className="transaction-devider" />
        </Box>

        <Box className="tax-computation-button-container">
          <Button
            variant="contained"
            color="warning"
            type="submit"
            className="add-transaction-button"
            disabled={disableCreate}
          >
            {update ? "Update" : "Create"}
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              dispatch(setCreateTax(false));
              dispatch(setUpdateTax(false));
              dispatch(setTaxData(null));
            }}
            className="add-transaction-button"
          >
            Cancel
          </Button>
        </Box>
      </form>

      <Dialog
        open={
          loadingTitles ||
          supplierTypeLoading ||
          loadingTIN ||
          loadingTax ||
          loadingUpdate
        }
        className="loading-role-create"
      >
        <Lottie animationData={loadingLight} loop />
      </Dialog>
    </Paper>
  );
};

export default TaxComputation;

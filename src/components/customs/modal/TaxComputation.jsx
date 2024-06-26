import {
  Box,
  Divider,
  Paper,
  Typography,
  TextField as MuiTextField,
  Button,
  Dialog,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Tooltip,
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
  useArchiveTaxComputationMutation,
  useCreateTaxComputationMutation,
  useLocationQuery,
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
import { totalAmount } from "../../../services/functions/compute";

import "../../styles/RolesModal.scss";

const TaxComputation = ({ create, update, taxComputation, schedule }) => {
  const dispatch = useDispatch();
  const transactionData = useSelector((state) => state.menu.menuData);
  const taxData = useSelector((state) => state.menu.taxData);
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

  const {
    data: location,
    isLoading: loadingLocation,
    isSuccess: locationSuccess,
  } = useLocationQuery({
    status: "active",
    pagination: "none",
  });

  const [createTaxComputation, { isLoading: loadingTax }] =
    useCreateTaxComputationMutation();
  const [updateTaxComputation, { isLoading: loadingUpdate }] =
    useUpdateTaxComputationMutation();
  const [archiveTaxComputation, { isLoading: loadingArchive }] =
    useArchiveTaxComputationMutation();

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
      isTaxBased: true,
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
      remarks: "",
      credit_from: null,
      location_id: null,
    },
  });

  const checkField = (field) => {
    return watch("stype_id")?.required_fields?.includes(field);
  };

  useEffect(() => {
    if (
      locationSuccess &&
      successTitles &&
      supplierTypeSuccess &&
      supplySuccess &&
      create
    ) {
      const sumAmount = totalAmount(taxComputation);

      const obj = {
        transaction_id: transactionData?.id,
        stype_id: schedule
          ? supplierTypes?.result?.find(
              (item) => transactionData?.supplier_type_id === item?.id
            )
          : supplierTypes?.result?.find(
              (item) =>
                transactionData?.transactions?.supplier_type_id === item?.id
            ),
        amount:
          parseFloat(
            schedule ? transactionData?.month_amount : transactionData?.amount
          ) - sumAmount,
      };

      Object.entries(obj).forEach(([key, value]) => {
        setValue(key, value);
      });

      const tinType = tin?.result?.find(
        (item) => item?.id === transactionData?.transactions?.supplier_id
      );

      dispatch(setSupplyType(tinType));
      setRequiredFieldsValue(
        parseFloat(
          schedule ? transactionData?.month_amount : transactionData?.amount
        ) - sumAmount
      );
    }
    if (
      locationSuccess &&
      successTitles &&
      supplierTypeSuccess &&
      supplySuccess &&
      update
    ) {
      const obj = {
        isTaxBased:
          taxData?.isTaxBased === null || taxData?.isTaxBased === undefined
            ? true
            : taxData?.isTaxBased,
        transaction_id: schedule ? null : taxData?.transaction_id,
        location_id:
          location?.result?.find((item) => taxData?.location_id === item?.id) ||
          null,
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
        remarks: taxData?.remarks || "",
        credit_from: taxData?.credit_from,
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
    locationSuccess,
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
    schedule,
  ]);

  const setRequiredFieldsValue = (amount) => {
    const sumAmount = totalAmount(taxComputation);

    const totalAmounts = update
      ? sumAmount + parseFloat(amount) - taxData?.amount
      : sumAmount + parseFloat(amount);

    const isDebit =
      watch("mode") === "Debit" ? totalAmounts : parseFloat(amount);

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
          let baseAmount = parseFloat(amount / field.divide);
          updatedFields[field.name] = baseAmount;
          updatedFields["vat_input_tax"] = parseFloat(baseAmount * field.vit);
          updatedFields["wtax_payable_cr"] = parseFloat(
            ((baseAmount * parseFloat(watch("stype_id")?.wtax)) / 100).toFixed(
              2
            )
          );
          updatedFields["total_invoice_amount"] = parseFloat(
            updatedFields["vat_input_tax"] + baseAmount
          );
          updatedFields["debit"] = watch("mode") === "Debit" ? baseAmount : 0;
          updatedFields["credit"] = watch("mode") === "Credit" ? baseAmount : 0;
          updatedFields["account"] = parseFloat(
            watch("isTaxBased")
              ? updatedFields["total_invoice_amount"] -
                  updatedFields["wtax_payable_cr"]
              : baseAmount - updatedFields["wtax_payable_cr"]
          );
        }
      });

      Object.entries(updatedFields).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  };

  const handleChangeAmount = () => {
    const wtaxString = watch("wtax_payable_cr");
    const wtaxNumber = parseFloat(wtaxString.replace(/,/g, ""));
    setValue(
      "account",
      watch("isTaxBased")
        ? parseFloat(parseFloat(watch("amount")) - parseFloat(wtaxNumber))
        : parseFloat(parseFloat(watch("debit")) - parseFloat(wtaxNumber))
    );
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
      credit_from: null,
    };

    Object.entries(obj).forEach(([key, value]) => {
      setValue(key, value);
    });

    setRequiredFieldsValue(watch("amount"));
  };

  const handleClearCredit = () => {
    const obj = {
      vat_local: "",
      vat_service: "",
      nvat_local: "",
      nvat_service: "",
      vat_input_tax: "",
      wtax_payable_cr: "",
      total_invoice_amount: "",
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
      location_id: submitData?.location_id?.id,
      transaction_id: schedule ? null : transactionData?.transactions?.id,
      schedule_id: schedule ? transactionData?.id : null,
      stype_id: submitData?.stype_id?.id,
      coa_id: submitData?.coa_id?.id,
      id: taxData?.id,
      voucher: voucher,
      credit_from:
        submitData?.mode === "Credit" ? submitData?.credit_from : null,
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

  const archiveHandler = async () => {
    const obj = {
      id: taxData?.id,
    };
    try {
      const res = await archiveTaxComputation(obj).unwrap();
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
          onClose={() => {
            handleClear();
          }}
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
          name={"location_id"}
          options={location?.result || []}
          getOptionLabel={(option) => `${option.code} - ${option.name}`}
          isOptionEqualToValue={(option, value) => option?.code === value?.code}
          renderInput={(params) => (
            <MuiTextField
              name="location_id"
              {...params}
              label="Location *"
              size="small"
              variant="outlined"
              error={Boolean(errors.location_id)}
              helperText={errors.location_id?.message}
              className="transaction-form-textBox"
            />
          )}
        />

        <Autocomplete
          control={control}
          name={"stype_id"}
          options={supplierTypes?.result || []}
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

        {watch("mode") === "Credit" && (
          <Autocomplete
            control={control}
            name={"credit_from"}
            options={["Gross Amount", "Check Amount"]}
            getOptionLabel={(option) => `${option}`}
            isOptionEqualToValue={(option, value) => option === value}
            onClose={() => {
              handleClearCredit();
            }}
            renderInput={(params) => (
              <MuiTextField
                name="credit_from"
                {...params}
                label="Credit To *"
                size="small"
                variant="outlined"
                error={Boolean(errors.credit_from)}
                helperText={errors.credit_from?.message}
                className="transaction-form-textBox"
              />
            )}
            disableClearable
          />
        )}

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
            label={"Tax Based *"}
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
            label={"Tax Based *"}
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
            label={"Tax Based *"}
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
            label={"Tax Based *"}
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
          label={"Input Tax *"}
          color="primary"
          className="transaction-tax-textBox"
          error={Boolean(errors?.vat_input_tax)}
          helperText={errors?.vat_input_tax?.message}
        />
        <AppTextBox
          money
          control={control}
          name={"wtax_payable_cr"}
          label={"Wtax Payable Expanded *"}
          color="primary"
          className="transaction-tax-textBox"
          error={Boolean(errors?.wtax_payable_cr)}
          helperText={errors?.wtax_payable_cr?.message}
          handleClear={handleChangeAmount}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip
                  title={
                    <Typography className="form-title-text-note">
                      Amount will based on Gross Amount if checked; otherwise,
                      compute based on Tax Base.
                    </Typography>
                  }
                  arrow
                  color="secondary"
                >
                  <FormControlLabel
                    control={<Checkbox color="secondary" />}
                    checked={watch("isTaxBased")}
                    onChange={() => {
                      setValue("isTaxBased", !watch("isTaxBased"));
                      handleClear();
                    }}
                  />
                </Tooltip>
              </InputAdornment>
            ),
          }}
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
          label={voucher === "check" ? "Check Amount *" : "Total Amount *"}
          color="primary"
          className="transaction-tax-textBox"
          error={Boolean(errors?.account)}
          helperText={errors?.account?.message}
        />

        <AppTextBox
          multiline
          minRows={1}
          control={control}
          name={"remarks"}
          className="transaction-form-field-textBox "
          label="Remarks (Optional)"
          error={Boolean(errors.remarks)}
          helperText={errors.remarks?.message}
        />

        <Box className="form-title-transaction">
          <Divider orientation="horizontal" className="transaction-devider" />
        </Box>

        <Box className="tax-computation-button-container">
          <Box>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                archiveHandler();
              }}
              className="add-transaction-button"
            >
              Archive
            </Button>
          </Box>
          <Box className="tax-computation-button-update">
            <Button
              variant="contained"
              color="warning"
              type="submit"
              className="add-transaction-button"
              disabled={
                watch("amount") === 0 ||
                watch("amount") === "0" ||
                watch("amount") === "0.00"
              }
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
        </Box>
      </form>

      <Dialog
        open={
          loadingTitles ||
          supplierTypeLoading ||
          loadingTIN ||
          loadingTax ||
          loadingUpdate ||
          loadingArchive
        }
        className="loading-role-create"
      >
        <Lottie animationData={loadingLight} loop />
      </Dialog>
    </Paper>
  );
};

export default TaxComputation;

import {
  Autocomplete,
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
import apTransactionSchema from "../../../schemas/apTransactionSchema";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AppTextBox from "../AppTextBox";
import { DatePicker } from "@mui/x-date-pickers";
import { setCreateTax } from "../../../services/slice/menuSlice";
import {
  useAccountTitlesQuery,
  useSupplierTypeQuery,
} from "../../../services/store/request";
import Lottie from "lottie-react";
import loadingLight from "../../../assets/lottie/Loading.json";

const TaxComputation = ({ update }) => {
  const dispatch = useDispatch();
  const transactionData = useSelector((state) => state.menu.menuData);

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
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(apTransactionSchema),
    defaultValues: {
      transaction_id: "",
      stype_id: null,
      coa_id: null,
      amount: "",
      vat_local: "",
      vat_service: "",
      nvat_local: "",
      nvat_service: "",
      vat_input_tax: "",
      wtax_payable_cr: "",
      total_invoice_amount: "",
    },
  });

  console.log(transactionData);

  useEffect(() => {
    if (successTitles || supplierTypeSuccess) {
      const obj = {
        transaction_id: transactionData?.id,
      };
    }
  }, [successTitles, supplierTypeSuccess, transactionData]);

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
          Supplier Details
        </Typography>
      </Box>

      <form
        className="form-container-transaction"
        // onSubmit={handleSubmit(submitHandler)}
      >
        <AppTextBox
          money
          control={control}
          name={"amount"}
          label={"Amount *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.amount)}
          helperText={errors?.amount?.message}
          //   onKeyUp={(e) => {
          //     setRequiredFieldsValue(e.target.value.replace(/,/g, ""));
          //   }}
        />
        <Autocomplete
          control={control}
          name={""}
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
              error={Boolean(errors.tin)}
              helperText={errors.tin?.message}
              className="transaction-form-textBox"
            />
          )}
          disableClearable
        />
        <AppTextBox
          disabled
          control={control}
          name={"supplier"}
          label={"Supplier *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.supplier)}
          helperText={errors?.supplier?.message}
        />
        <AppTextBox
          disabled
          control={control}
          name={"proprietor"}
          label={"Proprietor"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.proprietor)}
          helperText={errors?.proprietor?.message}
        />
        <AppTextBox
          disabled
          multiline
          minRows={1}
          control={control}
          name={"company_address"}
          className="transaction-form-field-textBox "
          label="Address"
          error={Boolean(errors.company_address)}
          helperText={errors.company_address?.message}
        />
        <Box className="form-title-transaction">
          <Divider orientation="horizontal" className="transaction-devider" />

          <Typography className="form-title-text-transaction">
            Receipt Details
          </Typography>
        </Box>
        <Controller
          name="date_invoice"
          control={control}
          render={({ field: { onChange, value, ...restField } }) => (
            <Box className="date-picker-container-transaction">
              <DatePicker
                disabled
                className="transaction-form-date"
                label="Date Invoice *"
                format="YYYY-MM-DD"
                value={value}
                onChange={(e) => {
                  onChange(e);
                }}
              />
              {errors.date_invoice && (
                <Typography variant="caption" color="error">
                  {errors.date_invoice?.message}
                </Typography>
              )}
            </Box>
          )}
        />
        <AppTextBox
          disabled
          control={control}
          name={"invoice_no"}
          label={"Invoice No. *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.invoice_no)}
          helperText={errors?.invoice_no?.message}
        />
        {watch("tin") && (
          <Autocomplete
            disabled
            control={control}
            name={"document_type"}
            options={
              watch("tin")?.supplier_documenttypes?.map((item) =>
                document?.result?.find(
                  (docs) => item.document_code === docs.code
                )
              ) || []
            }
            getOptionLabel={(option) => `${option.name}`}
            isOptionEqualToValue={(option, value) =>
              option?.code === value?.code
            }
            renderInput={(params) => (
              <MuiTextField
                name="document_type"
                {...params}
                label="Document type *"
                size="small"
                variant="outlined"
                error={Boolean(errors.document_type)}
                helperText={errors.document_type?.message}
                className="transaction-form-textBox"
              />
            )}
          />
        )}

        <AppTextBox
          multiline
          minRows={1}
          control={control}
          name={"description"}
          className="transaction-form-field-textBox "
          label="Description (Optional)"
          error={Boolean(errors.description)}
          helperText={errors.description?.message}
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
            disabled={!watch("tin")}
          >
            Create
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(setCreateTax(false))}
            className="add-transaction-button"
          >
            Cancel
          </Button>
        </Box>
      </form>

      <Dialog
        open={loadingTitles || supplierTypeLoading}
        className="loading-role-create"
      >
        <Lottie animationData={loadingLight} loop />
      </Dialog>
    </Paper>
  );
};

export default TaxComputation;

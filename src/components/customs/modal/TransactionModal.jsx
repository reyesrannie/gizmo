import {
  Box,
  Button,
  Dialog,
  Divider,
  Paper,
  Typography,
  TextField as MuiTextField,
} from "@mui/material";
import React, { useEffect } from "react";

import "../../styles/TransactionModal.scss";
import transaction from "../../../assets/svg/transaction.svg";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Lottie from "lottie-react";
import moment from "moment";

import { LoadingButton } from "@mui/lab";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { resetMenu } from "../../../services/slice/menuSlice";
import {
  useApQuery,
  useCreateCompanyMutation,
  useDocumentTypeQuery,
  useSupplierQuery,
  useTagMonthYearQuery,
  useUpdateCompanyMutation,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import { objectError } from "../../../services/functions/errorResponse";
import Autocomplete from "../AutoComplete";
import { setFieldsRequired } from "../../../services/slice/transactionSlice";
import { DatePicker } from "@mui/x-date-pickers";
import useTaggingHook from "../../../services/hooks/useTaggingHook";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import transactionSchema from "../../../schemas/transactionSchema";

const TransactionModal = ({ transactionData, view, update }) => {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [createTransaction, { isLoading }] = useCreateCompanyMutation();
  const [updateTransaction, { isLoading: updateLoading }] =
    useUpdateCompanyMutation();

  const { params, onDateChange } = useTaggingHook();

  const {
    data: gtag,
    isLoading: gTagIsLoading,
    isSuccess: gTagSuccess,
    refetch,
  } = useTagMonthYearQuery(params);

  const { data: tin, isLoading: loadingTIN } = useSupplierQuery({
    status: "active",
    pagination: "none",
  });

  const { data: document, isLoading: loadingDocument } = useDocumentTypeQuery({
    status: "active",
    pagination: "none",
  });

  const { data: ap, isLoading: loadingAp } = useApQuery({
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
    resolver: yupResolver(transactionSchema),
    defaultValues: {
      tag_no: "",
      supplier: "",
      proprietor: "",
      company_address: "",
      name_in_receipt: "",
      ref_no: "",
      delivery_invoice: "",
      sales_invoice: "",
      charge_invoice: "",
      amount_withheld: "",
      amount_check: "",
      amount: "",
      vat: "",
      cost: "",
      g_tag_number: "",
      ap: null,
      tin: null,
      date_invoice: null,
      date_recieved: null,
      tag_month_year: null,
      document_type: null,
      account_number: null,
      store: null,
      coverage_from: null,
      coverage_to: null,
    },
  });

  const handleAutoFill = () => {
    const items = {
      supplier: watch("tin")?.company_name || "",
      proprietor: watch("tin")?.proprietor || "",
      company_address: watch("tin")?.company_address || "",
      name_in_receipt: watch("tin")?.receipt_name || "",
      document_type:
        document?.result?.find(
          (item) =>
            item.code === watch("tin")?.supplier_documenttypes[0]?.document_code
        ) || null,
    };

    Object.entries(items).forEach(([key, value]) => {
      setValue(key, value);
    });
    const docs = watch("tin")?.supplier_documenttypes[0];
    dispatch(
      setFieldsRequired(
        document?.result?.find((item) => item.code === docs.document_code)
      )
    );
  };

  useEffect(() => {
    if (gTagSuccess) {
      const tagNoG = parseInt(gtag?.result) + 1 || 1;
      setValue(
        "tag_month_year",
        dayjs(new Date(), { locale: AdapterDayjs.locale })
      );
      setValue("g_tag_number", tagNoG.toString().padStart(4, "0"));
    }
  }, [gTagSuccess, gtag]);

  const checkField = (field) => {
    return watch("document_type")?.required_fields?.includes(field);
  };

  console.log(errors);
  const submitHandler = async (submitData) => {
    console.log(submitData);

    // const obj = {
    //   ...submitData,
    //   id: view || update ? transactionData?.id : null,
    // };
    // if (update) {
    //   try {
    //     const res = await updateTransaction(obj).unwrap();
    //     enqueueSnackbar(res?.message, { variant: "success" });
    //     dispatch(resetMenu());
    //   } catch (error) {
    //     objectError(error, setError, enqueueSnackbar);
    //   }
    // } else {
    //   try {
    //     const res = await createTransaction(obj).unwrap();
    //     enqueueSnackbar(res?.message, { variant: "success" });
    //     dispatch(resetMenu());
    //   } catch (error) {
    //     objectError(error, setError, enqueueSnackbar);
    //   }
    // }
  };

  return (
    <Paper className="transaction-modal-container">
      <img
        src={transaction}
        alt="transaction"
        className="transaction-image"
        draggable="false"
      />

      <Typography className="transaction-text">
        {view
          ? "Transaction"
          : update
          ? "Update Transaction"
          : "Add Transaction"}
      </Typography>
      <Divider orientation="horizontal" className="transaction-devider" />
      <Box className="form-title-transaction">
        <Typography className="form-title-text-transaction">
          Supplier Details
        </Typography>
      </Box>

      <form
        className="form-container-transaction"
        onSubmit={handleSubmit(submitHandler)}
      >
        <AppTextBox
          disabled={view}
          control={control}
          name={"tag_no"}
          label={"Tag Number *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.tag_no)}
          helperText={errors?.tag_no?.message}
        />
        <Autocomplete
          control={control}
          name={"tin"}
          options={tin?.result || []}
          getOptionLabel={(option) => `${option.tin}`}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          onClose={() => handleAutoFill()}
          renderInput={(params) => (
            <MuiTextField
              name="ap_tagging"
              {...params}
              label="TIN"
              size="small"
              variant="outlined"
              error={Boolean(errors.tin)}
              helperText={errors.tin?.message}
              className="transaction-form-textBox"
            />
          )}
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
          label={"Proprietor *"}
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
        {watch("tin") && (
          <Autocomplete
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
                label="Document type"
                size="small"
                variant="outlined"
                error={Boolean(errors.document_type)}
                helperText={errors.document_type?.message}
                className="transaction-form-textBox"
              />
            )}
          />
        )}
        <Controller
          name="date_invoice"
          control={control}
          render={({ field: { onChange, ...restField } }) => (
            <Box className="date-picker-container">
              <DatePicker
                className="transaction-form-date"
                label="Date Invoice"
                format="YYYY-MM-DD"
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
        <Controller
          name="date_recieved"
          control={control}
          render={({ field: { onChange, ...restField } }) => (
            <Box className="date-picker-container">
              <DatePicker
                className="transaction-form-date"
                label="Date received"
                format="YYYY-MM-DD"
                onChange={(e) => {
                  onChange(e);
                }}
              />
              {errors.date_recieved && (
                <Typography variant="caption" color="error">
                  {errors.date_recieved.message}
                </Typography>
              )}
            </Box>
          )}
        />

        <AppTextBox
          disabled={view}
          control={control}
          name={"name_in_receipt"}
          label={"Name in receipt *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.name_in_receipt)}
          helperText={errors?.name_in_receipt?.message}
        />
        {checkField("ref_no") && (
          <AppTextBox
            disabled={view}
            control={control}
            name={"ref_no"}
            label={"Ref No. *"}
            color="primary"
            className="transaction-form-textBox"
            error={Boolean(errors?.ref_no)}
            helperText={errors?.ref_no?.message}
          />
        )}
        {checkField("delivery_invoice") && (
          <AppTextBox
            disabled={view}
            control={control}
            name={"delivery_invoice"}
            label={"Delivery Invoice *"}
            color="primary"
            className="transaction-form-textBox"
            error={Boolean(errors?.delivery_invoice)}
            helperText={errors?.delivery_invoice?.message}
          />
        )}
        {checkField("sales_invoice") && (
          <AppTextBox
            disabled={view}
            control={control}
            name={"sales_invoice"}
            label={"Sales Invoice*"}
            color="primary"
            className="transaction-form-textBox"
            error={Boolean(errors?.sales_invoice)}
            helperText={errors?.sales_invoice?.message}
          />
        )}
        {checkField("charge_invoice") && (
          <AppTextBox
            disabled={view}
            control={control}
            name={"charge_invoice"}
            label={"Charge Invoice*"}
            color="primary"
            className="transaction-form-textBox"
            error={Boolean(errors?.charge_invoice)}
            helperText={errors?.charge_invoice?.message}
          />
        )}
        <AppTextBox
          money
          disabled={view}
          control={control}
          name={"amount"}
          label={"Amount *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.amount)}
          helperText={errors?.amount?.message}
        />
        {checkField("amount_withheld") && (
          <AppTextBox
            money
            disabled={view}
            control={control}
            name={"amount_withheld"}
            label={"Amount withheld*"}
            color="primary"
            className="transaction-form-textBox"
            error={Boolean(errors?.amount_withheld)}
            helperText={errors?.amount_withheld?.message}
          />
        )}
        {checkField("amount_check") && (
          <AppTextBox
            money
            disabled={view}
            control={control}
            name={"amount_check"}
            label={"Amount of check*"}
            color="primary"
            className="transaction-form-textBox"
            error={Boolean(errors?.amount_check)}
            helperText={errors?.amount_check?.message}
          />
        )}
        {checkField("vat") && (
          <AppTextBox
            money
            disabled={view}
            control={control}
            name={"vat"}
            label={"Vat *"}
            color="primary"
            className="transaction-form-textBox"
            error={Boolean(errors?.vat)}
            helperText={errors?.vat?.message}
          />
        )}
        {checkField("cost") && (
          <AppTextBox
            money
            disabled={view}
            control={control}
            name={"cost"}
            label={"Cost *"}
            color="primary"
            className="transaction-form-textBox"
            error={Boolean(errors?.cost)}
            helperText={errors?.cost?.message}
          />
        )}

        {checkField("coverage") && (
          <>
            <Box className="form-title-transaction">
              <Divider
                orientation="horizontal"
                className="transaction-devider"
              />

              <Typography className="form-title-text-transaction">
                Coverage
              </Typography>
            </Box>
            <Controller
              name="coverage_from"
              control={control}
              render={({ field: { onChange, ...restField } }) => (
                <Box className="date-picker-container">
                  <DatePicker
                    className="transaction-form-date"
                    label="From"
                    format="YYYY-MM-DD"
                    maxDate={watch("coverage_to")}
                    onChange={(e) => {
                      onChange(e);
                    }}
                  />
                  {errors.coverage_from && (
                    <Typography variant="caption" color="error">
                      {errors.coverage_from.message}
                    </Typography>
                  )}
                </Box>
              )}
            />
            <Controller
              name="coverage_to"
              control={control}
              render={({ field: { onChange, ...restField } }) => (
                <Box className="date-picker-container">
                  <DatePicker
                    className="transaction-form-date"
                    label="To"
                    minDate={watch("coverage_from")}
                    format="YYYY-MM-DD"
                    onChange={(e) => {
                      onChange(e);
                    }}
                  />
                  {errors.coverage_to && (
                    <Typography variant="caption" color="error">
                      {errors.coverage_to.message}
                    </Typography>
                  )}
                </Box>
              )}
            />

            {checkField("account_number") && (
              <Autocomplete
                control={control}
                name={"account_number"}
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
                    name="account_number"
                    {...params}
                    label="Account Number"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.account_number)}
                    helperText={errors.account_number?.message}
                    className="transaction-form-textBox"
                  />
                )}
              />
            )}
            {checkField("store") && (
              <Autocomplete
                control={control}
                name={"store"}
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
                    name="store"
                    {...params}
                    label="Store"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.store)}
                    helperText={errors.store?.message}
                    className="transaction-form-textBox"
                  />
                )}
              />
            )}
          </>
        )}

        <Box className="form-title-transaction">
          <Divider orientation="horizontal" className="transaction-devider" />

          <Typography className="form-title-text-transaction">
            Allocation
          </Typography>
        </Box>
        <Autocomplete
          control={control}
          name={"ap"}
          options={ap?.result || []}
          getOptionLabel={(option) => `${option.company_code}`}
          isOptionEqualToValue={(option, value) => option?.code === value?.code}
          renderInput={(params) => (
            <MuiTextField
              name="ap_tagging"
              {...params}
              label="AP"
              size="small"
              variant="outlined"
              error={Boolean(errors.ap)}
              helperText={errors.ap?.message}
              className="transaction-form-textBox"
            />
          )}
        />
        <Controller
          name="tag_month_year"
          control={control}
          render={({ field: { onChange, value, ...restField } }) => (
            <Box className="date-picker-container">
              <DatePicker
                className="transaction-form-date"
                label="Tag year month"
                format="YY MM"
                value={value}
                views={["month", "year"]}
                onChange={(e) => {
                  onChange(e);
                }}
                onAccept={(e) =>
                  onDateChange(moment(new Date(e)).format("YYMM"))
                }
              />
              {errors.tag_month_year && (
                <Typography variant="caption" color="error">
                  {errors.tag_month_year.message}
                </Typography>
              )}
            </Box>
          )}
        />
        <AppTextBox
          disabled
          control={control}
          name={"g_tag_number"}
          label={"Tag *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.g_tag_number)}
          helperText={errors?.g_tag_number?.message}
        />
        <Box className="add-transaction-button-container">
          {!view && (
            <LoadingButton
              variant="contained"
              color="warning"
              type="submit"
              className="add-transaction-button"
              disabled={!watch("tin")}
            >
              {update ? "Update" : "Add"}
            </LoadingButton>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(resetMenu())}
            className="add-transaction-button"
          >
            {view ? "Close" : update ? "Cancel" : "Cancel"}
          </Button>
        </Box>
      </form>

      <Dialog
        open={
          isLoading ||
          updateLoading ||
          loadingTIN ||
          loadingDocument ||
          gTagIsLoading
        }
        className="loading-transaction-create"
      >
        <Lottie
          animationData={loading}
          loop={
            isLoading ||
            updateLoading ||
            loadingTIN ||
            loadingDocument ||
            gTagIsLoading
          }
        />
      </Dialog>
    </Paper>
  );
};

export default TransactionModal;

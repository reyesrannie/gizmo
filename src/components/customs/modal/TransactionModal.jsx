import React, { useEffect } from "react";

import {
  Box,
  Button,
  Dialog,
  Divider,
  Paper,
  Typography,
  TextField as MuiTextField,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { resetMenu } from "../../../services/slice/menuSlice";
import {
  useAccountNumberQuery,
  useApQuery,
  useArchiveTransactionMutation,
  useCreateTransactionMutation,
  useDocumentTypeQuery,
  useLocationQuery,
  useStatusLogsQuery,
  useSupplierQuery,
  useTagMonthYearQuery,
  useUpdateTransactionMutation,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import {
  objectError,
  singleError,
} from "../../../services/functions/errorResponse";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  resetPrompt,
  setOpenReason,
  setWarning,
} from "../../../services/slice/promptSlice";
import {
  mapTransaction,
  mapViewTransaction,
} from "../../../services/functions/mapObject";
import { resetLogs } from "../../../services/slice/logSlice";

import "../../styles/TransactionModal.scss";

import transaction from "../../../assets/svg/transaction.svg";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Autocomplete from "../AutoComplete";
import useTaggingHook from "../../../services/hooks/useTaggingHook";
import transactionSchema from "../../../schemas/transactionSchema";
import AppPrompt from "../AppPrompt";
import warningImg from "../../../assets/svg/warning.svg";
import loadingLight from "../../../assets/lottie/Loading.json";
import TransactionDrawer from "../TransactionDrawer";

import dayjs from "dayjs";
import Lottie from "lottie-react";
import moment from "moment";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ReasonInput from "../ReasonInput";

const TransactionModal = ({ transactionData, view, update }) => {
  const dispatch = useDispatch();
  const warning = useSelector((state) => state.prompt.warning);
  const openReason = useSelector((state) => state.prompt.openReason);

  const { enqueueSnackbar } = useSnackbar();

  const [createTransaction, { isLoading }] = useCreateTransactionMutation();
  const [updateTransaction, { isLoading: updateLoading }] =
    useUpdateTransactionMutation();

  const { params, onDateChange } = useTaggingHook();

  const {
    data: gtag,
    isLoading: gTagIsLoading,
    isSuccess: gTagSuccess,
    isFetching,
  } = useTagMonthYearQuery(params);

  const [archiveTransaction, { isLoading: archiveLoading }] =
    useArchiveTransactionMutation();

  const {
    data: tin,
    isLoading: loadingTIN,
    isSuccess: supplySuccess,
  } = useSupplierQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: document,
    isLoading: loadingDocument,
    isSuccess: documentSuccess,
  } = useDocumentTypeQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: ap,
    isLoading: loadingAp,
    isSuccess: apSuccess,
  } = useApQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: accountNumber,
    isLoading: loadingAccountNumber,
    isSuccess: accountSuccess,
  } = useAccountNumberQuery({
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
      description: "",
      supplier: "",
      proprietor: "",
      company_address: "",
      name_in_receipt: "",
      invoice_no: "",
      ref_no: "",
      delivery_invoice: "",
      amount_withheld: "",
      amount_check: "",
      amount: "",
      vat: "",
      cost: "",
      g_tag_number: "",
      supplier_type_id: "",
      atc_id: "",
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

  const handleClear = (e) => {
    const defaultValue = {
      supplier: "",
      proprietor: "",
      company_address: "",
      name_in_receipt: "",
      invoice_no: "",
      ref_no: "",
      amount_withheld: "",
      amount_check: "",
      amount: "",
      vat: "",
      cost: "",
      supplier_type_id: "",
      atc_id: "",
      document_type: null,
      account_number: null,
      store: null,
      coverage_from: null,
      coverage_to: null,
    };

    Object.entries(defaultValue).forEach(([key, value]) => {
      setValue(key, value);
    });

    if (!e) {
      handleAutoFill();
    } else {
      setValue("tin", null);
    }
  };

  const handleAutoFill = () => {
    const items = {
      supplier: watch("tin")?.company_name || "",
      proprietor: watch("tin")?.proprietor || "",
      company_address: watch("tin")?.company_address || "",
      name_in_receipt: watch("tin")?.receipt_name || "",
      supplier_type_id: watch("tin")?.supplier_types[0]?.type_id || "",
      atc_id: watch("tin")?.supplier_atcs[0]?.atc_id || "",
      document_type:
        document?.result?.find(
          (item) =>
            item.code === watch("tin")?.supplier_documenttypes[0]?.document_code
        ) || null,
      account_number: accountNumber?.result?.find(
        (item) => watch("tin")?.id === item?.supplier?.id || null
      ),
      tag_month_year: dayjs(new Date(), { locale: AdapterDayjs.locale }),
    };

    Object.entries(items).forEach(([key, value]) => {
      setValue(key, value);
    });

    setValue(
      "store",
      location?.result?.find(
        (item) => watch("account_number")?.location?.id === item?.id || null
      )
    );
  };

  useEffect(() => {
    if (gTagSuccess && !update && !view) {
      const tagNoG = parseInt(gtag?.result) + 1 || 1;

      setValue("g_tag_number", tagNoG.toString().padStart(4, "0"));
    }
    if (
      (gTagSuccess &&
        supplySuccess &&
        documentSuccess &&
        apSuccess &&
        accountSuccess &&
        locationSuccess &&
        update) ||
      view
    ) {
      const tagMonthYear = dayjs(transactionData?.tag_year, "YYMM").toDate();
      const mapData = mapViewTransaction(
        transactionData,
        ap,
        tin,
        document,
        accountNumber,
        location
      );
      const values = {
        ...mapData,
        tag_month_year:
          dayjs(new Date(tagMonthYear), {
            locale: AdapterDayjs.locale,
          }) || null,
      };

      Object.entries(values).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [
    gTagSuccess,
    gtag,
    supplySuccess,
    documentSuccess,
    apSuccess,
    accountSuccess,
    locationSuccess,
    transactionData,
    document,
    ap,
    location,
    accountNumber,
    tin,
  ]);

  const checkField = (field) => {
    return watch("document_type")?.required_fields?.includes(field);
  };

  const submitHandler = async (submitData) => {
    const mappedData = mapTransaction(submitData);
    const obj = {
      ...mappedData,
      id: view || update ? transactionData?.id : null,
    };

    try {
      const res = update
        ? await updateTransaction(obj).unwrap()
        : await createTransaction(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetLogs());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const handleArchive = async (submitData) => {
    const obj = {
      ...submitData,
      id: transactionData?.id,
    };

    try {
      const res = await archiveTransaction(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
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
          disabled={view}
          control={control}
          name={"tin"}
          options={tin?.result || []}
          getOptionLabel={(option) => `${option.tin}`}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          onClose={() => {
            handleClear(false);
          }}
          renderInput={(params) => (
            <MuiTextField
              name="ap_tagging"
              {...params}
              label="TIN *"
              size="small"
              variant="outlined"
              error={Boolean(errors.tin)}
              helperText={errors.tin?.message}
              className="transaction-form-textBox"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    {watch("tin") && (
                      <IconButton
                        onClick={() => {
                          handleClear(true);
                        }}
                        className="icon-clear-user"
                      >
                        <ClearIcon />
                      </IconButton>
                    )}
                  </>
                ),
              }}
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
        {watch("tin") && (
          <Autocomplete
            disabled={view}
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
        <Controller
          name="date_invoice"
          control={control}
          render={({ field: { onChange, value, ...restField } }) => (
            <Box className="date-picker-container-transaction">
              <DatePicker
                disabled={view}
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
        <Controller
          name="date_recieved"
          control={control}
          render={({ field: { onChange, value, ...restField } }) => (
            <Box className="date-picker-container-transaction">
              <DatePicker
                disabled={view}
                className="transaction-form-date"
                label="Date received *"
                format="YYYY-MM-DD"
                value={value}
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
        {checkField("invoice_no") && (
          <AppTextBox
            disabled={view}
            control={control}
            name={"invoice_no"}
            label={"Invoice No. *"}
            color="primary"
            className="transaction-form-textBox"
            error={Boolean(errors?.invoice_no)}
            helperText={errors?.invoice_no?.message}
          />
        )}
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
            label={"Amount withheld *"}
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
            label={"Amount of check *"}
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
        <AppTextBox
          disabled={view}
          multiline
          minRows={1}
          control={control}
          name={"description"}
          className="transaction-form-field-textBox "
          label="Description (Optional)"
          error={Boolean(errors.description)}
          helperText={errors.description?.message}
        />

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
              render={({ field: { onChange, value, ...restField } }) => (
                <Box className="date-picker-container-transaction">
                  <DatePicker
                    disabled={view}
                    className="transaction-form-date"
                    label="From *"
                    format="YYYY-MM-DD"
                    value={value}
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
              render={({ field: { onChange, value, ...restField } }) => (
                <Box className="date-picker-container-transaction">
                  <DatePicker
                    disabled={view}
                    className="transaction-form-date"
                    label="To *"
                    minDate={watch("coverage_from")}
                    format="YYYY-MM-DD"
                    value={value}
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
                disabled={view}
                control={control}
                name={"account_number"}
                options={
                  accountNumber?.result?.filter(
                    (account) => account?.supplier?.id === watch("tin")?.id
                  ) || []
                }
                getOptionLabel={(option) => `${option.account_no}`}
                isOptionEqualToValue={(option, value) =>
                  option?.code === value?.code
                }
                renderInput={(params) => (
                  <MuiTextField
                    name="account_number"
                    {...params}
                    label="Account Number *"
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
                disabled={view}
                control={control}
                name={"store"}
                options={
                  location?.result?.filter(
                    (item) => watch("account_number")?.location?.id === item?.id
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
                    label="Store *"
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
          disabled={view}
          control={control}
          name={"ap"}
          options={ap?.result || []}
          getOptionLabel={(option) => `${option.company_code}`}
          isOptionEqualToValue={(option, value) => option?.code === value?.code}
          renderInput={(params) => (
            <MuiTextField
              name="ap_tagging"
              {...params}
              label="AP *"
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
            <Box className="date-picker-container-transaction">
              <DatePicker
                disabled={update || view}
                className="transaction-form-date"
                label="Tag year month *"
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
          <Box>
            {update ? (
              <LoadingButton
                variant="contained"
                color="error"
                className="add-transaction-button"
                onClick={() => dispatch(setWarning(true))}
                startIcon={<DeleteForeverOutlinedIcon />}
              >
                Archive
              </LoadingButton>
            ) : (
              "."
            )}
          </Box>
          <Box className="archive-transaction-button-container">
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
        </Box>
      </form>

      <Dialog
        open={
          isLoading ||
          updateLoading ||
          loadingTIN ||
          loadingDocument ||
          gTagIsLoading ||
          loadingAccountNumber ||
          loadingAp ||
          loadingLocation ||
          isFetching
        }
        className="loading-transaction-create"
      >
        <Lottie animationData={loading} loop />
      </Dialog>

      <Dialog open={warning}>
        <AppPrompt
          image={warningImg}
          title={"Archive Transaction?"}
          message={"You are about to archive this Transaction"}
          nextLineMessage={"Once archived it can never be restore"}
          confirmButton={"Yes, Archive it!"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          confirmOnClick={() => dispatch(setOpenReason(true))}
        />
      </Dialog>

      <Dialog open={openReason}>
        <ReasonInput
          title={"Reason for archive"}
          reasonDesc={"Please enter the reason for archiving this transaction"}
          warning={
            "Note that this transaction will be permanently archived once confirmed."
          }
          confirmButton={"Confirm"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          confirmOnClick={handleArchive}
        />
      </Dialog>

      <Dialog open={archiveLoading} className="loading-role-create">
        <Lottie animationData={loadingLight} loop={archiveLoading} />
      </Dialog>
      {view || update ? (
        <TransactionDrawer transactionData={transactionData} />
      ) : (
        <></>
      )}
    </Paper>
  );
};

export default TransactionModal;

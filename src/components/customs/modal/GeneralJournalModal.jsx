import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  Divider,
  Paper,
  Typography,
  TextField as MuiTextField,
  IconButton,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {
  resetMenu,
  setHasError,
  setUpdateCount,
} from "../../../services/slice/menuSlice";
import {
  useAccountNumberQuery,
  useApQuery,
  useCutOffQuery,
  useDocumentTypeQuery,
  useLocationQuery,
  useSupplierQuery,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  resetPrompt,
  setOpenReason,
  setReceive,
} from "../../../services/slice/promptSlice";
import { mapViewTransactionGJ } from "../../../services/functions/mapObject";

import "../../styles/TransactionModal.scss";
import "../../styles/UserModal.scss";
import "../../styles/RolesModal.scss";
import "../../styles/Modal.scss";

import transaction from "../../../assets/svg/transaction.svg";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Autocomplete from "../AutoComplete";
import TransactionDrawer from "../TransactionDrawer";
import noData from "../../../assets/lottie/NoData.json";

import dayjs from "dayjs";
import Lottie from "lottie-react";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";

import ReasonInput from "../ReasonInput";
import {
  clearValue,
  transactionDefaultValue,
} from "../../../services/constants/defaultValues";
import ShortcutHandler from "../../../services/functions/ShortcutHandler";

import {
  resetTransaction,
  setAddDocuments,
  setDocuments,
} from "../../../services/slice/transactionSlice";
import { AdditionalFunction } from "../../../services/functions/AdditionalFunction";
import { convertToArray } from "../../../services/functions/toArrayFn";
import DateChecker from "../../../services/functions/DateChecker";
import { hasAccess, isAp } from "../../../services/functions/access";
import generalJournalSchema from "../../../schemas/generalJournalSchema";
import TagNumberText from "../TagNumberText";
import {
  useCreateGJMutation,
  useLazySearchTagQuery,
} from "../../../services/store/seconAPIRequest";
import { singleError } from "../../../services/functions/errorResponse";

const GeneralJournalModal = () => {
  const dispatch = useDispatch();
  const [oldValues, setOldValues] = useState(null);
  const openReason = useSelector((state) => state.prompt.openReason);
  const hasError = useSelector((state) => state.menu.hasError);
  const updateCount = useSelector((state) => state.menu.updateCount);
  const transactionData = useSelector((state) => state.menu.menuData);
  const documents = useSelector((state) => state.transaction.documents);

  const forViewing =
    transactionData?.gas_status !== "pending" &&
    transactionData?.gas_status !== "archived" &&
    transactionData?.gas_status !== "returned" &&
    transactionData !== null;

  const defaultValue = transactionDefaultValue();
  const { enqueueSnackbar } = useSnackbar();
  const { insertDocument, deepEqual } = AdditionalFunction();
  const { minDate } = DateChecker();

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

  const { data: accountNumber, isLoading: loadingAccountNumber } =
    useAccountNumberQuery({
      status: "active",
      pagination: "none",
    });

  const { data: location, isLoading: loadingLocation } = useLocationQuery({
    status: "active",
    pagination: "none",
  });

  const { data: cutOff } = useCutOffQuery({
    status: "active",
    pagination: "none",
  });

  const [
    triggerSearchTag,
    {
      data: searchedData,
      isFetching: loadingSearch,
      isSuccess: successSearch,
      isError: errorSearch,
    },
  ] = useLazySearchTagQuery();

  const [createGJ, { isLoading: loadingCreate }] = useCreateGJMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(generalJournalSchema),
    defaultValues: defaultValue,
  });

  const handleClear = (e) => {
    clearErrors();
    const defaultValue = clearValue();

    Object.entries(defaultValue).forEach(([key, value]) => {
      setValue(key, value);
    });

    if (!e) {
      handleAutoFill();
    } else {
      setValue("tin", null);
    }
  };

  const isLastMonthClosed = () => {
    const lastMonthDate = dayjs().subtract(1, "month");
    const lastMonthFormatted = lastMonthDate.format("YYYY-MM");

    return cutOff?.result?.some(
      (item) =>
        item?.state === "closed" &&
        dayjs(item?.date, "YYYY-MM-DD").format("YYYY-MM") === lastMonthFormatted
    );
  };

  const handleAutoFill = () => {
    const lastMonthClose = isLastMonthClosed();
    const monthAgo = dayjs(new Date()).subtract(5, "day");
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
      tag_month_year: lastMonthClose
        ? dayjs(new Date(), { locale: AdapterDayjs.locale })
        : dayjs(monthAgo, { locale: AdapterDayjs.locale }),
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
    if (errorSearch) {
      dispatch(setHasError(true));
    }
  }, [errorSearch]);

  useEffect(() => {
    if (transactionData?.reference_no !== "") {
      const docs = insertDocument(transactionData);
      const toArrayItems = convertToArray(docs);
      const addToDocs =
        document?.result?.filter((item) =>
          toArrayItems?.some((doc) => item?.code === doc?.code)
        ) || [];

      dispatch(setDocuments(addToDocs));
    }
  }, [transactionData, insertDocument, document, dispatch, setAddDocuments]);

  useEffect(() => {
    if (successSearch) {
      const tagMonthYear = dayjs(
        searchedData?.result?.tag_year,
        "YYMM"
      ).toDate();

      const docs = insertDocument(transactionData);
      const mapData = mapViewTransactionGJ(
        searchedData?.result?.transactions,
        ap,
        tin,
        document,
        accountNumber,
        location,
        docs
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
      setOldValues(values);
    }
  }, [successSearch, searchedData]);

  const checkField = (field) => {
    return watch("document_type")?.required_fields?.includes(field);
  };

  const submitHandler = async (submitData) => {
    const obj = {
      check_id: searchedData?.result?.id,
      amount: watch("amount"),
      type: watch("type"),
      reason: submitData?.reason,
    };
    try {
      const res = await createGJ(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleShortCut = () => {
    handleSubmit(submitHandler)();
  };

  const handleRemove = (item) => {
    const docs = documents?.filter((doc) => doc?.code !== item?.code);
    setValue(item?.code, "");
    dispatch(setDocuments(docs));
  };

  const checkChanges = () => {
    const currentValues = getValues();
    const propertiesToCheck = [
      "tin",
      "invoice_no",
      "documentType",
      "date_invoice",
      "amount",
      "description",
      "ap",
    ];

    const hasChanges = !propertiesToCheck.every((prop) =>
      deepEqual(currentValues?.[prop], oldValues?.[prop])
    );

    return hasChanges;
  };

  return (
    <Paper className="transaction-modal-container">
      <ShortcutHandler
        onUpdate={() =>
          updateCount === 1 ? dispatch(setUpdateCount(1)) : handleShortCut()
        }
        onEsc={() => dispatch(resetMenu())}
        onReceive={() => dispatch(setReceive(!checkChanges()))}
      />
      <img
        src={transaction}
        alt="transaction"
        className="transaction-image"
        draggable="false"
      />

      <Typography className="transaction-text">Add Transaction</Typography>
      <Divider orientation="horizontal" className="transaction-devider" />

      <Box className="form-title-transaction">
        <Typography className="form-title-text-transaction">
          Journal Type
        </Typography>
      </Box>

      <Box className="form-title-transaction">
        <FormControl className="form-control-radio general">
          <Controller
            name="type"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <RadioGroup {...field}>
                <FormControlLabel
                  value="Adjustment"
                  control={<Radio color="secondary" size="small" />}
                  label="Adjustment"
                />
                <FormControlLabel
                  value="Reversal"
                  control={<Radio color="secondary" size="small" />}
                  label="Reversal"
                />
              </RadioGroup>
            )}
          />
        </FormControl>
      </Box>

      <Divider orientation="horizontal" className="transaction-devider" />
      <Box className="form-title-transaction">
        <Typography className="form-title-text-transaction">
          Search Tag Number
        </Typography>
      </Box>

      <Box className="form-title-transaction">
        <TagNumberText
          control={control}
          name={"tagNumber"}
          className="transaction-form-textBox"
          searchTag={triggerSearchTag}
        />
      </Box>
      <form
        className="form-container-transaction"
        onSubmit={handleSubmit(submitHandler)}
      >
        <Divider orientation="horizontal" className="transaction-devider" />
        <Box className="form-title-transaction">
          <Typography className="form-title-text-transaction">
            Supplier Details
          </Typography>
        </Box>

        <AppTextBox
          disabled
          control={control}
          name={"tag_no"}
          label={"Tag Number *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.tag_no)}
          helperText={errors?.tag_no?.message}
        />
        <Autocomplete
          disabled
          control={control}
          name={"tin"}
          options={tin?.result || []}
          getOptionLabel={(option) => `${option.tin} - ${option?.company_name}`}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          onClose={() => {
            handleClear(false);
          }}
          renderInput={(params) => (
            <MuiTextField
              name="tin"
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

          <Button
            disabled
            endIcon={<AddIcon />}
            color="secondary"
            variant="contained"
            size="small"
            className="add-tax-document"
            onClick={() => dispatch(setAddDocuments(true))}
          >
            Add Document
          </Button>
        </Box>
        {watch("tin") && (
          <Autocomplete
            disabled
            control={control}
            name={"document_type"}
            options={document?.result || []}
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
                disabled
                className="transaction-form-date"
                label="Date Invoice *"
                format="MMMM DD, YYYY"
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
        {false && (
          <AppTextBox
            disabled
            control={control}
            name={"name_in_receipt"}
            label={"Name in receipt *"}
            color="primary"
            className="transaction-form-textBox"
            error={Boolean(errors?.name_in_receipt)}
            helperText={errors?.name_in_receipt?.message}
          />
        )}
        {checkField("invoice_no") && (
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
        )}
        {checkField("ref_no") && (
          <AppTextBox
            disabled
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
            disabled
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
            disabled
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
            disabled
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
            disabled
            control={control}
            name={"cost"}
            label={"Cost *"}
            color="primary"
            className="transaction-form-textBox"
            error={Boolean(errors?.cost)}
            helperText={errors?.cost?.message}
          />
        )}
        {documents?.length !== 0 &&
          documents?.map((item, index) => {
            return (
              <AppTextBox
                key={index}
                disabled
                control={control}
                name={`${item?.code}`}
                label={`${item?.code}`}
                color="primary"
                className="transaction-form-textBox"
                handleRemove={() => handleRemove(item)}
                secure
                remove
              />
            );
          })}
        {hasAccess(["ap_tag"]) && (
          <AppTextBox
            disabled
            multiline
            minRows={1}
            control={control}
            name={"description"}
            className="transaction-form-field-textBox "
            label="Description (Optional)"
            error={Boolean(errors.description)}
            helperText={errors.description?.message}
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
              render={({ field: { onChange, value, ...restField } }) => (
                <Box className="date-picker-container-transaction">
                  <DatePicker
                    disabled
                    className="transaction-form-date"
                    label="From (If Applicable)"
                    format="MMMM DD, YYYY"
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
                    disabled
                    className="transaction-form-date"
                    label="To (If Applicable)"
                    minDate={watch("coverage_from")}
                    format="MMMM DD, YYYY"
                    value={value}
                    onChange={(e) => {
                      onChange(e);
                    }}
                  />
                </Box>
              )}
            />

            {checkField("account_number") && (
              <Autocomplete
                disabled
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
                    label="Account Number (If Applicable)"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.account_number)}
                    helperText={errors.account_number?.message}
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
          disabled
          control={control}
          name={"ap"}
          options={ap?.result || []}
          getOptionLabel={(option) =>
            `${option.company_code} - ${option.description}`
          }
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
                disabled
                className="transaction-form-date"
                label="Tag year month *"
                format="MMMM YYYY"
                value={value}
                views={["month", "year"]}
                minDate={minDate}
                onChange={(e) => {
                  onChange(e);
                }}
                slotProps={{
                  textField: {
                    error: Boolean(errors?.check_date),
                    helperText: errors?.check_date?.message,
                  },
                }}
              />
            </Box>
          )}
        />

        <Box className="add-transaction-button-container">
          .
          <Box className="archive-transaction-button-container">
            {!forViewing && (
              <LoadingButton
                variant="contained"
                color="warning"
                onClick={() => dispatch(setOpenReason(true))}
                className="add-transaction-button"
                disabled={!watch("tin") || watch("type") === ""}
              >
                Add
              </LoadingButton>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                dispatch(resetMenu());
                dispatch(resetTransaction());
              }}
              className="add-transaction-button"
            >
              {forViewing ? "Close" : "Cancel"}
            </Button>
          </Box>
        </Box>
      </form>

      <Dialog
        open={
          loadingTIN ||
          loadingDocument ||
          loadingAccountNumber ||
          loadingAp ||
          loadingLocation ||
          loadingSearch ||
          loadingCreate
        }
        className="loading-transaction-create"
      >
        <Lottie animationData={loading} loop />
      </Dialog>

      <Dialog open={openReason} onClose={() => dispatch(setOpenReason(false))}>
        <ReasonInput
          title={`Reason for ${watch("type")}`}
          reasonDesc={`Please enter the reason for the ${watch("type")}`}
          confirmButton={"Confirm"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          confirmOnClick={submitHandler}
        />
      </Dialog>

      <Dialog
        onClose={() => dispatch(setHasError(false))}
        open={hasError}
        className="loading-role-create"
      >
        <Lottie animationData={noData} className="no-data-found" />
      </Dialog>

      <TransactionDrawer transactionData={transactionData} />
    </Paper>
  );
};

export default GeneralJournalModal;

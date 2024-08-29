import React, { useEffect, useRef, useState } from "react";

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
import {
  resetMenu,
  setMenuData,
  setUpdateCount,
} from "../../../services/slice/menuSlice";
import {
  useAccountNumberQuery,
  useApQuery,
  useArchiveTransactionMutation,
  useCheckTransactionQuery,
  useCreateTransactionMutation,
  useCutOffQuery,
  useDocumentTypeQuery,
  useJournalTransactionQuery,
  useLocationQuery,
  useReceiveTransactionMutation,
  useSupplierQuery,
  useUpdateTransactionMutation,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import { singleError } from "../../../services/functions/errorResponse";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  resetPrompt,
  setEntryReceive,
  setIsContinue,
  setOpenReason,
  setReceive,
  setWarning,
} from "../../../services/slice/promptSlice";
import {
  mapResponse,
  mapTransaction,
  mapViewTransaction,
} from "../../../services/functions/mapObject";
import { resetLogs } from "../../../services/slice/logSlice";

import "../../styles/TransactionModal.scss";
import "../../styles/UserModal.scss";
import "../../styles/RolesModal.scss";

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
import receiveImg from "../../../assets/svg/receive.svg";

import dayjs from "dayjs";
import Lottie from "lottie-react";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import AddIcon from "@mui/icons-material/Add";

import ReasonInput from "../ReasonInput";
import {
  clearValue,
  transactionDefaultValue,
} from "../../../services/constants/defaultValues";
import ReceiveEntry from "../ReceiveEntry";
import { useNavigate } from "react-router-dom";
import ShortcutHandler from "../../../services/functions/ShortcutHandler";
import socket from "../../../services/functions/serverSocket";
import {
  resetTransaction,
  setAddDocuments,
  setClearSearch,
  setDocuments,
} from "../../../services/slice/transactionSlice";
import { AdditionalFunction } from "../../../services/functions/AdditionalFunction";
import { convertToArray } from "../../../services/functions/toArrayFn";
import DateChecker from "../../../services/functions/DateChecker";
import { resetHeader } from "../../../services/slice/headerSlice";
import { hasAccess, isAp } from "../../../services/functions/access";
import moment from "moment";

const TransactionModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [oldValues, setOldValues] = useState(null);
  const warning = useSelector((state) => state.prompt.warning);
  const openReason = useSelector((state) => state.prompt.openReason);
  const isReceive = useSelector((state) => state.prompt.receive);
  const entryReceive = useSelector((state) => state.prompt.entryReceive);
  const isContinue = useSelector((state) => state.prompt.isContinue);
  const navigateTo = useSelector((state) => state.prompt.navigate);
  const updateCount = useSelector((state) => state.menu.updateCount);
  const transactionData = useSelector((state) => state.menu.menuData);
  const documents = useSelector((state) => state.transaction.documents);
  const addDocuments = useSelector((state) => state.transaction.addDocuments);

  const forViewing =
    transactionData?.gas_status !== "pending" &&
    transactionData?.gas_status !== "archived" &&
    transactionData?.gas_status !== "returned" &&
    transactionData !== null;

  const defaultValue = transactionDefaultValue();
  const { enqueueSnackbar } = useSnackbar();
  const { insertDocument, deepEqual } = AdditionalFunction();
  const { shouldDisableYear, minDate, isDateNotCutOff } = DateChecker();

  const [createTransaction, { isLoading }] = useCreateTransactionMutation();
  const [updateTransaction, { isLoading: updateLoading }] =
    useUpdateTransactionMutation();

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

  const { data: cutOff } = useCutOffQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: checkTransaction,
    isLoading: loadingSingle,
    isSuccess: singleSuccess,
  } = useCheckTransactionQuery(
    {
      status: "active",
      pagination: "none",
      transaction_id: transactionData?.id,
    },
    {
      skip: transactionData === null,
    }
  );

  const {
    data: journalTransaction,
    isLoading: loadingJournal,
    isSuccess: journalSuccess,
  } = useJournalTransactionQuery(
    {
      status: "active",
      pagination: "none",
      transaction_id: transactionData?.id,
    },
    {
      skip: transactionData === null,
    }
  );

  const [receiveTransaction, { isLoading: receiveLoading }] =
    useReceiveTransactionMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(transactionSchema),
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

  const disabledMonths =
    cutOff?.result
      ?.filter((item) => item?.state === "closed")
      ?.map((item) => {
        const date = dayjs(item?.date, "YYYY-MM-DD").toDate();
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      }) ?? [];

  const isLastMonthClosed = () => {
    const lastMonthDate = dayjs().subtract(1, "month");
    const lastMonthFormatted = lastMonthDate.format("YYYY-MM");

    return cutOff?.result?.some(
      (item) =>
        item?.state === "closed" &&
        dayjs(item?.date, "YYYY-MM-DD").format("YYYY-MM") === lastMonthFormatted
    );
  };

  const shouldDisableMonth = (date) => {
    const month = dayjs(date, "YYYY-MM-DD").format("YYYY-MM");
    return disabledMonths.includes(month);
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

  const hasRun = useRef(false);

  useEffect(() => {
    if (
      supplySuccess &&
      documentSuccess &&
      apSuccess &&
      accountSuccess &&
      locationSuccess &&
      transactionData !== null &&
      !hasRun?.current
    ) {
      const tagMonthYear = dayjs(transactionData?.tag_year, "YYMM").toDate();
      const docs = insertDocument(transactionData);
      const mapData = mapViewTransaction(
        transactionData,
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
      hasRun.current = true;
    }
  }, [
    documents,
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
    setValue,
    setOldValues,
  ]);
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
    if (isAp(transactionData?.apTagging?.company_code)) {
      dispatch(resetTransaction());
      dispatch(resetMenu());
    }
  }, [transactionData, dispatch]);

  const checkField = (field) => {
    return watch("document_type")?.required_fields?.includes(field);
  };

  const getFormattedString = (arr, values) => {
    return arr
      .map((item) => {
        const code = item.code;
        const value = values[code];
        return value ? `${code} ${value}` : null;
      })
      .filter(Boolean)
      .join(", ");
  };

  const submitHandler = async (submitData) => {
    const addedDocs = getFormattedString(documents, submitData);
    const mappedData = mapTransaction(submitData);
    const obj = {
      ...mappedData,
      id: transactionData !== null ? transactionData?.id : null,
      reference_no: addedDocs,
    };

    try {
      const res =
        transactionData !== null
          ? await updateTransaction(obj).unwrap()
          : await createTransaction(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      socket.emit(
        transactionData !== null
          ? "transaction_updated"
          : "transaction_created",
        {
          ...obj,
          message:
            transactionData !== null
              ? `The transaction ${obj?.tag_no} has been updated`
              : `A new transaction has been created.`,
        }
      );

      const docs = insertDocument(res?.result);
      const resData = await mapResponse(
        res?.result,
        ap,
        tin,
        document,
        accountNumber,
        docs
      );
      setOldValues(resData);

      transactionData !== null
        ? Object.entries(resData).forEach(([key, value]) => {
            setValue(key, value);
          })
        : dispatch(resetMenu());

      dispatch(
        setMenuData({
          ...resData,
          coverage_from: transactionData?.coverage_from
            ? dayjs(new Date(transactionData.coverage_from), {
                locale: AdapterDayjs.locale,
              })
            : null,
          coverage_to: transactionData?.coverage_to
            ? dayjs(new Date(transactionData.coverage_to), {
                locale: AdapterDayjs.locale,
              })
            : null,
          gas_status: res?.result?.gas_status,
        })
      );

      dispatch(resetLogs());
      dispatch(setUpdateCount(0));
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleArchive = async (submitData) => {
    const obj = {
      ...submitData,
      tag_no: transactionData?.tag_no,
      id: transactionData?.id,
    };

    try {
      const res = await archiveTransaction(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      socket.emit("transaction_received", {
        ...obj,
        message: `The transaction ${obj?.tag_no} has been archived`,
      });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleReceive = async () => {
    const obj = {
      tag_no: transactionData?.tag_no,
      id: transactionData?.id,
    };

    try {
      const res = await receiveTransaction(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const validateRoute = () => {
    const isZero =
      parseFloat(transactionData?.purchase_amount) ===
      parseFloat(journalTransaction?.result?.amount || 0) +
        parseFloat(checkTransaction?.result?.amount || 0);
    isZero ? handleReceive() : dispatch(setEntryReceive(true));
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
        onConfirm={() => dispatch(setEntryReceive(true))}
      />
      <img
        src={transaction}
        alt="transaction"
        className="transaction-image"
        draggable="false"
      />

      <Typography className="transaction-text">
        {forViewing && "Transaction"}
        {transactionData?.gas_status === "pending" && "Update Transaction"}
        {transactionData === null && "Add Transaction"}
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
          disabled={forViewing}
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
            disabled={forViewing}
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
            disabled={forViewing}
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
                disabled={forViewing}
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
            disabled={forViewing}
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
            disabled={forViewing}
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
            disabled={forViewing}
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
          disabled={singleSuccess || forViewing || journalSuccess}
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
            disabled={forViewing}
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
            disabled={forViewing}
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
            disabled={forViewing}
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
            disabled={forViewing}
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
                disabled={forViewing}
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
            disabled={forViewing}
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
                    disabled={forViewing}
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
                    disabled={forViewing}
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
                disabled={forViewing}
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
          disabled={forViewing || singleSuccess || journalSuccess}
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
                disabled={forViewing}
                className="transaction-form-date"
                label="Tag year month *"
                format="YY MM"
                value={value}
                views={["month", "year"]}
                minDate={minDate}
                onChange={(e) => {
                  onChange(e);
                }}
                shouldDisableMonth={shouldDisableMonth}
                shouldDisableYear={shouldDisableYear}
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
          {transactionData !== null &&
          transactionData?.gas_status === "pending" ? (
            <Box className="add-transaction-button-receive">
              {hasAccess(["ap_tag"]) && (
                <LoadingButton
                  disabled={singleSuccess || journalSuccess}
                  variant="contained"
                  color="error"
                  className="add-transaction-button"
                  onClick={() => dispatch(setWarning(true))}
                  startIcon={<DeleteForeverOutlinedIcon />}
                >
                  Archive
                </LoadingButton>
              )}
              {hasAccess(["ap_tag"]) && (
                <LoadingButton
                  variant="contained"
                  color="success"
                  className="add-transaction-button"
                  disabled={
                    checkChanges() ||
                    !isDateNotCutOff(
                      moment(new Date(watch("tag_month_year"))).format(
                        "YYYY-MM"
                      )
                    )
                  }
                  onClick={() => dispatch(setReceive(!checkChanges()))}
                  // onClick={() => checkChanges()}
                  startIcon={<HandshakeOutlinedIcon />}
                >
                  Receive
                </LoadingButton>
              )}
            </Box>
          ) : (
            "."
          )}

          <Box className="archive-transaction-button-container">
            {!forViewing && (
              <LoadingButton
                variant="contained"
                color="warning"
                type="submit"
                className="add-transaction-button"
                disabled={
                  !watch("tin") ||
                  shouldDisableYear(watch("tag_month_year")) ||
                  shouldDisableMonth(watch("tag_month_year"))
                }
              >
                {transactionData === null ? "Add" : "Update"}
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
          isLoading ||
          updateLoading ||
          loadingTIN ||
          loadingDocument ||
          loadingAccountNumber ||
          loadingAp ||
          loadingLocation ||
          loadingSingle ||
          loadingJournal ||
          receiveLoading
        }
        className="loading-transaction-create"
      >
        <Lottie animationData={loading} loop />
      </Dialog>

      <Dialog open={isReceive} onClose={() => dispatch(setReceive(false))}>
        <AppPrompt
          image={receiveImg}
          title={"Receive Transaction?"}
          message={"You are about to receive this Transaction"}
          nextLineMessage={"Please confirm to receive"}
          confirmButton={"Yes, Receive it!"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          confirmOnClick={() => validateRoute()}
        />
      </Dialog>

      <Dialog
        open={entryReceive}
        onClose={() => dispatch(setEntryReceive(false))}
      >
        <ReceiveEntry check />
      </Dialog>

      <Dialog open={warning} onClose={() => dispatch(setWarning(false))}>
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

      <Dialog open={openReason} onClose={() => dispatch(setOpenReason(false))}>
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

      <Dialog open={openReason} onClose={() => dispatch(setOpenReason(false))}>
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

      <Dialog
        open={addDocuments}
        className="additional-documents"
        onClose={() => dispatch(setAddDocuments(false))}
      >
        <Autocomplete
          disabled={forViewing}
          control={control}
          name={"addedDocuments"}
          options={
            document?.result.filter(
              (item) => !documents?.some((doc) => item?.code === doc?.code)
            ) || []
          }
          getOptionLabel={(option) => `${option.name}`}
          isOptionEqualToValue={(option, value) => option?.code === value?.code}
          onClose={() => {
            if (watch("addedDocuments")) {
              dispatch(setDocuments([...documents, watch("addedDocuments")]));
              dispatch(setAddDocuments(false));
              setValue("addedDocuments", null);
            }
            setValue("addedDocuments", null);
            dispatch(setAddDocuments(false));
          }}
          renderInput={(params) => (
            <MuiTextField
              name="addedDocuments"
              {...params}
              label="Document type"
              size="small"
              variant="outlined"
              error={Boolean(errors.addedDocuments)}
              helperText={errors.addedDocuments?.message}
              className="transaction-form-textBox"
            />
          )}
        />
      </Dialog>

      <Dialog open={archiveLoading} className="loading-role-create">
        <Lottie animationData={loadingLight} loop={archiveLoading} />
      </Dialog>

      <TransactionDrawer transactionData={transactionData} />

      <Dialog open={isContinue} onClose={() => dispatch(setIsContinue(false))}>
        <AppPrompt
          image={receiveImg}
          title={"Proceed with Computation?"}
          message={"Do you want to proceed with The Tax Computation?"}
          confirmButton={"Yes, Continue!"}
          cancelButton={"Later"}
          cancelOnClick={() => {
            dispatch(setClearSearch(true));
            dispatch(resetPrompt());
            dispatch(resetMenu());
          }}
          confirmOnClick={() => {
            navigate(navigateTo);
            dispatch(resetPrompt());
            dispatch(resetMenu());
            dispatch(resetHeader());
          }}
        />
      </Dialog>
    </Paper>
  );
};

export default TransactionModal;

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
import { useSnackbar } from "notistack";
import { singleError } from "../../../services/functions/errorResponse";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  resetPrompt,
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
import {
  clearValue,
  transactionDefaultValue,
} from "../../../services/constants/defaultValues";
import { useNavigate } from "react-router-dom";
import {
  resetTransaction,
  setAddDocuments,
  setClearSearch,
  setDocuments,
} from "../../../services/slice/transactionSlice";
import { AdditionalFunction } from "../../../services/functions/AdditionalFunction";
import { convertToArray } from "../../../services/functions/toArrayFn";
import { resetHeader } from "../../../services/slice/headerSlice";
import { hasAccess, isAp } from "../../../services/functions/access";
import { useLocationQuery } from "../../../services/api/locationApi";
import { useApQuery } from "../../../services/api/apApi";
import { useSupplierQuery } from "../../../services/api/supplierApi";
import { useDocumentTypeQuery } from "../../../services/api/documentTypeApi";
import { useAccountNumberQuery } from "../../../services/api/accountNumberApi";
import {
  useCreateTransactionMutation,
  useReturnTransactionMutation,
  useUpdateTransactionMutation,
} from "../../../services/api/transactionApi";
import {
  useCheckTransactionQuery,
  useCreateCheckEntriesMutation,
} from "../../../services/api/vouchersPayableApi";
import { useCutOffQuery } from "../../../services/api/cutOffApi";

import "../../styles/TransactionModal.scss";
import "../../styles/UserModal.scss";
import "../../styles/RolesModal.scss";

import transaction from "../../../assets/svg/transaction.svg";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Autocomplete from "../AutoComplete";
import transactionSchema from "../../../schemas/transactionSchema";
import AppPrompt from "../AppPrompt";
import warningImg from "../../../assets/svg/warning.svg";
import loadingLight from "../../../assets/lottie/Loading.json";
import TransactionDrawer from "../TransactionDrawer";
import receiveImg from "../../../assets/svg/receive.svg";
import dayjs from "dayjs";
import Lottie from "lottie-react";
import ClearIcon from "@mui/icons-material/Clear";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import RestoreIcon from "@mui/icons-material/Restore";
import AddIcon from "@mui/icons-material/Add";
import ReasonInput from "../ReasonInput";
import ShortcutHandler from "../../../services/functions/ShortcutHandler";
import DateChecker from "../../../services/functions/DateChecker";
import ManageHistoryOutlinedIcon from "@mui/icons-material/ManageHistoryOutlined";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";

import moment from "moment";

const TransactionModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [oldValues, setOldValues] = useState(null);
  const warning = useSelector((state) => state.prompt.warning);
  const openReason = useSelector((state) => state.prompt.openReason);
  const isReceive = useSelector((state) => state.prompt.receive);
  const isContinue = useSelector((state) => state.prompt.isContinue);
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
  const { minDate, isDateNotCutOff } = DateChecker();

  const [createTransaction, { isLoading }] = useCreateTransactionMutation();
  const [updateTransaction, { isLoading: updateLoading }] =
    useUpdateTransactionMutation();

  const [returnTransaction, { isLoading: returnLoading }] =
    useReturnTransactionMutation();

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

  const [createCheckEntry, { isLoading: loadingCheck }] =
    useCreateCheckEntriesMutation();

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
      dispatch(resetMenu());
      dispatch(resetLogs());
      dispatch(setUpdateCount(0));
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleReturn = async (submitData) => {
    const obj = {
      ...submitData,
      tag_no: transactionData?.tag_no,
      id: transactionData?.id,
    };

    try {
      const res = await returnTransaction(obj).unwrap();
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

  const handleCreateCheck = async () => {
    const obj = {
      tag_year: transactionData?.tag_year,
      transaction_id: transactionData?.id,
      ap_tagging_id: transactionData?.apTagging?.id || null,
      amount: transactionData?.purchase_amount,
      id: !singleSuccess ? null : checkTransaction?.result?.id,
    };

    try {
      const res = await createCheckEntry(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(setIsContinue(true));
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
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

      <Typography className="transaction-text">Transaction</Typography>
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
          disabled={!hasAccess("tagging")}
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
        </Box>

        <Controller
          name="date_invoice"
          control={control}
          render={({ field: { onChange, value, ...restField } }) => (
            <Box className="date-picker-container-transaction">
              <DatePicker
                disabled={!hasAccess("tagging")}
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
            disabled={!hasAccess("tagging")}
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
            disabled={!hasAccess("tagging")}
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
            disabled={!hasAccess("tagging")}
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
          disabled={!hasAccess("tagging")}
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
            disabled={!hasAccess("tagging")}
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
            disabled={!hasAccess("tagging")}
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
            disabled={!hasAccess("tagging")}
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
            disabled={!hasAccess("tagging")}
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
                disabled={!hasAccess("tagging")}
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

        <AppTextBox
          disabled={!hasAccess("tagging")}
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
                    disabled={!hasAccess("tagging")}
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
                    disabled={!hasAccess("tagging")}
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
                disabled={!hasAccess("tagging")}
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
          disabled={!hasAccess("tagging")}
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
              label="Charging department *"
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
                disabled={!hasAccess("tagging")}
                className="transaction-form-date"
                label="Tag year month *"
                format="MMMM YYYY"
                value={value}
                views={["month", "year"]}
                minDate={minDate}
                maxDate={dayjs().add(1, "month")}
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
          {transactionData !== null &&
          transactionData?.gas_status === "pending" ? (
            <Box className="add-transaction-button-receive">
              {hasAccess(["ap_tag"]) && (
                <LoadingButton
                  disabled={singleSuccess}
                  variant="contained"
                  color="error"
                  className="add-transaction-button"
                  onClick={() => dispatch(setWarning(true))}
                  startIcon={<RestoreIcon />}
                >
                  Return
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
            {hasAccess("tagging") && (
              <LoadingButton
                variant="contained"
                color="warning"
                type="submit"
                className="add-transaction-button"
                disabled={!watch("tin")}
                startIcon={
                  transactionData === null ? (
                    <AddToPhotosOutlinedIcon />
                  ) : (
                    <ManageHistoryOutlinedIcon />
                  )
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
              startIcon={<HighlightOffRoundedIcon />}
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
          loadingCheck
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
          confirmOnClick={() => handleCreateCheck()}
        />
      </Dialog>

      <Dialog open={warning} onClose={() => dispatch(setWarning(false))}>
        <AppPrompt
          image={warningImg}
          title={"Return Transaction?"}
          message={"You are about to return this transaction"}
          nextLineMessage={
            "This transaction will be reverted to the tagging stage for further processing."
          }
          confirmButton={"Yes, Return it!"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          confirmOnClick={() => dispatch(setOpenReason(true))}
        />
      </Dialog>

      <Dialog open={openReason} onClose={() => dispatch(setOpenReason(false))}>
        <ReasonInput
          title={"Reason for return"}
          reasonDesc={"Please enter the reason for returning this transaction"}
          warning={
            "Note that this transaction will be permanently archived once confirmed."
          }
          confirmButton={"Confirm"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          confirmOnClick={handleReturn}
        />
      </Dialog>

      <Dialog open={returnLoading} className="loading-role-create">
        <Lottie animationData={loadingLight} loop={returnLoading} />
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
            navigate("/ap/check");
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

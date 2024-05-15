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
import { resetMenu, setUpdateCount } from "../../../services/slice/menuSlice";
import {
  useAccountNumberQuery,
  useApQuery,
  useArchiveTransactionMutation,
  useCheckTransactionQuery,
  useCreateTransactionMutation,
  useDocumentTypeQuery,
  useJournalTransactionQuery,
  useLocationQuery,
  useReceiveTransactionMutation,
  useSupplierQuery,
  useTagMonthYearQuery,
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
import moment from "moment";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import FmdBadOutlinedIcon from "@mui/icons-material/FmdBadOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";

import ReasonInput from "../ReasonInput";
import {
  clearValue,
  transactionDefaultValue,
} from "../../../services/constants/defaultValues";
import ReceiveEntry from "../ReceiveEntry";
import { useNavigate } from "react-router-dom";
import ShortcutHandler from "../../../services/functions/ShortcutHandler";
import socket from "../../../services/functions/serverSocket";

const TransactionModal = ({ create, view, update, receive }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const warning = useSelector((state) => state.prompt.warning);
  const openReason = useSelector((state) => state.prompt.openReason);
  const isReceive = useSelector((state) => state.prompt.receive);
  const entryReceive = useSelector((state) => state.prompt.entryReceive);
  const isContinue = useSelector((state) => state.prompt.isContinue);
  const navigateTo = useSelector((state) => state.prompt.navigate);
  const updateCount = useSelector((state) => state.menu.updateCount);
  const transactionData = useSelector((state) => state.menu.menuData);

  const defaultValue = transactionDefaultValue();

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
    if (gTagSuccess && create) {
      const tagNoG = parseInt(gtag?.result) + 1 || 1;
      setValue("g_tag_number", tagNoG.toString().padStart(4, "0"));
    }

    if (
      gTagSuccess &&
      supplySuccess &&
      documentSuccess &&
      apSuccess &&
      accountSuccess &&
      locationSuccess &&
      !create
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
    create,
    update,
    view,
    receive,
    setValue,
  ]);

  const checkField = (field) => {
    return watch("document_type")?.required_fields?.includes(field);
  };

  const submitHandler = async (submitData) => {
    const mappedData = mapTransaction(submitData);
    const obj = {
      ...mappedData,
      id: !create ? transactionData?.id : null,
    };

    try {
      const res =
        update || receive
          ? await updateTransaction(obj).unwrap()
          : await createTransaction(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      socket.emit(
        update || receive ? "transaction_updated" : "transaction_created",
        {
          ...obj,
          message:
            update || receive
              ? `The transaction ${obj?.tag_no} has been updated`
              : `A new transaction has been created.`,
        }
      );
      const resData = await mapResponse(
        res?.result,
        ap,
        tin,
        document,
        accountNumber,
        location
      );
      update || receive
        ? Object.entries(resData).forEach(([key, value]) => {
            setValue(key, value);
          })
        : dispatch(resetMenu());
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

  const convertToPeso = (value) => {
    return parseFloat(value)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

  return (
    <Paper className="transaction-modal-container">
      <ShortcutHandler
        onUpdate={() =>
          updateCount === 1 ? dispatch(setUpdateCount(1)) : handleShortCut()
        }
        onEsc={() => dispatch(resetMenu())}
        onReceive={() => dispatch(setReceive(true))}
        onConfirm={() => dispatch(setEntryReceive(true))}
      />
      <img
        src={transaction}
        alt="transaction"
        className="transaction-image"
        draggable="false"
      />

      <Typography className="transaction-text">
        {view && "Transaction"}
        {update && "Update Transaction"}
        {create && "Add Transaction"}
        {receive && "Transaction"}
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
        {false && (
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
        )}
        <Autocomplete
          disabled={view || receive}
          control={control}
          name={"tin"}
          options={tin?.result || []}
          getOptionLabel={(option) =>
            `${option.tin} -> ${option?.company_name}`
          }
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
                    {watch("tin") && !receive && (
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
        {false && (
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
        )}
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
          disabled={singleSuccess || view || journalSuccess}
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
        {receive && (
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
                options={location?.result}
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
          {singleSuccess || journalSuccess ? (
            <Box className="note-transaction-container">
              <FmdBadOutlinedIcon
                color="warning"
                className="icon-prompt-text"
              />
              <Typography className="app-prompt-text-note">
                The transaction has been split into separate entries, leaving a
                balance of: <span>&#8369;</span>
                {convertToPeso(
                  transactionData?.purchase_amount -
                    (checkTransaction?.result?.amount || 0) -
                    (journalTransaction?.result?.amount || 0)
                )}
                {singleSuccess && (
                  <>
                    <br />
                    Check Voucher: <span>&#8369;</span>
                    {convertToPeso(checkTransaction?.result?.amount)}
                  </>
                )}
                {journalSuccess && (
                  <>
                    <br />
                    Journal Voucher: <span>&#8369;</span>
                    {convertToPeso(journalTransaction?.result?.amount)}
                  </>
                )}
              </Typography>
            </Box>
          ) : (
            <></>
          )}
          <Divider orientation="horizontal" className="transaction-devider" />
          <Typography className="form-title-text-transaction">
            Allocation
          </Typography>
        </Box>
        <Autocomplete
          disabled={view || singleSuccess || journalSuccess}
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
                disabled={update || view || receive}
                className="transaction-form-date"
                label="Tag year month *"
                format="YY MM"
                value={value}
                views={["month"]}
                onChange={(e) => {
                  onChange(e);
                }}
                onAccept={(e) =>
                  onDateChange(moment(new Date(e)).format("YYMM"))
                }
                minDate={moment(new Date()).subtract("1", "month")}
              />
              {errors.tag_month_year && (
                <Typography variant="caption" color="error">
                  {errors.tag_month_year.message}
                </Typography>
              )}
            </Box>
          )}
        />

        <Box className="add-transaction-button-container">
          {receive ? (
            <Box className="add-transaction-button-receive">
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

              <LoadingButton
                variant="contained"
                color="success"
                className="add-transaction-button"
                onClick={() => dispatch(setReceive(true))}
                startIcon={<HandshakeOutlinedIcon />}
              >
                Receive
              </LoadingButton>
            </Box>
          ) : (
            "."
          )}
          <Box className="archive-transaction-button-container">
            {!view && (
              <LoadingButton
                variant="contained"
                color="warning"
                type="submit"
                className="add-transaction-button"
                disabled={!watch("tin")}
              >
                {create ? "Add" : "Update"}
              </LoadingButton>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={() => dispatch(resetMenu())}
              className="add-transaction-button"
            >
              {view ? "Close" : "Cancel"}
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
          isFetching ||
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
        <ReceiveEntry />
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
            dispatch(resetPrompt());
            dispatch(resetMenu());
          }}
          confirmOnClick={() => {
            navigate(navigateTo);
            dispatch(resetPrompt());
            dispatch(resetMenu());
          }}
        />
      </Dialog>
    </Paper>
  );
};

export default TransactionModal;

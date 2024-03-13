import React, { useEffect } from "react";

import {
  Box,
  Button,
  Dialog,
  Divider,
  Paper,
  Typography,
  TextField as MuiTextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {
  resetMenu,
  setCreateTax,
  setTaxData,
  setUpdateTax,
} from "../../../services/slice/menuSlice";
import {
  useAccountNumberQuery,
  useArchiveTransactionMutation,
  useAtcQuery,
  useCreateTransactionMutation,
  useDocumentTypeQuery,
  useLocationQuery,
  useReceiveTransactionMutation,
  useReturnTransactionMutation,
  useSupplierQuery,
  useSupplierTypeQuery,
  useTaxComputationQuery,
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
  setOpenReasonReturn,
  setReceive,
  setReturn,
} from "../../../services/slice/promptSlice";
import {
  mapAPTransaction,
  mapTransaction,
} from "../../../services/functions/mapObject";
import { resetLogs } from "../../../services/slice/logSlice";

import "../../styles/TransactionModal.scss";

import transaction from "../../../assets/svg/transaction.svg";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Autocomplete from "../AutoComplete";
import AppPrompt from "../AppPrompt";
import receiveImg from "../../../assets/svg/receive.svg";
import warningImg from "../../../assets/svg/warning.svg";

import loadingLight from "../../../assets/lottie/Loading.json";
import TransactionDrawer from "../TransactionDrawer";

import dayjs from "dayjs";
import Lottie from "lottie-react";

import AddIcon from "@mui/icons-material/Add";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import KeyboardReturnOutlinedIcon from "@mui/icons-material/KeyboardReturnOutlined";

import ReasonInput from "../ReasonInput";
import apTransactionSchema from "../../../schemas/apTransactionSchema";

import TaxComputation from "./TaxComputation";

const TransactionModalAp = ({ transactionData, view, update, receive }) => {
  const dispatch = useDispatch();
  const createTax = useSelector((state) => state.menu.createTax);
  const updateTax = useSelector((state) => state.menu.updateTax);

  const openReason = useSelector((state) => state.prompt.openReason);
  const openReasonReturn = useSelector(
    (state) => state.prompt.openReasonReturn
  );
  const isReceive = useSelector((state) => state.prompt.receive);
  const isReturn = useSelector((state) => state.prompt.return);

  const { enqueueSnackbar } = useSnackbar();

  const [createTransaction, { isLoading }] = useCreateTransactionMutation();
  const [updateTransaction, { isLoading: updateLoading }] =
    useUpdateTransactionMutation();
  const [returnTransaction, { isLoading: returnLoading }] =
    useReturnTransactionMutation();
  const [receiveTransaction, { isLoading: receiveLoading }] =
    useReceiveTransactionMutation();

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
    data: atc,
    isLoading: loadingAtc,
    isSuccess: atcSuccess,
  } = useAtcQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: taxComputation,
    isLoading: loadingTax,
    isSuccess: taxSuccess,
  } = useTaxComputationQuery({
    status: "active",
    transaction_id: transactionData?.id,
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
      tag_no: "",
      description: "",
      supplier: "",
      proprietor: "",
      company_address: "",
      invoice_no: "",
      amount: "",
      tin: null,
      date_invoice: null,
      document_type: null,
      store: null,
      location_id: null,
      atc_id: null,
    },
  });

  useEffect(() => {
    if (
      (supplySuccess &&
        documentSuccess &&
        accountSuccess &&
        locationSuccess &&
        atcSuccess &&
        update) ||
      view ||
      receive
    ) {
      const tagMonthYear = dayjs(transactionData?.tag_year, "YYMM").toDate();
      const mapData = mapAPTransaction(
        transactionData,
        tin,
        document,
        accountNumber,
        atc
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
    supplySuccess,
    documentSuccess,
    accountSuccess,
    locationSuccess,
    document,
    accountNumber,
    tin,
    atcSuccess,
    watch,
  ]);

  const performTransactionAction = async (action, submitData) => {
    const obj = {
      id: transactionData?.id,
      ...submitData,
    };

    try {
      const res = await action(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
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
      if (update) {
        dispatch(resetLogs());
      }
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const handleArchive = async (submitData) => {
    await performTransactionAction(archiveTransaction, submitData);
  };

  const handleReceive = async () => {
    await performTransactionAction(receiveTransaction, {});
  };

  const handleReturn = async (submitData) => {
    await performTransactionAction(returnTransaction, submitData);
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
        {receive && "Transaction"}
        {update && "Update Transaction"}
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
          disabled
          control={control}
          name={"tin"}
          options={tin?.result || []}
          getOptionLabel={(option) => `${option.tin}`}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
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

        <Autocomplete
          control={control}
          name={"atc_id"}
          options={atc?.result || []}
          getOptionLabel={(option) => `${option.code} - ${option.name}`}
          isOptionEqualToValue={(option, value) => option?.code === value?.code}
          renderInput={(params) => (
            <MuiTextField
              name="atc_id"
              {...params}
              label="ATC *"
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
        {update && (
          <Box className="form-title-transaction">
            <Divider orientation="horizontal" className="transaction-devider" />
            <Typography className="form-title-text-transaction">
              Tax computation
            </Typography>
          </Box>
        )}
        {update && (
          <Box className="form-tax-details">
            <Button
              endIcon={<AddIcon />}
              color="secondary"
              variant="contained"
              size="small"
              className="add-tax-computation"
              onClick={() => dispatch(setCreateTax(true))}
            >
              Add
            </Button>
            <Box className="form-tax-box-details">
              {taxComputation?.result?.map((tax, index) => (
                <Paper
                  key={index}
                  className="tax-details-value"
                  onClick={() => {
                    dispatch(setUpdateTax(true));
                    dispatch(setTaxData(tax));
                  }}
                >
                  <Typography className="amount-tax">
                    Account title: {tax?.amount}
                  </Typography>
                  <Typography className="amount-tax">
                    Amount: {tax?.amount}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
        <Box className="form-title-transaction">
          <Divider orientation="horizontal" className="transaction-devider" />
        </Box>

        <Box className="add-transaction-button-container">
          <Box className="return-receive-container">
            {receive && (
              <LoadingButton
                variant="contained"
                color="success"
                className="add-transaction-button"
                onClick={() => dispatch(setReceive(true))}
                startIcon={<HandshakeOutlinedIcon />}
              >
                Receive
              </LoadingButton>
            )}
            {receive && (
              <LoadingButton
                variant="contained"
                color="error"
                className="add-transaction-button"
                onClick={() => dispatch(setReturn(true))}
                startIcon={<KeyboardReturnOutlinedIcon />}
              >
                Return
              </LoadingButton>
            )}
            {update && (
              <LoadingButton
                variant="contained"
                color="error"
                className="add-transaction-button"
                onClick={() => dispatch(setReturn(true))}
                startIcon={<KeyboardReturnOutlinedIcon />}
              >
                Return
              </LoadingButton>
            )}
          </Box>
          <Box className="archive-transaction-button-container">
            {update && (
              <LoadingButton
                variant="contained"
                color="warning"
                type="submit"
                className="add-transaction-button"
                disabled={!watch("tin")}
              >
                Update
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
          loadingAccountNumber ||
          loadingLocation ||
          receiveLoading ||
          loadingAtc ||
          returnLoading ||
          loadingTax
        }
        className="loading-transaction-create"
      >
        <Lottie animationData={loading} loop />
      </Dialog>

      <Dialog open={isReturn}>
        <AppPrompt
          image={warningImg}
          title={"Return Transaction?"}
          message={"You are about to return this Transaction"}
          nextLineMessage={"Please confirm to return it to tagging"}
          confirmButton={"Yes, Return it!"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          confirmOnClick={() => dispatch(setOpenReasonReturn(true))}
        />
      </Dialog>
      <Dialog open={isReceive}>
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
          confirmOnClick={() => handleReceive()}
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

      <Dialog open={openReasonReturn}>
        <ReasonInput
          title={"Reason for return"}
          reasonDesc={"Please enter the reason for returning this transaction"}
          confirmButton={"Confirm"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          confirmOnClick={handleReturn}
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

      <Dialog open={createTax} className="transaction-modal-dialog">
        <TaxComputation />
      </Dialog>

      <Dialog open={updateTax} className="transaction-modal-dialog">
        <TaxComputation update />
      </Dialog>
    </Paper>
  );
};

export default TransactionModalAp;

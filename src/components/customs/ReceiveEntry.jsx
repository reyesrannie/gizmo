import {
  Box,
  Button,
  Paper,
  Typography,
  TextField as MuiTextField,
  Dialog,
} from "@mui/material";
import React from "react";
import "../styles/AppPrompt.scss";
import "../styles/TransactionModal.scss";
import "../styles/RolesModal.scss";

import { LoadingButton } from "@mui/lab";
import receiveImg from "../../assets/svg/receive.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPrompt,
  setDisableProceed,
  setIsContinue,
  setNavigate,
} from "../../services/slice/promptSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import entriesSchema from "../../schemas/entriesSchema";
import Autocomplete from "./AutoComplete";
import loadingLight from "../../assets/lottie/Loading.json";

import AppTextBox from "./AppTextBox";
import {
  useCheckTransactionQuery,
  useCreateCheckEntriesMutation,
  useCreateJournalEntriesMutation,
  useJournalTransactionQuery,
  useReceiveTransactionMutation,
  useUpdateCheckEntriesMutation,
  useUpdateJournalEntriesMutation,
} from "../../services/store/request";
import Lottie from "lottie-react";
import { enqueueSnackbar } from "notistack";
import { singleError } from "../../services/functions/errorResponse";
import socket from "../../services/functions/serverSocket";

const ReceiveEntry = ({ check = false }) => {
  const dispatch = useDispatch();
  const transactionData = useSelector((state) => state.menu.menuData);
  const disableProceed = useSelector((state) => state.prompt.disableProceed);

  const { data: checkTransaction, isSuccess: singleSuccess } =
    useCheckTransactionQuery({
      status: "active",
      pagination: "none",
      transaction_id: transactionData?.id,
    });

  const { data: journalTransaction, isSuccess: journalSuccess } =
    useJournalTransactionQuery({
      status: "active",
      pagination: "none",
      transaction_id: transactionData?.id,
    });

  const [createCheckEntry, { isLoading: loadingCheck }] =
    useCreateCheckEntriesMutation();
  const [updateCheckEntry, { isLoading: loadingCheckUpdate }] =
    useUpdateCheckEntriesMutation();
  const [createJournalEntry, { isLoading: loadingJournal }] =
    useCreateJournalEntriesMutation();
  const [updateJournalEntry, { isLoading: loadingJournalUpdate }] =
    useUpdateJournalEntriesMutation();
  const [receiveTransaction, { isLoading: updateLoading }] =
    useReceiveTransactionMutation();

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(entriesSchema),
    defaultValues: {
      voucher: check ? "Check Voucher" : "Journal Voucher",
      amount:
        parseFloat(transactionData?.purchase_amount).toFixed(2) -
        parseFloat(checkTransaction?.result?.amount || 0).toFixed(2) -
        parseFloat(journalTransaction?.result?.amount || 0).toFixed(2),
    },
  });

  const validateRemaining = (amount) => {
    const balance =
      parseFloat(transactionData?.purchase_amount).toFixed(2) -
      parseFloat(checkTransaction?.result?.amount || 0).toFixed(2) -
      parseFloat(journalTransaction?.result?.amount || 0).toFixed(2);

    if (parseFloat(amount).toFixed(2) > balance) {
      setError("amount", {
        type: "max",
        message: "Amount Exceeded",
      });
      dispatch(setDisableProceed(true));
    } else {
      clearErrors();
      dispatch(setDisableProceed(false));
    }
  };

  const submitHandler = async (submitData) => {
    if (submitData?.voucher === "Check Voucher") {
      const obj = {
        tag_year: transactionData?.tag_year,
        transaction_id: transactionData?.id,
        ap_tagging_id: transactionData?.apTagging?.id || null,
        amount:
          parseFloat(checkTransaction?.result?.amount || 0) +
          parseFloat(submitData?.amount?.replace(/,/g, "") || "0"),
        id: !singleSuccess ? null : checkTransaction?.result?.id,
      };
      const isZero =
        parseFloat(transactionData?.purchase_amount) ===
        parseFloat(obj.amount) +
          parseFloat(journalTransaction?.result?.amount || 0);

      try {
        const res = singleSuccess
          ? await updateCheckEntry(obj).unwrap()
          : await createCheckEntry(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        isZero && (await receiveTransactionHandler("/ap/check"));
        !isZero && dispatch(resetPrompt());
      } catch (error) {
        singleError(error, enqueueSnackbar);
      }
    } else {
      console.log(transactionData);
      const obj = {
        tag_year: transactionData?.tag_year,
        transaction_id: transactionData?.transactions?.id,
        ap_tagging_id: transactionData?.apTagging?.id || null,
        amount:
          parseFloat(journalTransaction?.result?.amount || 0) +
          parseFloat(submitData?.amount?.replace(/,/g, "") || "0"),
        id: !journalSuccess ? null : journalTransaction?.result?.id,
      };

      try {
        const res = journalSuccess
          ? await updateJournalEntry(obj).unwrap()
          : await createJournalEntry(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        dispatch(resetPrompt());
      } catch (error) {
        singleError(error, enqueueSnackbar);
      }
    }
  };

  const receiveTransactionHandler = async (navigation) => {
    const obj = {
      tag_no: transactionData?.tag_no,
      id: transactionData?.id,
    };
    try {
      const res = await receiveTransaction(obj);
      enqueueSnackbar("Transaction successfully received", {
        variant: "success",
      });
      socket.emit("transaction_received", {
        ...obj,
        message: `The transaction ${obj?.tag_no} has been recieved`,
      });
      dispatch(setIsContinue(true));
      dispatch(setNavigate(navigation));
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const voucherOptions = ["Check Voucher", "Journal Voucher"];

  return (
    <Paper className="app-prompt-container">
      <img
        src={receiveImg}
        alt="Password"
        className="app-prompt-image"
        draggable="false"
      />
      <Typography className="app-prompt-title">Select Entry</Typography>
      <Typography className="app-prompt-text" sx={{ marginBottom: 2 }}>
        To continue please enter amount
      </Typography>

      <form
        className="form-container-transaction"
        onSubmit={handleSubmit(submitHandler)}
      >
        <Autocomplete
          disabled
          control={control}
          name={"voucher"}
          options={voucherOptions || []}
          getOptionLabel={(option) => `${option}`}
          isOptionEqualToValue={(option, value) => option === value}
          renderInput={(params) => (
            <MuiTextField
              name="document_type"
              {...params}
              label="Voucher *"
              size="small"
              variant="outlined"
              error={Boolean(errors.voucher)}
              helperText={errors.voucher?.message}
              className="transaction-form-textBox receive"
            />
          )}
        />
        <AppTextBox
          money
          control={control}
          name={"amount"}
          label={"Amount"}
          color="primary"
          className="transaction-form-textBox receive"
          error={Boolean(errors?.amount)}
          helperText={errors?.amount?.message}
          onKeyUp={(e) =>
            check && validateRemaining(e.target.value.replace(/,/g, ""))
          }
        />
        <Box className="app-prompt-button-container">
          <LoadingButton
            disabled={disableProceed}
            variant="contained"
            color="warning"
            className="change-password-button"
            type="submit"
          >
            Proceed
          </LoadingButton>
          <Button
            variant="contained"
            color="primary"
            className="change-password-button"
            onClick={() => dispatch(resetPrompt())}
          >
            cancel
          </Button>
        </Box>
      </form>

      <Dialog
        open={
          loadingCheck ||
          loadingCheckUpdate ||
          loadingJournal ||
          loadingJournalUpdate ||
          updateLoading
        }
        className="loading-role-create"
      >
        <Lottie animationData={loadingLight} loop />
      </Dialog>
    </Paper>
  );
};

export default ReceiveEntry;

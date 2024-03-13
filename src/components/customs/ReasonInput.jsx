import { Box, Button, Paper, Typography } from "@mui/material";
import React from "react";
import "../styles/ReasonInput.scss";

import FmdBadOutlinedIcon from "@mui/icons-material/FmdBadOutlined";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";

import reasonSchema from "../../schemas/reasonSchema";
import AppTextBox from "./AppTextBox";

const ReasonInput = ({
  title,
  confirmOnClick,
  confirmButton,
  cancelOnClick,
  cancelButton,
  warning,
  reasonDesc,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(reasonSchema),
    defaultValues: {
      reason: "",
    },
  });

  return (
    <Paper className="reason-prompt-container">
      <Typography className="reason-prompt-title">{title}</Typography>
      <Typography className="app-prompt-text">{reasonDesc}</Typography>
      <Box className="note-prompt-container">
        {warning && (
          <FmdBadOutlinedIcon color="warning" className="icon-prompt-text" />
        )}
        <Typography className="app-prompt-text-note">{warning}</Typography>
      </Box>
      <AppTextBox
        control={control}
        name={"reason"}
        label="Reason"
        multiline
        minRows={4}
        className="reason-form-field-textBox"
        error={Boolean(errors?.reason)}
        helperText={errors?.reason?.message}
      />
      <form onSubmit={handleSubmit(confirmOnClick)}>
        <Box className="reason-prompt-button-container">
          <LoadingButton
            disabled={!watch("reason")}
            variant="contained"
            color="warning"
            className="change-password-button"
            type="submit"
          >
            {confirmButton}
          </LoadingButton>
          <Button
            variant="contained"
            color="primary"
            className="change-password-button"
            onClick={cancelOnClick}
          >
            {cancelButton}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ReasonInput;

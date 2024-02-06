import { Box, Button, Paper, Typography } from "@mui/material";
import React from "react";
import "../styles/AppPrompt.scss";
import { LoadingButton } from "@mui/lab";

const AppPrompt = ({
  image,
  title,
  message,
  nextLineMessage,
  confirmButton,
  cancelButton,
  confirmOnClick,
  cancelOnClick,
}) => {
  return (
    <Paper className="app-prompt-container">
      <img
        src={image}
        alt="Password"
        className="app-prompt-image"
        draggable="false"
      />
      <Typography className="app-prompt-title">{title}</Typography>
      <Typography className="app-prompt-text">{message}</Typography>
      <Typography className="app-prompt-text">{nextLineMessage}</Typography>
      <Box className="app-prompt-button-container">
        <LoadingButton
          variant="contained"
          color="warning"
          className="change-password-button"
          onClick={() => confirmOnClick()}
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
    </Paper>
  );
};

export default AppPrompt;

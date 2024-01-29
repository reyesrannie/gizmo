import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import React from "react";

import password from "../../assets/svg/password.svg";

import "../styles/ChangePassword.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import changePasswordSchema from "../../schemas/changePasswordSchema";
import AppTextBox from "./AppTextBox";
import { LoadingButton } from "@mui/lab";
const ChangePassword = () => {
  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  return (
    <Paper className="change-password-container">
      <img
        src={password}
        alt="Password Image"
        className="change-password-image"
        draggable="false"
      />
      <Typography className="change-password-text">Change Password</Typography>
      <form className="change-password-form-container">
        <AppTextBox
          control={control}
          name={"old_password"}
          label={"Old Password *"}
          color="primary"
          className="change-password-textbox"
          secure={watch("old_password")}
          type="password"
        />
        <AppTextBox
          control={control}
          name={"password"}
          label={"New Password *"}
          type="password"
          className="change-password-textbox"
          secure={watch("old_password")}
          color="primary"
        />
        <AppTextBox
          control={control}
          name={"password_confirmation"}
          label={"Confirm Password *"}
          type="password"
          className="change-password-textbox"
          secure={watch("old_password")}
          color="primary"
        />
        <Box className="change-password-button-container">
          <LoadingButton variant="contained" color="warning">
            Update
          </LoadingButton>
          <Button variant="contained" color="primary">
            Cancel
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ChangePassword;

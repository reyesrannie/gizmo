import { Box, Button, Dialog, Paper, Typography } from "@mui/material";
import React from "react";

import password from "../../assets/svg/password.svg";
import changePasswordSchema from "../../schemas/changePasswordSchema";
import AppTextBox from "./AppTextBox";
import Lottie from "lottie-react";
import loading from "../../assets/lottie/Loading.json";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { resetAuth, setChangePass } from "../../services/slice/authSlice";
import { usePasswordChangeMutation } from "../../services/store/request";
import { useSnackbar } from "notistack";
import { objectError } from "../../services/functions/errorResponse";

import { loginUser } from "../../services/functions/loginServices";
import { useNavigate } from "react-router-dom";

import "../styles/ChangePassword.scss";

const ChangePassword = ({ logged = false }) => {
  const { enqueueSnackbar } = useSnackbar();
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [changePassword, { isLoading }] = usePasswordChangeMutation();

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

  const changePasswordHandler = async (submitData) => {
    const data = {
      ...submitData,
      id: userData.id,
    };

    try {
      const res = await changePassword(data).unwrap();
      loginUser(userData);
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(setChangePass(false));
      logged === false && navigate("/");
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  return (
    <Paper className="change-password-container">
      <img
        src={password}
        alt="Password"
        className="change-password-image"
        draggable="false"
      />
      <Typography className="change-password-text">Change Password</Typography>
      <form
        className="change-password-form-container"
        onSubmit={handleSubmit(changePasswordHandler)}
      >
        <AppTextBox
          control={control}
          name={"old_password"}
          label={"Old Password *"}
          color="primary"
          className="change-password-textbox"
          secure={watch("old_password")}
          type="password"
          error={Boolean(errors?.old_password)}
          helperText={errors?.old_password?.message}
        />
        <AppTextBox
          control={control}
          name={"password"}
          label={"New Password *"}
          type="password"
          className="change-password-textbox"
          secure={watch("password")}
          color="primary"
          error={Boolean(errors?.password)}
          helperText={errors?.password?.message}
        />
        <AppTextBox
          control={control}
          name={"password_confirmation"}
          label={"Confirm Password *"}
          type="password"
          className="change-password-textbox"
          secure={watch("password_confirmation")}
          color="primary"
          error={Boolean(errors?.password_confirmation)}
          helperText={errors?.password_confirmation?.message}
        />
        <Box className="change-password-button-container">
          <LoadingButton
            variant="contained"
            color="warning"
            type="submit"
            className="change-password-button"
            disabled={
              !watch("old_password") ||
              !watch("password") ||
              !watch("password_confirmation")
            }
          >
            Update
          </LoadingButton>
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(resetAuth())}
            className="change-password-button"
          >
            Cancel
          </Button>
        </Box>
      </form>
      <Dialog open={isLoading} className="loading-dialogBox">
        <Lottie animationData={loading} loop={isLoading} />
      </Dialog>
    </Paper>
  );
};

export default ChangePassword;

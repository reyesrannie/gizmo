import React from "react";

import "../../components/styles/Login.scss";
import logo from "../../assets/logo-name.png";

import loginSchema from "../../schemas/loginSchema";
import AppTextBox from "../../components/customs/AppTextBox";
import LoadingButton from "@mui/lab/LoadingButton";
import Lottie from "lottie-react";
import loading from "../../assets/lottie/Loading.json";

import { Box, Dialog, Stack, Typography } from "@mui/material";
import { useLoginMutation } from "../../services/store/request";
import { useSnackbar } from "notistack";
import { objectError } from "../../services/functions/errorResponse";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {
  setChangePass,
  setToken,
  setUserData,
} from "../../services/slice/authSlice";
import { loginUser } from "../../services/functions/loginServices";
import { useNavigate } from "react-router-dom";
import ChangePassword from "../../components/customs/modal/ChangePassword";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const changePass = useSelector((state) => state.auth.changePass);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmitHandler = async (submitData) => {
    try {
      const res = await login(submitData).unwrap();
      dispatch(setToken(res.token));
      dispatch(setUserData(res));
      if (res?.username === submitData?.password) {
        dispatch(setChangePass(true));
      } else {
        loginUser(res);
        navigate("/");
      }
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  return (
    <Box className="loginBox">
      {isLoading ? (
        <Lottie
          animationData={loading}
          loop={isLoading}
          className="lottie-login-loading"
        />
      ) : (
        <>
          <Box className="loginLeft">
            <Box className="loginLogo">
              <img
                src={logo}
                alt="logo"
                className="logoImg"
                draggable="false"
              />
            </Box>
          </Box>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <Box className="loginRight">
              <Stack
                flex="1"
                justifyContent="center"
                alignItems="center"
                padding="50px"
                display="flex"
                gap="1px"
              >
                <Typography className="loginText-Login">LOGIN</Typography>
                <Typography className="loginText-Please">
                  Please sign in to continue
                </Typography>
                <AppTextBox
                  control={control}
                  name={"username"}
                  label="Username"
                  error={Boolean(errors?.username)}
                  helperText={errors?.username?.message}
                  className="login-textbox"
                />
                <AppTextBox
                  control={control}
                  name={"password"}
                  label="Password"
                  type="password"
                  secure={watch("password")}
                  error={Boolean(errors?.password)}
                  helperText={errors?.password?.message}
                  className="login-textbox"
                />
                <LoadingButton
                  name="Submit"
                  type="submit"
                  variant="contained"
                  color="warning"
                  className="login-Button"
                  loading={isLoading}
                >
                  Sign In
                </LoadingButton>
              </Stack>
            </Box>
          </form>
          <Dialog open={changePass}>
            <ChangePassword />
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default Login;

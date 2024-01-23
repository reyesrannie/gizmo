import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

import "../../components/styles/Login.scss";
import logo from "../../assets/logo-name.png";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import loginSchema from "../../schemas/loginSchema";
import AppTextBox from "../../components/customs/AppTextBox";

const Login = () => {
  // hook form
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

  const onSubmitHandler = (submitData) => {
    console.log(submitData);
  };

  return (
    <Box className="loginBox">
      <Box className="loginLeft">
        <Box className="loginLogo">
          <img src={logo} alt="logo" className="logoImg" draggable="false" />
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
            <Button
              name="Submit"
              type="submit"
              variant="contained"
              color="warning"
              className="login-Button"
            >
              Sign In
            </Button>
          </Stack>
        </Box>
      </form>
    </Box>
  );
};

export default Login;

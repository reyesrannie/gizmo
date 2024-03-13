import { Box, Button, Dialog, Divider, Paper, Typography } from "@mui/material";
import React from "react";

import "../../styles/AccountTitlesModal.scss";
import accountTitles from "../../../assets/svg/accountNumber.svg";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Lottie from "lottie-react";

import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { resetMenu } from "../../../services/slice/menuSlice";
import {
  useCreateAccountTitlesMutation,
  useCreateVATMutation,
  useUpdateAccountTitlesMutation,
  useUpdateVATMutation,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import { objectError } from "../../../services/functions/errorResponse";
import accountTitlesSchema from "../../../schemas/accountTitlesSchema";

const AccountTitlesModal = ({ accountTitlesData, view, update }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [createAccountTitle, { isLoading }] = useCreateAccountTitlesMutation();
  const [updateAccountTitle, { isLoading: updateLoading }] =
    useUpdateAccountTitlesMutation();

  const defaultValues = {
    name: "",
    code: "",
  };

  const defaultData = {
    code: accountTitlesData?.code,
    name: accountTitlesData?.name,
  };

  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(accountTitlesSchema),
    defaultValues: view || update ? defaultData : defaultValues,
  });

  const submitHandler = async (submitData) => {
    const obj = {
      ...submitData,
      id: view || update ? accountTitlesData?.id : null,
    };

    try {
      const res = update
        ? await updateAccountTitle(obj).unwrap()
        : await createAccountTitle(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  return (
    <Paper className="accountTitles-modal-container">
      <img
        src={accountTitles}
        alt="accountTitles"
        className="accountTitles-image"
        draggable="false"
      />

      <Typography className="accountTitles-text">
        {view ? "Title" : update ? "Update Title" : "Add Title"}
      </Typography>
      <Divider orientation="horizontal" className="accountTitles-devider" />

      <form
        className="add-accountTitles-form-container"
        onSubmit={handleSubmit(submitHandler)}
      >
        <AppTextBox
          disabled={view || update}
          control={control}
          name={"code"}
          label={"Code *"}
          color="primary"
          className="add-accountTitles-textbox"
          error={Boolean(errors?.code)}
          helperText={errors?.code?.message}
        />
        <AppTextBox
          disabled={view}
          control={control}
          name={"name"}
          label={"Name *"}
          color="primary"
          className="add-accountTitles-textbox"
          error={Boolean(errors?.name)}
          helperText={errors?.name?.message}
        />

        <Box className="add-accountTitles-button-container">
          {!view && (
            <LoadingButton
              variant="contained"
              color="warning"
              type="submit"
              className="add-accountTitles-button"
              disabled={!watch("name") || !watch("code")}
            >
              {update ? "Update" : "Add"}
            </LoadingButton>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(resetMenu())}
            className="add-accountTitles-button"
          >
            {view ? "Close" : update ? "Cancel" : "Cancel"}
          </Button>
        </Box>
      </form>

      <Dialog
        open={isLoading || updateLoading}
        className="loading-accountTitles-create"
      >
        <Lottie animationData={loading} loop={isLoading || updateLoading} />
      </Dialog>
    </Paper>
  );
};

export default AccountTitlesModal;

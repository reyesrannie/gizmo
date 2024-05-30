import {
  Box,
  Button,
  Dialog,
  Divider,
  Paper,
  Typography,
  TextField as MuiTextField,
} from "@mui/material";
import React, { useEffect } from "react";

import "../../styles/AccountNumberModal.scss";
import accountNumber from "../../../assets/svg/accountNumber.svg";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Lottie from "lottie-react";

import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { resetMenu } from "../../../services/slice/menuSlice";
import {
  useCreateAccountNumberMutation,
  useLocationQuery,
  useSupplierQuery,
  useUpdateAccountNumberMutation,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import { objectError } from "../../../services/functions/errorResponse";
import accountNumberSchema from "../../../schemas/accountNumberSchema";
import Autocomplete from "../AutoComplete";
import socket from "../../../services/functions/serverSocket";

const AccountNumberModal = ({ accountNumberData, view, update }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const {
    data: supplier,
    isLoading: supplierLoading,
    isSuccess: successSuppier,
  } = useSupplierQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: location,
    isLoading: locationLoading,
    isSuccess: successLocation,
  } = useLocationQuery({
    status: "active",
    pagination: "none",
  });

  const [createAccountNumber, { isLoading }] = useCreateAccountNumberMutation();
  const [updateAccountNumber, { isLoading: updateLoading }] =
    useUpdateAccountNumberMutation();

  const {
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(accountNumberSchema),
    defaultValues: {
      account_no: "",
      supplier_id: null,
      location_id: null,
    },
  });

  useEffect(() => {
    if (successSuppier && successLocation) {
      const values = {
        account_no: accountNumberData?.account_no || "",
        location_id: location?.result?.find(
          (loc) => loc.id === accountNumberData?.location?.id || null
        ),
        supplier_id: supplier?.result?.find(
          (sup) => sup.id === accountNumberData?.supplier?.id || null
        ),
      };
      Object.entries(values).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [
    successSuppier,
    successLocation,
    accountNumberData,
    setValue,
    location,
    supplier,
  ]);

  const submitHandler = async (submitData) => {
    const obj = {
      ...submitData,
      location_id: submitData?.location_id?.id,
      supplier_id: submitData?.supplier_id?.id,
      id: update ? accountNumberData?.id : null,
    };

    if (update) {
      try {
        const res = await updateAccountNumber(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        socket.emit("account_number_updated");
        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    } else {
      try {
        const res = await createAccountNumber(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        socket.emit("account_number_updated");
        dispatch(resetMenu());
      } catch (error) {
        objectError(error, setError, enqueueSnackbar);
      }
    }
  };

  return (
    <Paper className="account-number-modal-container">
      <img
        src={accountNumber}
        alt="account-number"
        className="account-number-image"
        draggable="false"
      />

      <Typography className="account-number-text">
        {view ? "Account Number" : update ? "Update Account " : "Add Account "}
      </Typography>
      <Divider orientation="horizontal" className="account-number-devider" />

      <form
        className="add-account-number-form-container"
        onSubmit={handleSubmit(submitHandler)}
      >
        <AppTextBox
          control={control}
          name={"account_no"}
          label={"Account Number *"}
          color="primary"
          className="add-account-number-textbox"
          error={Boolean(errors?.account_no)}
          helperText={errors?.account_no?.message}
        />

        <Autocomplete
          control={control}
          name={"supplier_id"}
          options={supplier?.result || []}
          getOptionLabel={(option) =>
            `${option?.tin} - ${option?.company_name}`
          }
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <MuiTextField
              name="supplier_types"
              {...params}
              label="Supplier"
              size="small"
              variant="outlined"
              error={Boolean(errors.supplier_id)}
              helperText={errors.supplier_id?.message}
              className="account-number-form-field-autocomplete"
            />
          )}
        />
        <Autocomplete
          control={control}
          name={"location_id"}
          options={location?.result || []}
          getOptionLabel={(option) => `${option?.name}`}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <MuiTextField
              name="supplier_types"
              {...params}
              label="Location"
              size="small"
              variant="outlined"
              error={Boolean(errors.location_id)}
              helperText={errors.location_id?.message}
              className="account-number-form-field-autocomplete"
            />
          )}
        />

        <Box className="add-account-number-button-container">
          {!view && (
            <LoadingButton
              variant="contained"
              color="warning"
              type="submit"
              className="add-account-number-button"
              disabled={
                !watch("account_no") ||
                !watch("supplier_id") ||
                !watch("location_id")
              }
            >
              {update ? "Update" : "Add"}
            </LoadingButton>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(resetMenu())}
            className="add-account-number-button"
          >
            {view ? "Close" : update ? "Cancel" : "Cancel"}
          </Button>
        </Box>
      </form>

      <Dialog
        open={isLoading || updateLoading || supplierLoading || locationLoading}
        className="loading-account-number-create"
      >
        <Lottie
          animationData={loading}
          loop={
            isLoading || updateLoading || supplierLoading || locationLoading
          }
        />
      </Dialog>
    </Paper>
  );
};

export default AccountNumberModal;

import {
  Box,
  Button,
  Dialog,
  Divider,
  Paper,
  Typography,
  TextField as MuiTextField,
  Stack,
} from "@mui/material";
import React, { useEffect } from "react";

import "../styles/AtcModal.scss";
import "../styles/Atc.scss";
import "../styles/TransactionModal.scss";
import "../styles/StatusIndicator.scss";

import atc from "../../assets/svg/atc.svg";
import loading from "../../assets/lottie/Loading-2.json";

import Lottie from "lottie-react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { setBankData, setUpdateMenu } from "../../services/slice/menuSlice";
import { useSnackbar } from "notistack";
import { objectError } from "../../services/functions/errorResponse";
import Autocomplete from "./AutoComplete";

import bankSelectSchema from "../../schemas/bankSelectSchema";
import { date } from "yup";
import { useAccountTitlesQuery } from "../../services/api/coaApi";
import {
  useBankAccountNumberQuery,
  useBankAccountTitleQuery,
  useBankQuery,
} from "../../services/api/bankApi";

const SelectBankMenu = ({ type = "" }) => {
  const menuData = useSelector((state) => state.menu.menuData);
  const updateMenu = useSelector((state) => state.menu.updateMenu);
  const updateData = useSelector((state) => state.menu.updateData);
  const bankData = useSelector((state) => state.menu.bankData);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const {
    data: accountTitles,
    isLoading: loadingTitles,
    isSuccess: successTitles,
  } = useAccountTitlesQuery({
    status: "active",
    pagination: "none",
  });

  const { data: bank, isLoading: loadingBank } = useBankQuery({
    status: "active",
    pagination: "none",
  });

  const {
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bankSelectSchema),
    defaultValues: {
      bank: null,
      account_number: null,
      title: null,
      type: "",
    },
  });

  const {
    data: bankAccountTitle,
    isError,
    isLoading,
  } = useBankAccountTitleQuery(
    {
      status: "active",
      pagination: "none",
      bank_account_id: watch("account_number")?.id,
    },
    {
      skip: !watch("account_number"),
    }
  );

  const {
    data: bankAccountNumber,
    isLoading: loadingBankAccountNumber,
    isError: errorBankAccountNumber,
  } = useBankAccountNumberQuery(
    {
      status: "active",
      pagination: "none",
      bank_id: watch("bank")?.id,
    },
    {
      skip: !watch("bank"),
    }
  );

  useEffect(() => {
    if (menuData && successTitles && updateMenu) {
      const obj = {
        name: menuData?.name,
        coa_id:
          accountTitles?.result?.find(
            (item) => menuData?.coa?.id === item.id
          ) || [],
        type: type,
      };

      Object.entries(obj).forEach(([name, value]) => setValue(name, value));
    }
    if (type !== "") {
      setValue("type", type);
    }
  }, [menuData, successTitles]);

  const submitHandler = async (submitData) => {
    try {
      if (
        !submitData?.title?.check_numbers?.length &&
        watch("type") === "CHECK VOUCHER"
      ) {
        enqueueSnackbar("No check numbers found!", { variant: "error" });
      }
      if (watch("type") === "DEBIT MEMO") {
        const obj = {
          id: Date.now(),
          bank: submitData?.bank?.name,
          bank_id: submitData?.bank?.id,
          credit_coa_id: submitData?.bank?.coa,
        };
        dispatch(
          setBankData(Array.isArray(bankData) ? [...bankData, obj] : [obj])
        );
        dispatch(setUpdateMenu(false));
      } else {
        const obj = {
          id: Date.now(),
          bank: submitData?.bank?.name,
          bank_id: submitData?.bank?.id,
          title_id: submitData?.title?.id,
          credit_coa_id: submitData?.bank?.coa,
          check_no: submitData?.title?.check_numbers,
        };
        dispatch(
          setBankData(Array.isArray(bankData) ? [...bankData, obj] : [obj])
        );
        dispatch(setUpdateMenu(false));
      }
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  return (
    <Paper className="bank-modal-container">
      <img src={atc} alt="atc" className="atc-image" draggable="false" />

      <Typography className="atc-text">
        {updateMenu && "Select Bank"}
      </Typography>
      <Divider orientation="horizontal" className="atc-devider" />

      <form onSubmit={handleSubmit(submitHandler)}>
        <Box className="add-bank-form-container select-bank">
          <Autocomplete
            control={control}
            name={"bank"}
            options={bank?.result || []}
            getOptionLabel={(option) => `${option.name}`}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            onClose={() => {
              setValue("account_number", null);
              setValue("title", null);
            }}
            renderInput={(params) => (
              <MuiTextField
                name="bank"
                {...params}
                label="Bank *"
                size="small"
                variant="outlined"
                error={Boolean(errors.bank)}
                helperText={errors.bank?.message}
                className="add-atc-textbox autocomplete"
              />
            )}
            disableClearable
          />

          {watch("type") === "CHECK VOUCHER" && (
            <Autocomplete
              control={control}
              name={"account_number"}
              options={
                errorBankAccountNumber ? [] : bankAccountNumber?.result || []
              }
              getOptionLabel={(option) => `${option.account_no}`}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              onClose={() => {
                setValue("title", null);
              }}
              renderInput={(params) => (
                <MuiTextField
                  name="account_number"
                  {...params}
                  label="Account number*"
                  size="small"
                  variant="outlined"
                  error={Boolean(errors.account_number)}
                  helperText={errors.account_number?.message}
                  className="add-atc-textbox autocomplete"
                />
              )}
              disableClearable
            />
          )}

          {watch("type") === "CHECK VOUCHER" && (
            <Autocomplete
              control={control}
              name={"title"}
              options={isError ? [] : bankAccountTitle?.result || []}
              getOptionLabel={(option) => `${option.bank_title}`}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              renderInput={(params) => (
                <MuiTextField
                  name="title"
                  {...params}
                  label="Check series name*"
                  size="small"
                  variant="outlined"
                  error={Boolean(errors.title)}
                  helperText={errors.title?.message}
                  className="add-atc-textbox autocomplete"
                />
              )}
              disableClearable
            />
          )}
        </Box>

        <Box>
          <Stack
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            gap={10}
          >
            <Box></Box>

            <Box>
              <Stack flexDirection={"row"} gap={1}>
                <Button
                  variant="contained"
                  color="success"
                  className="add-atc-button"
                  type="submit"
                >
                  Select
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    dispatch(setUpdateMenu(false));
                  }}
                  className="add-atc-button"
                >
                  {updateData ? "Cancel" : "Close"}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </form>

      <Dialog
        open={
          isLoading || loadingTitles || loadingBank || loadingBankAccountNumber
        }
        className="loading-atc-create"
      >
        <Lottie animationData={loading} loop />
      </Dialog>
    </Paper>
  );
};

export default SelectBankMenu;

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

import "../../styles/AtcModal.scss";
import "../../styles/TransactionModal.scss";

import atc from "../../../assets/svg/atc.svg";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Lottie from "lottie-react";

import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { resetMenu } from "../../../services/slice/menuSlice";
import {
  useAccountTitlesQuery,
  useCreateATCMutation,
  useCreateCheckNumberMutation,
  useUpdateATCMutation,
  useUpdateCheckNumberMutation,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import { objectError } from "../../../services/functions/errorResponse";
import checkNumberSchema from "../../../schemas/checkNumberSchema";
import Autocomplete from "../AutoComplete";
import balanceSchema from "../../../schemas/balanceSchema";
import {
  useArchiveBalMutation,
  useCreateBalanceMutation,
  useUpdateBalanceMutation,
} from "../../../services/store/seconAPIRequest";

const BalanceModal = ({ view, params }) => {
  const menuData = useSelector((state) => state.menu.menuData);
  const updateMenu = useSelector((state) => state.menu.updateMenu);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [createBal, { isLoading }] = useCreateBalanceMutation();
  const [updateBal, { isLoading: updateLoading }] = useUpdateBalanceMutation();
  const [archiveBal, { isLoading: archiveLoading }] = useArchiveBalMutation();

  const {
    data: accountTitles,
    isLoading: loadingTitles,
    isSuccess: successTitles,
  } = useAccountTitlesQuery({
    status: "active",
    pagination: "none",
  });

  const {
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(balanceSchema),
    defaultValues: {
      amount: "",
      bank_id: null,
    },
  });

  useEffect(() => {
    if (menuData && successTitles) {
      const obj = {
        amount: menuData?.amount,
        bank_id: accountTitles?.result?.find(
          (item) => menuData?.bank?.id === item.id
        ),
      };

      Object.entries(obj).forEach(([name, value]) => setValue(name, value));
    }
  }, [menuData, successTitles]);

  const submitHandler = async (submitData) => {
    const obj = {
      ...submitData,
      id: view || updateMenu ? menuData?.id : null,
      bank_id: submitData?.bank_id?.id,
    };

    try {
      const res = updateMenu
        ? await updateBal(obj).unwrap()
        : await createBal(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const handelArchive = async () => {
    const obj = {
      id: view || updateMenu ? menuData?.id : null,
    };

    try {
      const res = await archiveBal(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };
  return (
    <Paper className="atc-modal-container">
      <img src={atc} alt="atc" className="atc-image" draggable="false" />

      <Typography className="atc-text">
        {view ? "Balance" : updateMenu ? "Update " : "Add"}
      </Typography>
      <Divider orientation="horizontal" className="atc-devider" />

      <form
        className="add-atc-form-container"
        onSubmit={handleSubmit(submitHandler)}
      >
        <AppTextBox
          money
          disabled={menuData?.state === "Paid"}
          control={control}
          name={"amount"}
          label={"Amount *"}
          color="primary"
          className="add-atc-textbox"
          error={Boolean(errors?.amount)}
          helperText={errors?.amount?.message}
        />

        <Autocomplete
          disabled={menuData?.state === "Paid"}
          control={control}
          name={"bank_id"}
          options={
            accountTitles?.result?.filter((coa) =>
              coa?.name?.startsWith("CIB")
            ) || []
          }
          getOptionLabel={(option) => `${option.name}`}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <MuiTextField
              name="bank_id"
              {...params}
              label="Bank*"
              size="small"
              variant="outlined"
              error={Boolean(errors.bank_id)}
              helperText={errors.bank_id?.message}
              className="add-atc-textbox autocomplete"
            />
          )}
          disableClearable
        />

        <Box>
          <Stack
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            gap={10}
          >
            <Box>
              {updateMenu && (
                <LoadingButton
                  variant="contained"
                  color={"error"}
                  className="add-atc-button"
                  onClick={() => handelArchive()}
                >
                  Archive
                </LoadingButton>
              )}
            </Box>
            <Box>
              <Stack flexDirection={"row"} gap={1}>
                <LoadingButton
                  variant="contained"
                  color="warning"
                  type="submit"
                  className="add-atc-button"
                  disabled={
                    watch("amount") === "" ||
                    watch("bank_id") === null ||
                    menuData?.state === "Paid"
                  }
                >
                  {updateMenu ? "Update" : "Add"}
                </LoadingButton>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => dispatch(resetMenu())}
                  className="add-atc-button"
                >
                  {view ? "Close" : updateMenu ? "Cancel" : "Cancel"}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </form>

      <Dialog
        open={isLoading || updateLoading || loadingTitles}
        className="loading-atc-create"
      >
        <Lottie animationData={loading} loop />
      </Dialog>
    </Paper>
  );
};

export default BalanceModal;

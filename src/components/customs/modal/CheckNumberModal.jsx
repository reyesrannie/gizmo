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

const CheckNumberModal = ({ view }) => {
  const menuData = useSelector((state) => state.menu.menuData);
  const updateMenu = useSelector((state) => state.menu.updateMenu);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [createAtc, { isLoading }] = useCreateCheckNumberMutation();
  const [updateAtc, { isLoading: updateLoading }] =
    useUpdateCheckNumberMutation();

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
    resolver: yupResolver(checkNumberSchema),
    defaultValues: {
      check_no: "",
      coa_id: null,
    },
  });

  useEffect(() => {
    if (menuData && successTitles) {
      const obj = {
        check_no: menuData?.check_no,
        coa_id: accountTitles?.result?.find(
          (item) => menuData?.coa?.id === item.id
        ),
      };

      Object.entries(obj).forEach(([name, value]) => setValue(name, value));
    }
  }, [menuData, successTitles]);

  const submitHandler = async (submitData) => {
    const obj = {
      ...submitData,
      id: view || updateMenu ? menuData?.id : null,
      coa_id: submitData?.coa_id?.id,
    };

    try {
      const res = updateMenu
        ? await updateAtc(obj).unwrap()
        : await createAtc(obj).unwrap();
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
        {view ? "Check Number" : updateMenu ? "Update " : "Add"}
      </Typography>
      <Divider orientation="horizontal" className="atc-devider" />

      <form
        className="add-atc-form-container"
        onSubmit={handleSubmit(submitHandler)}
      >
        <AppTextBox
          disabled={menuData?.state === "Paid"}
          control={control}
          name={"check_no"}
          label={"Check Number *"}
          color="primary"
          className="add-atc-textbox"
          error={Boolean(errors?.check_no)}
          helperText={errors?.check_no?.message}
        />

        <Autocomplete
          disabled={menuData?.state === "Paid"}
          control={control}
          name={"coa_id"}
          options={
            accountTitles?.result?.filter((coa) =>
              coa?.name?.startsWith("CIB")
            ) || []
          }
          getOptionLabel={(option) => `${option.name}`}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <MuiTextField
              name="coa_id"
              {...params}
              label="Bank*"
              size="small"
              variant="outlined"
              error={Boolean(errors.coa_id)}
              helperText={errors.coa_id?.message}
              className="add-atc-textbox autocomplete"
            />
          )}
          disableClearable
        />

        <Box className="add-atc-button-container">
          {!view && (
            <LoadingButton
              variant="contained"
              color="warning"
              type="submit"
              className="add-atc-button"
              disabled={
                watch("check_no") === "" ||
                watch("coa_id") === null ||
                menuData?.state === "Paid"
              }
            >
              {updateMenu ? "Update" : "Add"}
            </LoadingButton>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(resetMenu())}
            className="add-atc-button"
          >
            {view ? "Close" : updateMenu ? "Cancel" : "Cancel"}
          </Button>
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

export default CheckNumberModal;

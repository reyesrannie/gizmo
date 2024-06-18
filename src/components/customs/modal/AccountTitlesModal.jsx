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

import "../../styles/AccountTitlesModal.scss";
import accountTitles from "../../../assets/svg/accountNumber.svg";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Lottie from "lottie-react";

import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { resetMenu } from "../../../services/slice/menuSlice";
import {
  useCTitlesQuery,
  useCreateAccountTitlesMutation,
  useCreatecTitlesMutation,
  useCreategcTitlesMutation,
  useCreateggpTitlesMutation,
  useCreategpTitlesMutation,
  useCreatepTitlesMutation,
  useGcTitlesQuery,
  useGgpTitlesQuery,
  useGpTitlesQuery,
  usePTitlesQuery,
  useUpdateAccountTitlesMutation,
  useUpdatecTitlesMutation,
  useUpdategcTitlesMutation,
  useUpdateggpTitlesMutation,
  useUpdategpTitlesMutation,
  useUpdatepTitlesMutation,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import { objectError } from "../../../services/functions/errorResponse";
import accountTitlesSchema from "../../../schemas/accountTitlesSchema";
import Autocomplete from "../AutoComplete";
import socket from "../../../services/functions/serverSocket";

const AccountTitlesModal = ({ accountTitlesData, view, update, create }) => {
  const dispatch = useDispatch();
  const header =
    useSelector((state) => state.headers.header) || "Account Titles";
  const { enqueueSnackbar } = useSnackbar();

  const {
    data: ggpTitle,
    isLoading: ggpLoading,
    isSuccess: ggpSuccess,
  } = useGgpTitlesQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: gpTitle,
    isLoading: gpLoading,
    isSuccess: gpSuccess,
  } = useGpTitlesQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: pTitle,
    isLoading: pLoading,
    isSuccess: pSuccess,
  } = usePTitlesQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: cTitle,
    isLoading: cLoading,
    isSuccess: cSuccess,
  } = useCTitlesQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: gcTitle,
    isLoading: gcLoading,
    isSuccess: gcSuccess,
  } = useGcTitlesQuery({
    status: "active",
    pagination: "none",
  });

  const [createAccountTitle, { isLoading }] = useCreateAccountTitlesMutation();
  const [updateAccountTitle, { isLoading: updateLoading }] =
    useUpdateAccountTitlesMutation();

  const [createGGP, { isLoading: ggpLoadingCreate }] =
    useCreateggpTitlesMutation();
  const [updateGGP, { isLoading: ggpLoadingUpdate }] =
    useUpdateggpTitlesMutation();

  const [createGP, { isLoading: gpLoadingCreate }] =
    useCreategpTitlesMutation();
  const [updateGP, { isLoading: gpLoadingUpdate }] =
    useUpdategpTitlesMutation();

  const [createP, { isLoading: pLoadingCreate }] = useCreatepTitlesMutation();
  const [updateP, { isLoading: pLoadingUpdate }] = useUpdatepTitlesMutation();

  const [createC, { isLoading: cLoadingCreate }] = useCreatecTitlesMutation();
  const [updateC, { isLoading: cLoadingUpdate }] = useUpdatecTitlesMutation();

  const [createGC, { isLoading: gcLoadingCreate }] =
    useCreategcTitlesMutation();
  const [updateGC, { isLoading: gcLoadingUpdate }] =
    useUpdategcTitlesMutation();

  const defaultValues = {
    name: "",
    code: "",
    ggp: null,
    gp: null,
    p: null,
    c: null,
    gc: null,
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
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(accountTitlesSchema),
    defaultValues: view || update ? defaultData : defaultValues,
  });

  useEffect(() => {
    if (
      update &&
      ggpSuccess &&
      gpSuccess &&
      pSuccess &&
      cSuccess &&
      gcSuccess
    ) {
      const obj = {
        ggp: ggpTitle?.result?.find(
          (item) => item?.id === accountTitlesData?.ac_ggp_id
        ),
        gp: gpTitle?.result?.find(
          (item) => item?.id === accountTitlesData?.ac_gp_id
        ),
        p: pTitle?.result?.find(
          (item) => item?.id === accountTitlesData?.ac_p_id
        ),
        c: cTitle?.result?.find(
          (item) => item?.id === accountTitlesData?.ac_c_id
        ),
        gc: gcTitle?.result?.find(
          (item) => item?.id === accountTitlesData?.ac_gc_id
        ),
      };

      Object.entries(obj).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [update, ggpTitle, ggpSuccess, gpSuccess, pSuccess, cSuccess, gcSuccess]);

  const handle = async (obj, handler) => {
    try {
      const res = await handler(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      socket.emit("account_title_updated");
      dispatch(resetMenu());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const submitHandler = async (submitData) => {
    const obj = {
      code: submitData?.code,
      name: submitData?.name,
      id: view || update ? accountTitlesData?.id : null,
      ac_ggp_id: submitData?.ggp?.id || null,
      ac_gp_id: submitData?.gp?.id || null,
      ac_p_id: submitData?.p?.id || null,
      ac_c_id: submitData?.c?.id || null,
      ac_gc_id: submitData?.gc?.id || null,
    };

    switch (header) {
      case "Account Titles":
        return handle(obj, update ? updateAccountTitle : createAccountTitle);
      case "Great Grandparent":
        return handle(obj, update ? updateGGP : createGGP);
      case "Grandparent":
        return handle(obj, update ? updateGP : createGP);
      case "Parent":
        return handle(obj, update ? updateP : createP);
      case "Child":
        return handle(obj, update ? updateC : createC);
      case "Grandchild":
        return handle(obj, update ? updateGC : createGC);
      default:
        return;
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

        {header === "Account Titles" && (
          <Autocomplete
            loading={ggpLoading}
            control={control}
            name={"ggp"}
            options={ggpTitle?.result || []}
            getOptionLabel={(option) => `${option.code} - ${option.name} `}
            isOptionEqualToValue={(option, value) =>
              option?.code === value?.code
            }
            renderInput={(params) => (
              <MuiTextField
                name="ggp"
                {...params}
                label="Great Grandparent *"
                size="small"
                variant="outlined"
                error={Boolean(errors.ggp)}
                helperText={errors.ggp?.message}
                className="add-accountTitles-textBox-autocomplete"
              />
            )}
          />
        )}
        {header === "Account Titles" && watch("ggp") && (
          <Autocomplete
            loading={gpLoading}
            control={control}
            name={"gp"}
            options={gpTitle?.result || []}
            getOptionLabel={(option) => `${option.code} - ${option.name} `}
            isOptionEqualToValue={(option, value) =>
              option?.code === value?.code
            }
            renderInput={(params) => (
              <MuiTextField
                name="gp"
                {...params}
                label="Grandparent *"
                size="small"
                variant="outlined"
                error={Boolean(errors.gp)}
                helperText={errors.gp?.message}
                className="add-accountTitles-textBox-autocomplete"
              />
            )}
          />
        )}
        {header === "Account Titles" && watch("gp") && (
          <Autocomplete
            loading={pLoading}
            control={control}
            name={"p"}
            options={pTitle?.result || []}
            getOptionLabel={(option) => `${option.code} - ${option.name} `}
            isOptionEqualToValue={(option, value) =>
              option?.code === value?.code
            }
            renderInput={(params) => (
              <MuiTextField
                name="p"
                {...params}
                label="Parent *"
                size="small"
                variant="outlined"
                error={Boolean(errors.p)}
                helperText={errors.p?.message}
                className="add-accountTitles-textBox-autocomplete"
              />
            )}
          />
        )}

        {header === "Account Titles" && watch("p") && (
          <Autocomplete
            loading={cLoading}
            control={control}
            name={"c"}
            options={cTitle?.result || []}
            getOptionLabel={(option) => `${option.code} - ${option.name} `}
            isOptionEqualToValue={(option, value) =>
              option?.code === value?.code
            }
            renderInput={(params) => (
              <MuiTextField
                name="c"
                {...params}
                label="Child *"
                size="small"
                variant="outlined"
                error={Boolean(errors.c)}
                helperText={errors.c?.message}
                className="add-accountTitles-textBox-autocomplete"
              />
            )}
          />
        )}
        {header === "Account Titles" && watch("c") && (
          <Autocomplete
            loading={gcLoading}
            control={control}
            name={"gc"}
            options={gcTitle?.result || []}
            getOptionLabel={(option) => `${option.code} - ${option.name} `}
            isOptionEqualToValue={(option, value) =>
              option?.code === value?.code
            }
            renderInput={(params) => (
              <MuiTextField
                name="gc"
                {...params}
                label="Grandchild *"
                size="small"
                variant="outlined"
                error={Boolean(errors.gc)}
                helperText={errors.gc?.message}
                className="add-accountTitles-textBox-autocomplete"
              />
            )}
          />
        )}

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
        open={
          isLoading ||
          updateLoading ||
          ggpLoadingCreate ||
          gpLoadingCreate ||
          pLoadingCreate ||
          cLoadingCreate ||
          gcLoadingCreate
        }
        className="loading-accountTitles-create"
      >
        <Lottie animationData={loading} loop={isLoading || updateLoading} />
      </Dialog>
    </Paper>
  );
};

export default AccountTitlesModal;

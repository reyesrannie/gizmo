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

const AccountTitlesModal = ({ accountTitlesData, view, update }) => {
  const dispatch = useDispatch();
  const header =
    useSelector((state) => state.transaction.header) || "Account Titles";
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
    ggp: "",
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

    header === "Account Titles" && handleAccountTitle(obj);
    header === "Great Grandparent" && handleGGP(obj);
    header === "Grandparent" && handleGP(obj);
    header === "Parent" && handleP(obj);
    header === "Child" && handleC(obj);
    header === "Grandchild" && handleGc(obj);
  };

  const handleAccountTitle = async (obj) => {
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

  const handleGGP = async (obj) => {
    try {
      const res = update
        ? await updateGGP(obj).unwrap()
        : await createGGP(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const handleGP = async (obj) => {
    try {
      const res = update
        ? await updateGP(obj).unwrap()
        : await createGP(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const handleP = async (obj) => {
    try {
      const res = update
        ? await updateP(obj).unwrap()
        : await createP(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const handleC = async (obj) => {
    try {
      const res = update
        ? await updateC(obj).unwrap()
        : await createC(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const handleGc = async (obj) => {
    try {
      const res = update
        ? await updateGC(obj).unwrap()
        : await createGC(obj).unwrap();
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
                label="Great Grandfather *"
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
                label="Grandfather *"
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
        open={isLoading || updateLoading}
        className="loading-accountTitles-create"
      >
        <Lottie animationData={loading} loop={isLoading || updateLoading} />
      </Dialog>
    </Paper>
  );
};

export default AccountTitlesModal;

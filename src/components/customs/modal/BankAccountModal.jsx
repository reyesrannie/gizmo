import {
  Box,
  Button,
  Dialog,
  Divider,
  Paper,
  Typography,
  TextField as MuiTextField,
  Stack,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TablePagination,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
} from "@mui/material";
import React, { useEffect } from "react";

import "../../styles/AtcModal.scss";
import "../../styles/Atc.scss";
import "../../styles/TransactionModal.scss";
import "../../styles/StatusIndicator.scss";

import atc from "../../../assets/svg/atc.svg";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import noData from "../../../assets/lottie/NoData.json";

import Lottie from "lottie-react";
import EditIcon from "@mui/icons-material/Edit";

import { LoadingButton } from "@mui/lab";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {
  resetMenu,
  setCheckMenu,
  setImportMenu,
  setUpdateData,
  setUpdateImport,
} from "../../../services/slice/menuSlice";

import { useSnackbar } from "notistack";
import {
  objectError,
  singleError,
} from "../../../services/functions/errorResponse";
import Autocomplete from "../AutoComplete";

import bankSchema from "../../../schemas/bankSchema";
import moment from "moment";
import useParamsHook from "../../../services/hooks/useParamsHook";
import StatusIndicator from "../StatusIndicator";
import { useAccountTitlesQuery } from "../../../services/api/coaApi";
import {
  useArchiveBankMutation,
  useBankAccountNumberQuery,
  useBankAccountTitleQuery,
  useCreateBankAccountNumberMutation,
  useCreateBankAccountTitleMutation,
  useCreateBankMutation,
  useCreateCheckNumberMutation,
  useUpdateBankAccountNumberMutation,
  useUpdateBankAccountTitleMutation,
  useUpdateBankMutation,
} from "../../../services/api/bankApi";

const BankAccountModal = () => {
  const menuData = useSelector((state) => state.menu.menuData);
  const updateMenu = useSelector((state) => state.menu.updateMenu);
  const createMenu = useSelector((state) => state.menu.createMenu);
  const updateData = useSelector((state) => state.menu.updateData);
  const importMenu = useSelector((state) => state.menu.importMenu);
  const updateImport = useSelector((state) => state.menu.updateImport);
  const checkMenu = useSelector((state) => state.menu.checkMenu);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { params, onPageChange, onRowChange } = useParamsHook();
  const [createBal, { isLoading }] = useCreateBankMutation();
  const [updateBal, { isLoading: updateLoading }] = useUpdateBankMutation();
  const [archiveBal, { isLoading: archiveLoading }] = useArchiveBankMutation();

  const [createAccountNumber, { isLoading: createAccountNumberLoading }] =
    useCreateBankAccountNumberMutation();

  const [createCheckNumber, { isLoading: createCheckNumberLoading }] =
    useCreateCheckNumberMutation();

  const [updateAccountNumber, { isLoading: updateBankAccountLoading }] =
    useUpdateBankAccountNumberMutation();

  const [createBankTitle, { isLoading: createBankTitleLoading }] =
    useCreateBankAccountTitleMutation();

  const [updateBankTitle, { isLoading: updateBankTitleLoading }] =
    useUpdateBankAccountTitleMutation();

  const {
    data: accountTitles,
    isLoading: loadingTitles,
    isSuccess: successTitles,
  } = useAccountTitlesQuery({
    status: "active",
    pagination: "none",
  });

  const { data: bankAccountNumber } = useBankAccountNumberQuery(
    {
      status: "active",
      pagination: "none",
      bank_id: menuData?.id,
    },
    {
      skip: menuData === null,
    }
  );

  const {
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(bankSchema),
    defaultValues: {
      name: "",
      coa_id: null,
      account_number: null,
      account_no: "",
      title: null,
      type: "",
      bank_title: "",
      check_no_from: "",
      check_no_to: "",
      check_no: "",
    },
  });

  const { data: bankAccountTitle, isError } = useBankAccountTitleQuery(
    { ...params, bank_account_id: watch("account_number")?.id },
    {
      skip: !watch("account_number"),
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
      };

      Object.entries(obj).forEach(([name, value]) => setValue(name, value));
    }
  }, [menuData, successTitles]);

  const submitHandler = async (submitData) => {
    const obj = {
      ...submitData,
      id: updateMenu ? menuData?.id : null,
      coa_id: submitData?.coa_id?.id,
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

  const handleAddAccountNumber = async () => {
    const obj = {
      bank_id: menuData?.id,
      account_no: watch("account_no"),
      id: watch("account_number")?.id,
    };
    try {
      const res =
        watch("account_number")?.id === "add-new"
          ? await createAccountNumber(obj).unwrap()
          : await updateAccountNumber(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(setUpdateData(false));
      setValue("account_no", "");
      setValue("account_number", null);
      clearErrors();
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const handleAddAUpdateTitle = async () => {
    const obj = {
      bank_title: watch("bank_title"),
      bank_account_id: watch("account_number")?.id,
      id: watch("title")?.id,
    };
    try {
      const res = await updateBankTitle(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(setUpdateData(false));
      dispatch(setImportMenu(false));
      dispatch(setUpdateImport(false));
      setValue("account_no", "");
      setValue("account_number", null);
      setValue("bank_title", "");
      setValue("title", null);
      clearErrors();
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleAddCheck = async () => {
    const prenumbered = {
      bank_title: watch("bank_title"),
      bank_account_id: watch("account_number")?.id,
      type: watch("type"),
      check_no_from: watch("check_no_from"),
      check_no_to: watch("check_no_to"),
    };
    const blank = {
      bank_title: watch("bank_title"),
      bank_account_id: watch("account_number")?.id,
      type: watch("type"),
      check_no: watch("check_no"),
    };

    const prenumberedCheck = {
      bank_title_id: watch("title")?.id,
      type: watch("type"),
      check_no_from: watch("check_no_from"),
      check_no_to: watch("check_no_to"),
    };
    const blankCheck = {
      bank_title_id: watch("title")?.id,
      type: watch("type"),
      check_no: watch("check_no"),
    };

    try {
      if (checkMenu) {
        const res =
          watch("type") === "prenumbered"
            ? await createCheckNumber(prenumberedCheck).unwrap()
            : await createCheckNumber(blankCheck).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        setValue("title", null);
        dispatch(setImportMenu(false));
        dispatch(setCheckMenu(false));
      } else {
        const res =
          watch("type") === "prenumbered"
            ? await createBankTitle(prenumbered).unwrap()
            : await createBankTitle(blank).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        setValue("title", null);
        dispatch(setImportMenu(false));
      }
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleUpdateValue = () => {
    if (watch("account_number")?.id === "add-new") {
      dispatch(setUpdateData(true));
    } else {
      setValue("title", null);
      dispatch(setUpdateData(false));
      dispatch(setImportMenu(false));
    }
  };

  const handleCancelUpdate = () => {
    dispatch(setUpdateData(false));
    dispatch(setUpdateImport(false));
    dispatch(setImportMenu(false));
    dispatch(setCheckMenu(false));
    setValue("account_number", null);
    setValue("account_no", "");
    setValue("title", null);
    setValue("bank_title", "");
  };

  return (
    <Paper className="bank-modal-container">
      <img src={atc} alt="atc" className="atc-image" draggable="false" />

      <Typography className="atc-text">
        {createMenu && "Add"}
        {updateMenu && "Update"}
      </Typography>
      <Divider orientation="horizontal" className="atc-devider" />

      <form onSubmit={handleSubmit(submitHandler)}>
        <Box className="add-bank-form-container">
          <AppTextBox
            control={control}
            name={"name"}
            label={"Bank name *"}
            color="primary"
            className="add-atc-textbox bank"
            error={Boolean(errors?.name)}
            helperText={errors?.name?.message}
          />
          <Autocomplete
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
                label="Account title*"
                size="small"
                variant="outlined"
                error={Boolean(errors.coa_id)}
                helperText={errors.coa_id?.message}
                className="add-atc-textbox autocomplete"
              />
            )}
            disableClearable
          />
          {(watch("coa_id")?.id !== menuData?.coa?.id ||
            watch("name") !== menuData?.name) &&
            updateMenu && (
              <LoadingButton
                variant="contained"
                color="warning"
                type="submit"
                className="add-atc-button"
                disabled={
                  watch("name") === "" ||
                  watch("coa_id") === null ||
                  menuData?.state === "Paid"
                }
              >
                {updateMenu ? "Update" : "Add"}
              </LoadingButton>
            )}
        </Box>

        {updateMenu && (
          <Box className="add-bank-form-container">
            <Autocomplete
              control={control}
              name={"account_number"}
              options={[
                { id: "add-new", account_no: "Add Account Number" },
                ...(bankAccountNumber?.result || []),
              ]}
              getOptionLabel={(option) => `${option.account_no}`}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              onClose={() => {
                handleUpdateValue();
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

            {updateData && (
              <AppTextBox
                type="number"
                control={control}
                name={"account_no"}
                label={
                  watch("account_number")?.id === "add-new"
                    ? "New Account"
                    : "Update Account number"
                }
                color="primary"
                className="add-atc-textbox bank"
                error={Boolean(errors?.account_no)}
                helperText={errors?.account_no?.message}
              />
            )}

            {updateData && (
              <LoadingButton
                variant="contained"
                color="warning"
                onClick={() => handleAddAccountNumber()}
                className="add-atc-button"
              >
                {watch("account_number")?.id === "add-new" ? "Add" : "Update"}
              </LoadingButton>
            )}

            {watch("account_number") !== null && !updateData && (
              <IconButton
                onClick={() => {
                  dispatch(setUpdateData(true));
                  setValue("account_no", watch("account_number")?.account_no);
                }}
              >
                <EditIcon color="warning" />
              </IconButton>
            )}
          </Box>
        )}

        {updateMenu && (
          <Box className="add-bank-form-container">
            {watch("account_number")?.id !== "add-new" && (
              <Autocomplete
                control={control}
                name={"title"}
                options={
                  isError
                    ? [{ id: "add-new", bank_title: "Add new name" }]
                    : [
                        { id: "add-new", bank_title: "Add new name" },
                        ...(bankAccountTitle?.result?.data || []),
                      ]
                }
                getOptionLabel={(option) => `${option.bank_title}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                onClose={() => {
                  if (watch("title")?.id === "add-new") {
                    dispatch(setImportMenu(true));
                  } else {
                    dispatch(setImportMenu(false));
                    dispatch(setUpdateImport(false));
                  }
                }}
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
            {watch("title") !== null &&
              watch("title")?.id !== "add-new" &&
              !updateImport && (
                <IconButton
                  onClick={() => {
                    dispatch(setUpdateImport(true));
                    setValue("bank_title", watch("title")?.bank_title);
                  }}
                >
                  <EditIcon color="warning" />
                </IconButton>
              )}
            {updateImport && (
              <AppTextBox
                control={control}
                name={"bank_title"}
                label={"Update Title"}
                color="primary"
                className="add-atc-textbox bank"
                error={Boolean(errors?.bank_title)}
                helperText={errors?.bank_title?.message}
              />
            )}
            {updateImport && (
              <LoadingButton
                variant="contained"
                color="warning"
                onClick={() => handleAddAUpdateTitle()}
                className="add-atc-button"
              >
                {watch("title")?.id === "add-new" ? "Add" : "Update"}
              </LoadingButton>
            )}
          </Box>
        )}

        {importMenu && watch("account_number")?.id !== "add-new" && (
          <Stack flexDirection={"row"} gap={1}>
            <FormControl className="form-control-radio treasury">
              <Controller
                name="type"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <FormControlLabel
                      value="prenumbered"
                      control={<Radio color="secondary" size="small" />}
                      label="Pre-numbered"
                    />
                    {false && (
                      <FormControlLabel
                        value="blank"
                        control={<Radio color="secondary" size="small" />}
                        label="Blank Stock"
                      />
                    )}
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Stack>
        )}
        {importMenu && watch("account_number")?.id !== "add-new" && (
          <Box className="add-bank-form-container">
            {!checkMenu && (
              <AppTextBox
                control={control}
                name={"bank_title"}
                label={"New Title"}
                color="primary"
                className="add-atc-textbox bank"
                error={Boolean(errors?.bank_title)}
                helperText={errors?.bank_title?.message}
              />
            )}
            {watch("type") === "prenumbered" && (
              <AppTextBox
                control={control}
                name={"check_no_from"}
                label={"Start"}
                color="primary"
                className="add-atc-textbox bank"
                error={Boolean(errors?.check_no_from)}
                helperText={errors?.check_no_from?.message}
              />
            )}
            {watch("type") === "prenumbered" && (
              <AppTextBox
                control={control}
                name={"check_no_to"}
                label={"End"}
                color="primary"
                className="add-atc-textbox bank"
                error={Boolean(errors?.check_no_to)}
                helperText={errors?.check_no_to?.message}
              />
            )}
            {watch("type") === "blank" && (
              <AppTextBox
                control={control}
                name={"check_no"}
                label={"Check Number"}
                color="primary"
                className="add-atc-textbox bank"
                error={Boolean(errors?.check_no)}
                helperText={errors?.check_no?.message}
              />
            )}
            {watch("type") !== "" && (
              <LoadingButton
                variant="contained"
                color="success"
                className="add-atc-button"
                onClick={() => handleAddCheck()}
              >
                Add
              </LoadingButton>
            )}
          </Box>
        )}

        <Box className="atc-body-container">
          <TableContainer className="atc-table-container bank">
            <Table stickyHeader>
              <TableHead>
                <TableRow className="table-header1-bank">
                  <TableCell colSpan={6}>
                    {watch("account_number")?.id !== "add-new" &&
                      watch("title") &&
                      watch("title")?.id !== "add-new" &&
                      !importMenu && (
                        <Stack
                          flexDirection={"row"}
                          justifyContent={"flex-end"}
                        >
                          <Box>
                            <LoadingButton
                              variant="contained"
                              color="warning"
                              className="add-atc-button"
                              onClick={() => {
                                dispatch(setImportMenu(true));
                                dispatch(setCheckMenu(true));
                              }}
                            >
                              Add check
                            </LoadingButton>
                          </Box>
                        </Stack>
                      )}
                  </TableCell>
                </TableRow>
                {watch("title") && watch("title")?.id !== "add-new" && (
                  <TableRow className="table-header-atc">
                    <TableCell>Check No.</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Date Modified</TableCell>
                  </TableRow>
                )}
              </TableHead>

              <TableBody>
                {watch("title")?.check_numbers?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Lottie
                        animationData={noData}
                        className="no-data-atc bank"
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  watch("title")?.check_numbers?.map((comp) => (
                    <TableRow className="table-body-atc" key={comp?.id}>
                      <TableCell>{comp?.check_no}</TableCell>
                      <TableCell>
                        <Typography className="tag-transaction-company-name">
                          {comp?.supplier ? <>&mdash;</> : comp?.supplier?.name}
                        </Typography>
                        <Typography className="tag-transaction-company-tin">
                          {comp?.supplier ? <>&mdash;</> : comp?.supplier?.tin}
                        </Typography>
                      </TableCell>
                      <TableCell>{comp?.amount}</TableCell>
                      <TableCell align="center">
                        {comp?.state === "Available" && (
                          <StatusIndicator
                            status="Available"
                            className="computation-indicator"
                          />
                        )}

                        {comp?.state === "Check Approval" && (
                          <StatusIndicator
                            status="For Approval"
                            className="approval-indicator"
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {moment(comp?.updated_at).format("MMM DD YYYY")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box>
          <Stack
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            gap={10}
          >
            <Box></Box>
            {createMenu && (
              <Box>
                <Stack flexDirection={"row"} gap={1}>
                  <LoadingButton
                    variant="contained"
                    color="warning"
                    type="submit"
                    className="add-atc-button"
                    disabled={
                      watch("name") === "" ||
                      watch("coa_id") === null ||
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
                    Cancel
                  </Button>
                </Stack>
              </Box>
            )}

            {updateMenu && (
              <Box>
                <Stack flexDirection={"row"} gap={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      checkMenu || updateData
                        ? handleCancelUpdate()
                        : dispatch(resetMenu());
                    }}
                    className="add-atc-button"
                  >
                    {checkMenu || updateData ? "Cancel" : "Close"}
                  </Button>
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>
      </form>

      <Dialog
        open={
          isLoading ||
          updateLoading ||
          loadingTitles ||
          archiveLoading ||
          createAccountNumberLoading ||
          updateBankAccountLoading ||
          createBankTitleLoading ||
          createCheckNumberLoading
        }
        className="loading-atc-create"
      >
        <Lottie animationData={loading} loop />
      </Dialog>
    </Paper>
  );
};

export default BankAccountModal;

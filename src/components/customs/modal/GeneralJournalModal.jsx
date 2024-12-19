import React, { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  Divider,
  Paper,
  Typography,
  TextField as MuiTextField,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Controller, set, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {
  resetMenu,
  setHasError,
  setMenuData,
} from "../../../services/slice/menuSlice";
import { useSnackbar } from "notistack";
import { MobileDatePicker } from "@mui/x-date-pickers";

import "../../styles/TransactionModal.scss";
import "../../styles/UserModal.scss";
import "../../styles/RolesModal.scss";
import "../../styles/Modal.scss";
import "../../styles/TagTransaction.scss";

import transaction from "../../../assets/svg/transaction.svg";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Autocomplete from "../AutoComplete";
import noData from "../../../assets/lottie/NoData.json";

import dayjs from "dayjs";
import Lottie from "lottie-react";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";

import { resetTransaction } from "../../../services/slice/transactionSlice";
import { AdditionalFunction } from "../../../services/functions/AdditionalFunction";
import DateChecker from "../../../services/functions/DateChecker";
import { hasAccess, isAp } from "../../../services/functions/access";
import generalJournalSchema from "../../../schemas/generalJournalSchema";
import { objectError } from "../../../services/functions/errorResponse";
import moment from "moment";
import { useLocationQuery } from "../../../services/api/locationApi";
import { useApQuery } from "../../../services/api/apApi";
import { useSupplierQuery } from "../../../services/api/supplierApi";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ReasonInput from "../ReasonInput";
import { resetPrompt, setReturn } from "../../../services/slice/promptSlice";
import { useAccountTitlesQuery } from "../../../services/api/coaApi";
import {
  useArchiveGJItemMutation,
  useArchiveGJMutation,
  useCreateGJMutation,
  useLazySearchTagQuery,
  usePostGJMutation,
  useUpdateGjMutation,
} from "../../../services/api/generalJournalApi";
import ReactToPrint from "react-to-print";
import GJPrinting from "../GJPrinting";

const GeneralJournalModal = () => {
  const dispatch = useDispatch();
  const hasError = useSelector((state) => state.menu.hasError);
  const menuData = useSelector((state) => state.menu.menuData);
  const isReturn = useSelector((state) => state.prompt.return);
  const userData = useSelector((state) => state.auth.userData);

  const componentRef = useRef();

  const { enqueueSnackbar } = useSnackbar();
  const { minDate } = DateChecker();

  const {
    data: tin,
    isLoading: loadingTIN,
    isSuccess: successTin,
  } = useSupplierQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: coa,
    isLoading: loadingCoa,
    isSuccess: coaSuccess,
  } = useAccountTitlesQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: ap,
    isLoading: loadingAp,
    isSuccess: successAP,
  } = useApQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: location,
    isLoading: loadingLocation,
    isSuccess: successLoc,
  } = useLocationQuery({
    status: "active",
    pagination: "none",
  });

  const [
    triggerSearchTag,
    {
      data: searchedData,
      isFetching: loadingSearch,
      isSuccess: successSearch,
      isError: errorSearch,
    },
  ] = useLazySearchTagQuery();

  const [createGJ, { isLoading: loadingCreate }] = useCreateGJMutation();
  const [updateGj, { isLoading: loadingUpdate }] = useUpdateGjMutation();
  const [postGj, { isLoading: loadingPost }] = usePostGJMutation();
  const [archiveGj, { isLoading: loadingArchiveGj }] = useArchiveGJMutation();
  const [archiveGjItem, { isLoading: loadingArchiveGjItem }] =
    useArchiveGJItemMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(generalJournalSchema),
    defaultValues: {
      gj_name: "",
      gj_series: "",
      gj_description: "",
      ap_tagging_id: null,
      gj_type: null,
      tag_year: null,
      reference_no: "",
      debit: 0,
      credit: 0,
      variance: 0,

      gj_items: [
        {
          item_id: "",
          id: Date.now(),
          coa_id: null,
          debit_amount: "",
          credit_amount: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "gj_items",
  });

  useEffect(() => {
    if (menuData && successAP && successTin && successLoc && coaSuccess) {
      console.log(menuData);
      const tagMonthYear = dayjs(menuData?.tag_year, "YYMM").isValid()
        ? dayjs(menuData?.tag_year, "YYMM").toDate()
        : null;

      const obj = {
        ...menuData,
        ap_tagging_id: ap?.result?.find(
          (item) => menuData?.apTagging?.id === item?.id
        ),
        tag_year:
          dayjs(new Date(tagMonthYear), {
            locale: AdapterDayjs.locale,
          }) || null,
        gj_items: menuData?.gj_items?.map((item) => ({
          item_id: item?.id,
          id: item?.id,
          coa_id: coa?.result?.find((coa) => item?.coa?.id === coa?.id),
          debit_amount: item?.debit_amount,
          credit_amount: item?.credit_amount,
        })),
      };

      Object.entries(obj).forEach(([name, value]) => {
        setValue(name, value);
      });

      computeTotal();
    }

    if (errorSearch) {
      dispatch(setHasError(true));
    }
  }, [errorSearch, menuData, successAP, successTin, successLoc, coaSuccess]);

  useEffect(() => {
    if (successSearch) {
      const { transactions, voucher_number } = searchedData?.result;

      const obj = {
        tag_no: transactions.tag_no,
        invoice_no: transactions?.invoice_no,
        voucher_no: voucher_number,
        supplier_id: tin?.result?.find(
          (item) => transactions?.supplier?.id === item?.id
        ),
        location_id: location?.result?.find(
          (item) => transactions?.transactionTaxes[0]?.location?.id === item?.id
        ),
      };

      fields?.map((item, index) => {
        Object.entries(obj).forEach(([key, value]) => {
          setValue(`gj_items.${index}.${key}`, value);
        });
      });

      clearErrors();
    }
  }, [successSearch, fields]);

  const submitHandler = async (submitData) => {
    const obj = {
      ...submitData,
      id: menuData ? menuData?.id : "",
      ap_tagging_id: submitData?.ap_tagging_id?.id,
      tag_year: moment(new Date(submitData?.tag_year)).format("YYMM"),
      gj_items: submitData?.gj_items?.map((items) => ({
        ...items,
        coa_id: items?.coa_id?.id,

        item_id: menuData ? items?.id : "",
      })),
    };

    try {
      const res = menuData
        ? await updateGj(obj).unwrap()
        : await createGJ(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const handlePostGj = async () => {
    const submitData = getValues();
    const obj = {
      ...submitData,
      id: menuData ? menuData?.id : "",
      ap_tagging_id: submitData?.ap_tagging_id?.id,
      tag_year: moment(new Date(submitData?.tag_year)).format("YYMM"),
      gj_items: submitData?.gj_items?.map((items) => ({
        ...items,
        coa_id: items?.coa_id?.id,
        item_id: menuData ? items?.id : "",
      })),
    };

    try {
      const res = await postGj(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const handelArchiveGj = async (e) => {
    const obj = {
      reason: e?.reason,
      id: menuData?.id,
    };
    try {
      const res = await archiveGj(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const searchHandler = async (data) => {
    const obj = {
      tag: data?.target?.value,
    };

    try {
      const res = await triggerSearchTag(obj).unwrap();
    } catch (error) {}
  };

  const computeTotal = () => {
    const items = watch("gj_items") || [];

    const totalDebit = items.reduce((acc, curr) => {
      return acc + parseFloat(curr?.debit_amount || 0);
    }, 0);

    const totalCredit = items.reduce((acc, curr) => {
      return acc + parseFloat(curr?.credit_amount || 0);
    }, 0);

    const variance = Math.abs(totalDebit - totalCredit);

    variance !== 0 &&
      setError("variance", {
        message: "Variance should be 0",
        type: "validate",
      });

    const obj = {
      debit: totalDebit,
      credit: totalCredit,
      variance: Math.abs(totalDebit - totalCredit),
    };

    Object.entries(obj).forEach(([name, value]) => {
      setValue(name, value);
    });
  };

  const handleRemoveItem = async (data) => {
    const obj = {
      id: data?.item_id,
    };
    try {
      const res = await archiveGjItem(obj).unwrap();
      dispatch(
        setMenuData({
          ...menuData,
          gj_items: menuData?.gj_items?.filter((item) => obj?.id !== item?.id),
        })
      );
      remove(data?.id);
    } catch (error) {}
  };

  const gj_type = ["Adjustment", "Accrual"];

  return (
    <Paper className="transaction-modal-container gj">
      <Box className="gj-title-container">
        <img
          src={transaction}
          alt="transaction"
          className="transaction-image"
          draggable="false"
        />

        <Typography className="transaction-text">Journal Entries</Typography>
      </Box>
      <Divider orientation="horizontal" className="transaction-devider" />
      <form
        className="form-container-transaction"
        onSubmit={handleSubmit(submitHandler)}
      >
        <Box className="form-title-transaction">
          <Typography className="form-title-text-transaction">
            Journal Details
          </Typography>
        </Box>
        <AppTextBox
          disabled
          control={control}
          name={"gj_series"}
          label={"Series *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.gj_series)}
          helperText={errors?.gj_series?.message}
        />
        <AppTextBox
          disabled={menuData?.state === "Approved"}
          control={control}
          name={"gj_name"}
          label={"Journal *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.gj_name)}
          helperText={errors?.gj_name?.message}
        />

        <Autocomplete
          disabled={menuData?.state === "Approved"}
          control={control}
          name={"ap_tagging_id"}
          options={
            userData?.scope_tagging?.map((value) =>
              ap?.result?.find((item) => value?.ap_code === item?.company_code)
            ) || []
          }
          getOptionLabel={(option) =>
            `${option.company_code} - ${option.description}`
          }
          isOptionEqualToValue={(option, value) => option?.code === value?.code}
          renderInput={(params) => (
            <MuiTextField
              name="ap_tagging"
              {...params}
              label="Charge of account *"
              size="small"
              variant="outlined"
              error={Boolean(errors.ap_tagging_id)}
              helperText={errors.ap_tagging_id?.message}
              className="transaction-form-textBox"
            />
          )}
        />
        <Autocomplete
          disabled={menuData?.state === "Approved"}
          control={control}
          name={"gj_type"}
          options={gj_type || []}
          getOptionLabel={(option) => `${option}`}
          isOptionEqualToValue={(option, value) => option === value}
          renderInput={(params) => (
            <MuiTextField
              name="gj_type"
              {...params}
              label="Type *"
              size="small"
              variant="outlined"
              error={Boolean(errors.gj_type)}
              helperText={errors.gj_type?.message}
              className="transaction-form-textBox"
            />
          )}
        />

        <Controller
          name="tag_year"
          control={control}
          render={({ field: { onChange, value, ...restField } }) => (
            <Box className="date-picker-container-transaction">
              <MobileDatePicker
                disabled={menuData?.state === "Approved"}
                className="transaction-form-date"
                label="Tag year month *"
                format="MMMM YYYY"
                value={value}
                views={["month", "year"]}
                minDate={minDate}
                maxDate={dayjs().endOf("month")}
                onChange={(e) => {
                  onChange(e);
                }}
                slotProps={{
                  textField: {
                    error: Boolean(errors?.tag_year),
                    helperText: errors?.tag_year?.message,
                  },
                }}
              />
            </Box>
          )}
        />
        <AppTextBox
          disabled={menuData?.state === "Approved"}
          control={control}
          name={"reference_no"}
          label={"Reference No *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.reference_no)}
          helperText={errors?.reference_no?.message}
        />

        {hasAccess(["ap_tag"]) && (
          <AppTextBox
            disabled={menuData?.state === "Approved"}
            multiline
            minRows={1}
            control={control}
            name={"gj_description"}
            className="transaction-form-field-textBox "
            label="Description (Optional)"
            error={Boolean(errors.gj_description)}
            helperText={errors.gj_description?.message}
          />
        )}
        <Divider orientation="horizontal" className="transaction-devider" />
        <Box className="form-title-transaction">
          <Typography className="form-title-text-transaction">
            Entries
          </Typography>
        </Box>
        <Paper className="gj-paper-container details" elevation={0}>
          {fields?.map((item, index) => {
            return (
              <Paper
                key={item?.id}
                className="gj-paper-container scrollable"
                elevation={0}
              >
                <Typography>{`${index + 1}.`}</Typography>

                <Autocomplete
                  disabled={menuData?.state === "Approved"}
                  control={control}
                  name={`gj_items.${index}.coa_id`}
                  options={coa?.result || []}
                  getOptionLabel={(option) => `${option.name}`}
                  isOptionEqualToValue={(option, value) =>
                    option?.code === value?.code
                  }
                  renderInput={(params) => (
                    <MuiTextField
                      name="coa_id"
                      {...params}
                      label="Account Title *"
                      size="small"
                      variant="outlined"
                      error={Boolean(errors?.gj_items?.[index]?.coa_id)}
                      helperText={errors?.gj_items?.[index]?.coa_id?.message}
                      className="transaction-form-textBox"
                    />
                  )}
                />
                <AppTextBox
                  disabled={
                    (watch(`gj_items.${index}.credit_amount`) !== 0 &&
                      watch(`gj_items.${index}.credit_amount`) !== "") ||
                    menuData?.state === "Approved"
                  }
                  money
                  showDecimal
                  control={control}
                  name={`gj_items.${index}.debit_amount`}
                  label={"Debit *"}
                  color="primary"
                  className="transaction-form-textBox"
                  error={Boolean(errors?.gj_items?.[index]?.debit_amount)}
                  helperText={errors?.gj_items?.[index]?.debit_amount?.message}
                  onKeyUp={() => computeTotal()}
                />
                <AppTextBox
                  disabled={
                    (watch(`gj_items.${index}.debit_amount`) !== 0 &&
                      watch(`gj_items.${index}.debit_amount`) !== "") ||
                    menuData?.state === "Approved"
                  }
                  money
                  showDecimal
                  control={control}
                  name={`gj_items.${index}.credit_amount`}
                  label={"Credit *"}
                  color="primary"
                  className="transaction-form-textBox"
                  error={Boolean(errors?.gj_items?.[index]?.credit_amount)}
                  helperText={errors?.gj_items?.[index]?.credit_amount?.message}
                  onKeyUp={() => computeTotal()}
                />

                <IconButton
                  className="icon-button-gj"
                  disabled={
                    fields?.length === 1 || menuData?.state === "Approved"
                  }
                  onClick={() => {
                    menuData ? handleRemoveItem(item) : remove(index);
                  }}
                >
                  <DoNotDisturbOnOutlinedIcon
                    color={`${
                      fields?.length === 1 || menuData?.state === "Approved"
                        ? "disabled"
                        : "error"
                    }`}
                  />
                </IconButton>
              </Paper>
            );
          })}
        </Paper>
        <Divider orientation="horizontal" className="transaction-devider" />

        {menuData?.state !== "Approved" && (
          <LoadingButton
            variant="contained"
            color="secondary"
            className="add-transaction-button"
            onClick={() => {
              append({
                id: Date.now(),
                debit_coa_id: null,
                debit_coa_id: null,
                debit_amount: 0,
                credit_amount: 0,
                tag_no: "",
                invoice_no: "",
                voucher_no: "",
                supplier: "",
                location: "",
                supplier_id: null,
                location_id: null,
              });
            }}
          >
            Add New Entry
          </LoadingButton>
        )}
        <Divider orientation="horizontal" className="transaction-devider" />

        <Box className="add-transaction-button-container">
          <Stack flexDirection={"row"} gap={1}>
            <AppTextBox
              disabled
              money
              showDecimal
              control={control}
              name={"debit"}
              label={"Total Debit"}
              color="primary"
              className="transaction-form-textBox gj-balancing"
              error={Boolean(errors?.debit)}
              helperText={errors?.debit?.message}
            />
            <AppTextBox
              disabled
              money
              showDecimal
              control={control}
              name={"credit"}
              label={"Total Credit"}
              color="primary"
              className="transaction-form-textBox gj-balancing"
              error={Boolean(errors?.debit)}
              helperText={errors?.debit?.message}
            />
            <AppTextBox
              disabled
              money
              showDecimal
              control={control}
              name={"variance"}
              label={"Variance"}
              color="primary"
              className="transaction-form-textBox gj-balancing"
              error={Boolean(errors?.debit)}
              helperText={errors?.debit?.message}
            />
          </Stack>

          <Box className="archive-transaction-button-container">
            {menuData && hasAccess("gj_approver") && (
              <LoadingButton
                disabled={watch("variance") !== 0}
                variant="contained"
                color="success"
                className="add-transaction-button"
                onClick={() => handlePostGj()}
              >
                Approved
              </LoadingButton>
            )}
            {menuData && menuData?.state !== "Approved" && (
              <LoadingButton
                disabled={watch("variance") !== 0}
                variant="contained"
                color="error"
                className="add-transaction-button"
                onClick={() => dispatch(setReturn(true))}
              >
                {!hasAccess("gj_approver") ? "Archive" : "Reject"}
              </LoadingButton>
            )}

            {menuData && menuData?.state === "Approved" && (
              <ReactToPrint
                trigger={() => (
                  <LoadingButton
                    variant="contained"
                    color="success"
                    className="add-transaction-button"
                  >
                    Print
                  </LoadingButton>
                )}
                content={() => componentRef.current}
              />
            )}
            {menuData?.state !== "Approved" && !hasAccess("gj_approver") && (
              <LoadingButton
                disabled={watch("variance") !== 0}
                variant="contained"
                color="success"
                className="add-transaction-button"
                type="submit"
              >
                Save
              </LoadingButton>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                dispatch(resetMenu());
                dispatch(resetTransaction());
              }}
              className="add-transaction-button"
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </form>

      <Dialog
        open={
          loadingTIN ||
          loadingAp ||
          loadingLocation ||
          loadingSearch ||
          loadingCreate ||
          loadingCoa ||
          loadingUpdate ||
          loadingPost ||
          loadingArchiveGj ||
          loadingArchiveGjItem
        }
        className="loading-transaction-create"
      >
        <Lottie animationData={loading} loop />
      </Dialog>

      <Dialog
        onClose={() => dispatch(setHasError(false))}
        open={hasError}
        className="loading-role-create"
      >
        <Lottie animationData={noData} className="no-data-found" />
      </Dialog>

      <Dialog open={isReturn}>
        <ReasonInput
          title={"Reason for archive"}
          reasonDesc={"Please enter the reason for archive this entry"}
          warning={
            "Please note that this entry will be archived and can no longer return. Kindly provide a reason for this action."
          }
          confirmButton={"Confirm"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          confirmOnClick={(e) => handelArchiveGj(e)}
        />
      </Dialog>

      <GJPrinting ref={componentRef} />
    </Paper>
  );
};

export default GeneralJournalModal;

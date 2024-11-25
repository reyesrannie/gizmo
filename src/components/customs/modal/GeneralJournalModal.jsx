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

const GeneralJournalModal = () => {
  const dispatch = useDispatch();
  const hasError = useSelector((state) => state.menu.hasError);
  const menuData = useSelector((state) => state.menu.menuData);
  const isReturn = useSelector((state) => state.prompt.return);

  const debounceTimer = useRef(null);

  const { enqueueSnackbar } = useSnackbar();
  const { insertDocument, deepEqual } = AdditionalFunction();
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
      gj_description: "",
      ap_tagging_id: null,
      boa: "",
      tag_year: null,
      debit: 0,
      credit: 0,
      variance: 0,

      gj_items: [
        {
          item_id: "",
          id: Date.now(),
          coa_id: null,
          debit_amount: 0,
          credit_amount: 0,
          tag_no: "",
          invoice_no: "",
          voucher_no: "",
          supplier_id: null,
          location_id: null,
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
          coa_id: coa?.result?.find((coa) =>
            item?.credit_amount !== 0
              ? item?.credit_coa?.id === coa?.id
              : item?.debit_coa?.id === coa?.id
          ),
          debit_amount: item?.debit_amount,
          credit_amount: item?.credit_amount,
          tag_no: item?.tag_no,
          invoice_no: item?.invoice_no,
          voucher_no: item?.voucher_no,
          supplier_id: tin?.result?.find(
            (sup) => item?.supplier?.id === sup?.id
          ),
          location_id: location?.result?.find(
            (loc) => item?.location?.id === loc?.id
          ),
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
        debit_coa_id: items?.debit_amount !== 0 ? items?.coa_id?.id : "",
        credit_coa_id: items?.credit_amount !== 0 ? items?.coa_id?.id : "",
        supplier_id: items?.supplier_id?.id,
        location_id: items?.location_id?.id,
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
        debit_coa_id: items?.debit_amount !== 0 ? items?.coa_id?.id : "",
        credit_coa_id: items?.credit_amount !== 0 ? items?.coa_id?.id : "",
        supplier_id: items?.supplier_id?.id,
        location_id: items?.location_id?.id,
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

  const searchHandler = (data) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      const obj = {
        tag: data?.target?.value,
      };

      try {
        const res = await triggerSearchTag(obj).unwrap();
      } catch (error) {}
    }, 500);
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

  const boa = ["Adjustment", "Accrual"];

  return (
    <Paper className="transaction-modal-container gj">
      <Box className="gj-title-container">
        <img
          src={transaction}
          alt="transaction"
          className="transaction-image"
          draggable="false"
        />

        <Typography className="transaction-text">Adjusting Entry</Typography>
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
          disabled={menuData?.state === "Posted"}
          control={control}
          name={"gj_name"}
          label={"Journal *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.gj_name)}
          helperText={errors?.gj_name?.message}
        />

        <Autocomplete
          disabled={menuData?.state === "Posted"}
          control={control}
          name={"ap_tagging_id"}
          options={ap?.result || []}
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
          disabled={menuData?.state === "Posted"}
          control={control}
          name={"boa"}
          options={boa || []}
          getOptionLabel={(option) => `${option}`}
          isOptionEqualToValue={(option, value) => option === value}
          renderInput={(params) => (
            <MuiTextField
              name="boa"
              {...params}
              label="Book of accounts *"
              size="small"
              variant="outlined"
              error={Boolean(errors.boa)}
              helperText={errors.boa?.message}
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
                disabled={menuData?.state === "Posted"}
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

        {hasAccess(["ap_tag"]) && (
          <AppTextBox
            disabled={menuData?.state === "Posted"}
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
                <AppTextBox
                  disabled={menuData?.state === "Posted"}
                  control={control}
                  name={`gj_items.${index}.tag_no`}
                  label={"Tag Number *"}
                  color="primary"
                  className="transaction-form-textBox"
                  error={Boolean(errors?.gj_items?.[index]?.tag_no)}
                  helperText={errors?.gj_items?.[index]?.tag_no?.message}
                  onKeyDown={(key) => searchHandler(key)}
                />
                <Autocomplete
                  disabled={menuData?.state === "Posted"}
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
                  money
                  showDecimal
                  disabled={
                    watch(`gj_items.${index}.credit_amount`) !== 0 ||
                    menuData?.state === "Posted"
                  }
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
                  money
                  showDecimal
                  disabled={
                    watch(`gj_items.${index}.debit_amount`) !== 0 ||
                    menuData?.state === "Posted"
                  }
                  control={control}
                  name={`gj_items.${index}.credit_amount`}
                  label={"Credit *"}
                  color="primary"
                  className="transaction-form-textBox"
                  error={Boolean(errors?.gj_items?.[index]?.credit_amount)}
                  helperText={errors?.gj_items?.[index]?.credit_amount?.message}
                  onKeyUp={() => computeTotal()}
                />
                <AppTextBox
                  disabled={menuData?.state === "Posted"}
                  control={control}
                  name={`gj_items.${index}.invoice_no`}
                  label={"Invoice Number *"}
                  color="primary"
                  className="transaction-form-textBox"
                  error={Boolean(errors?.gj_items?.[index]?.invoice_no)}
                  helperText={errors?.gj_items?.[index]?.invoice_no?.message}
                />
                <AppTextBox
                  disabled={menuData?.state === "Posted"}
                  control={control}
                  name={`gj_items.${index}.voucher_no`}
                  label={"Voucher Number *"}
                  color="primary"
                  className="transaction-form-textBox"
                  error={Boolean(errors?.gj_items?.[index]?.voucher_no)}
                  helperText={errors?.gj_items?.[index]?.voucher_no?.message}
                />
                <Autocomplete
                  disabled={menuData?.state === "Posted"}
                  control={control}
                  name={`gj_items.${index}.supplier_id`}
                  options={tin?.result || []}
                  getOptionLabel={(option) =>
                    `${option.company_name} - ${option.tin}`
                  }
                  isOptionEqualToValue={(option, value) =>
                    option?.code === value?.code
                  }
                  renderInput={(params) => (
                    <MuiTextField
                      name="supplier_id"
                      {...params}
                      label="Supplier *"
                      size="small"
                      variant="outlined"
                      error={Boolean(errors?.gj_items?.[index]?.supplier_id)}
                      helperText={
                        errors?.gj_items?.[index]?.supplier_id?.message
                      }
                      className="transaction-form-textBox"
                    />
                  )}
                />
                <Autocomplete
                  disabled={menuData?.state === "Posted"}
                  control={control}
                  name={`gj_items.${index}.location_id`}
                  options={location?.result || []}
                  getOptionLabel={(option) => `${option.name}`}
                  isOptionEqualToValue={(option, value) =>
                    option?.code === value?.code
                  }
                  renderInput={(params) => (
                    <MuiTextField
                      name="location_id"
                      {...params}
                      label="Location *"
                      size="small"
                      variant="outlined"
                      error={Boolean(errors?.gj_items?.[index]?.location_id)}
                      helperText={
                        errors?.gj_items?.[index]?.location_id?.message
                      }
                      className="transaction-form-textBox"
                    />
                  )}
                />
                <IconButton
                  className="icon-button-gj"
                  disabled={
                    fields?.length === 1 || menuData?.state === "Posted"
                  }
                  onClick={() => {
                    menuData ? handleRemoveItem(item) : remove(index);
                  }}
                >
                  <DoNotDisturbOnOutlinedIcon
                    color={`${
                      fields?.length === 1 || menuData?.state === "Posted"
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

        {menuData?.state !== "Posted" && (
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
            {menuData && menuData?.state !== "Posted" && (
              <LoadingButton
                disabled={watch("variance") !== 0}
                variant="contained"
                color="secondary"
                className="add-transaction-button"
                onClick={() => handlePostGj()}
              >
                Post
              </LoadingButton>
            )}
            {menuData && menuData?.state === "Posted" && (
              <LoadingButton
                disabled={watch("variance") !== 0}
                variant="contained"
                color="error"
                className="add-transaction-button"
                onClick={() => dispatch(setReturn(true))}
              >
                Archive
              </LoadingButton>
            )}
            {menuData?.state !== "Posted" && (
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
    </Paper>
  );
};

export default GeneralJournalModal;

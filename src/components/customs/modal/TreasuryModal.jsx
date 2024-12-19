import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField as MuiTextField,
  Button,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";

import "../../styles/Modal.scss";
import "../../styles/TransactionModalApprover.scss";

import { useDispatch, useSelector } from "react-redux";
import { jsonServerAPI } from "../../../services/store/request";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import Lottie from "lottie-react";
import loading from "../../../assets/lottie/Loading-2.json";
import {
  totalAccount,
  totalAmountCheck,
  totalAmountCheckForm,
} from "../../../services/functions/compute";
import { setVoucherData } from "../../../services/slice/transactionSlice";
import { AdditionalFunction } from "../../../services/functions/AdditionalFunction";
import Autocomplete from "../AutoComplete";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import treasurySchema from "../../../schemas/treasurySchema";
import moment from "moment";
import AppTextBox from "../AppTextBox";
import { DatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import ReactToPrint from "react-to-print";
import {
  resetMenu,
  setBankData,
  setCheckID,
  setCreateMenu,
  setReceiveMenu,
  setUpdateData,
  setUpdateMenu,
  setViewAccountingEntries,
} from "../../../services/slice/menuSlice";
import { resetOption } from "../../../services/slice/optionsSlice";

import { enqueueSnackbar } from "notistack";
import {
  resetPrompt,
  setIsContinue,
  setOpenVoid,
  setReceive,
  setReturn,
} from "../../../services/slice/promptSlice";
import { singleError } from "../../../services/functions/errorResponse";
import ClearCheck from "../ClearCheck";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ReasonInput from "../ReasonInput";
import TransactionDrawer from "../TransactionDrawer";

import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import SelectBankMenu from "../SelectBankMenu";
import { useAccountTitlesQuery } from "../../../services/api/coaApi";
import {
  useReturnCheckEntriesMutation,
  useVoidCVoucherMutation,
} from "../../../services/api/vouchersPayableApi";
import {
  useClearCVoucherMutation,
  useForApprovalCVoucherMutation,
  usePrintCVoucherMutation,
  useReleaseCVoucherMutation,
  useReleasedCVoucherMutation,
  useUpdateCheckDateMutation,
} from "../../../services/api/checkVoucherApi";
import AppPrompt from "../AppPrompt";

import receiveImg from "../../../assets/svg/receive.svg";
import { useTaxComputationQuery } from "../../../services/api/taxComputationApi";
import { useVoidCheckNumberMutation } from "../../../services/api/bankApi";
import { hasAccess } from "../../../services/functions/access";
import { setClearChecks } from "../../../services/slice/syncSlice";

const TreasuryModal = () => {
  const componentRef = useRef();
  const hasRun = useRef(false);
  const dispatch = useDispatch();
  const [anchorE1, setAnchorE1] = useState(null);
  const menuDataMultiple = useSelector((state) => state.menu.menuDataMultiple);
  const isReceive = useSelector((state) => state.prompt.receive);
  const voucherData = useSelector((state) => state.transaction.voucherData);
  const receiveMenu = useSelector((state) => state.menu.receiveMenu);
  const taxData = useSelector((state) => state.menu.taxData);
  const updateMenu = useSelector((state) => state.menu.updateMenu);
  const isReturn = useSelector((state) => state.prompt.return);
  const updateData = useSelector((state) => state.menu.updateData);
  const bankData = useSelector((state) => state.menu.bankData);
  const checkID = useSelector((state) => state.menu.checkID);
  const openVoid = useSelector((state) => state.prompt.openVoid);
  const isContinue = useSelector((state) => state.prompt.isContinue);

  const hasCancelled = menuDataMultiple[0]?.treasuryChecks?.some(
    (item) => item?.state === "Cancelled"
  );

  const { convertToPeso } = AdditionalFunction();

  const {
    data: accountTitles,
    isLoading: loadingTitles,
    isSuccess: successTitles,
  } = useAccountTitlesQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: taxComputation,
    isLoading: loadingTax,
    isSuccess: taxSuccess,
  } = useTaxComputationQuery(
    {
      status: "active",
      transaction_id: menuDataMultiple?.map((tags) => tags?.transactions?.id),
      voucher: "check",
      pagination: "none",
    },
    { skip: menuDataMultiple?.length === 0 }
  );

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(treasurySchema),
    defaultValues: {
      debit_coa_id: null,
      credit_coa_id: null,
      type: "CHECK VOUCHER",
      check: [
        {
          id: Date.now(),
          check_no: "",
          bank: "",
          reference_no: "",
          amount: 0,
          check_no: null,
          check_date: dayjs(new Date(), {
            locale: AdapterDayjs.locale,
          }),
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "check",
  });

  useEffect(() => {
    if (
      fields?.length > 0 &&
      bankData?.length > 0 &&
      watch("type") === "CHECK VOUCHER"
    ) {
      const usedCheckNumbers = new Set();

      fields.forEach((item, index) => {
        const availableCheckNo = bankData[index]?.check_no?.find(
          (check) => !usedCheckNumbers.has(check)
        );

        if (availableCheckNo !== undefined) {
          usedCheckNumbers.add(availableCheckNo);

          const obj = {
            ...bankData?.[index],
            check_no: availableCheckNo,
          };

          Object.entries(obj).forEach(([key, value]) => {
            setValue(`check.${index}.${key}`, value);
          });
        }
      });
    }
    if (
      fields?.length > 0 &&
      bankData?.length > 0 &&
      watch("type") !== "CHECK VOUCHER"
    ) {
      fields.forEach((item, index) => {
        Object.entries(bankData[index] || []).forEach(([key, value]) => {
          setValue(`check.${index}.${key}`, value);
        });
      });
    }
  }, [fields, bankData, setValue]);

  const [releaseVoucher, { isLoading: releaseLoading }] =
    useReleaseCVoucherMutation();

  const [releasedVoucher, { isLoading: releasedLoading }] =
    useReleasedCVoucherMutation();

  const [updateCheckDate, { isLoading: checkDateLoading }] =
    useUpdateCheckDateMutation();

  const [clearVoucher, { isLoading: clearLoading }] =
    useClearCVoucherMutation();

  const [returnCheckEntry, { isLoading: loadingReturn }] =
    useReturnCheckEntriesMutation();

  const [printCVoucher, { isLoading: loadingPrint }] =
    usePrintCVoucherMutation();

  const [voidCheckNumber, { isLoading: loadingVoid }] =
    useVoidCheckNumberMutation();

  const [voidCVoucher, { isLoading: loadingVoidCV }] =
    useVoidCVoucherMutation();

  const [approveCheckVoucher, { isLoading: loadingApprove }] =
    useForApprovalCVoucherMutation();

  useEffect(() => {
    if (taxSuccess || successTitles || !hasRun.current) {
      const amount = totalAccount(taxComputation);
      const {
        transactions,
        state,
        preparedBy,
        check_approved_by,
        check_approved_date,
        treasuryChecks,
        debitCoa,
        creditCoa,
        is_print,
      } = menuDataMultiple?.[0] || {};

      dispatch(
        setVoucherData({
          treasuryChecks: treasuryChecks || [],
          debitCoa: debitCoa,
          creditCoa: creditCoa,
          preparedBy: preparedBy,
          approvedBy: check_approved_by,
          state: state,
          date_invoice: transactions?.date_invoice,
          date_approved: check_approved_date || null,
          amount: amount,
          description: transactions?.description,
          supplier: transactions?.supplier?.name,
          transactions: transactions,
          is_print: is_print,
        })
      );

      const credit = Array.isArray(bankData)
        ? bankData[0]?.credit_coa_id?.code
        : creditCoa?.code;

      const obj = {
        debit_coa_id: accountTitles?.result?.find(
          (item) => item.code === "211100"
        ),
        credit_coa_id: accountTitles?.result?.find(
          (item) => item.code === credit
        ),
      };

      Object.entries(obj).forEach(([key, value]) => {
        setValue(key, value);
      });
      hasRun.current = true;
    }
    if (taxData !== null) {
      const items = {
        check_no: menuDataMultiple?.treasuryChecks[0]?.check_no,
        check_date:
          dayjs(new Date(menuDataMultiple?.treasuryChecks[0]?.check_date), {
            locale: AdapterDayjs.locale,
          }) || null,
        bank: accountTitles?.result?.find(
          (item) =>
            menuDataMultiple?.treasuryChecks[0]?.coa?.code === item?.code
        ),
        type: voucherData?.state === "Released" ? "Clearing" : "none",
      };
      Object.entries(items).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
    if (!Array.isArray(bankData) && watch("type") === "CHECK VOUCHER") {
      const obj = {
        ...bankData,
        check_no: bankData?.check_no[0],
      };

      Object.entries(obj).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
    if (Array.isArray(bankData) && watch("type") !== "CHECK VOUCHER") {
      const obj = {
        ...bankData,
      };

      Object.entries(obj).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [taxData, taxSuccess, successTitles, hasRun, bankData]);

  const submitHandler = async (submitData) => {
    const obj = {
      check_ids: menuDataMultiple?.map((items) => items.id),
      debit_coa_id: submitData?.debit_coa_id?.id,
      credit_coa_id: submitData?.credit_coa_id?.id,
      treasury_type: submitData?.type === "CHECK VOUCHER" ? "cv" : "dm",
      treasury_checks: submitData?.check?.map((items) => {
        return {
          check_no_id: items.check_no?.id,
          amount: items.amount,
          check_date: items?.check_date
            ? moment(items?.check_date).format("YYYY-MM-DD")
            : null,
        };
      }),
    };

    try {
      if (submitData?.type === "CHECK VOUCHER") {
        const res = await releaseVoucher(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        dispatch(jsonServerAPI?.util?.invalidateTags(["BankAccountTitle"]));
      }
      if (submitData?.type === "DEBIT MEMO") {
        const dm = {
          ...obj,
          treasury_checks: [],
          debit_memos: submitData?.check?.map((items) => {
            return {
              bank_id: items?.bank_id,
              reference_no: items?.reference_no,
              amount: items.amount,
              dm_date: items?.check_date
                ? moment(items?.check_date).format("YYYY-MM-DD")
                : null,
            };
          }),
        };

        const res = await releaseVoucher(dm).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
      }
      dispatch(jsonServerAPI?.util?.invalidateTags(["CheckNumber"]));
      dispatch(setClearChecks(true));
      dispatch(resetPrompt());
      dispatch(resetMenu());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleReleaseVoucher = async () => {
    const obj = {
      id: menuDataMultiple[0]?.id,
    };

    try {
      const res = await releasedVoucher(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleCheckAmount = (e, index) => {
    const totalAmount = parseFloat(totalAmountCheck(watch("check"))).toFixed(2);
    const maxAmount = parseFloat(voucherData?.amount).toFixed(2);

    if (parseFloat(totalAmount) > parseFloat(maxAmount)) {
      setError(`check.${index}.amount`, {
        type: "validate",
        message: "Exceeded Maximum Amount",
      });
    } else {
      clearErrors(`check.${index}.amount`);
    }
  };

  const handleReturn = async (reason) => {
    const obj = {
      id: menuDataMultiple[0]?.id,
      ...reason,
    };
    try {
      const res =
        voucherData?.state === "For Preparation"
          ? await voidCVoucher(obj).unwrap()
          : await returnCheckEntry(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetPrompt());
      dispatch(resetMenu());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleApproveVoucher = async () => {
    const obj = {
      id: menuDataMultiple[0]?.id,
    };
    try {
      const res = await approveCheckVoucher(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetPrompt());
      dispatch(resetMenu());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handlePrint = async () => {
    const obj = {
      id: menuDataMultiple[0]?.id,
    };
    try {
      const res = await printCVoucher(obj).unwrap();
      dispatch(setVoucherData({ ...voucherData, is_print: 1 }));
      dispatch(resetOption());
    } catch (error) {}
  };

  const handleUpdateCheckDate = async () => {
    const obj = {
      id: checkID,
      check_date: moment(new Date(watch("check_date"))).format("YYYY-MM-DD"),
    };
    const updatedDate = {
      ...menuDataMultiple[0],
      treasuryChecks: voucherData?.treasuryChecks?.map((check) => {
        if (checkID === check?.id) {
          return {
            ...check,
            check_date: obj?.check_date,
          };
        } else return check;
      }),
    };

    try {
      const res = await updateCheckDate(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(setVoucherData(updatedDate));
      dispatch(setCheckID(""));
      dispatch(setUpdateData(false));
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleCancelCheck = async (reason) => {
    const obj = {
      id: checkID,
      ...reason,
    };
    try {
      const res = await voidCheckNumber(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetPrompt());
      dispatch(resetMenu());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleClearVoucher = async () => {
    const obj = {
      id: menuDataMultiple[0]?.id,
    };
    try {
      const res = await clearVoucher(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleConfirmPrint = () => {
    dispatch(setReceive(false)); // Close the dialog
    setTimeout(() => {
      document.getElementById("triggerPrintButton")?.click();
    }, 0); // Trigger the hidden ReactToPrint button
  };

  const handleClearData = () => {
    fields?.map((_, index) => {
      setValue(`check.${index}.check_no`, null);
      setValue(`check.${index}.bank`, "");
      setValue(`check.${index}.reference_no`, "");
    });
    dispatch(setBankData([]));
  };

  const disableSubmit = () => {
    const validate =
      watch("check")?.some(
        (items) =>
          items?.bank === "" || items?.check_no === null || items?.amount === 0
      ) ||
      parseFloat(totalAmountCheckForm(watch("check"))).toFixed(2) !==
        parseFloat(voucherData?.amount).toFixed(2);
    return validate;
  };

  return (
    <Paper className="transaction-modal-container">
      {menuDataMultiple?.map((menu, index) => (
        <Stack
          key={index}
          alignSelf={"flex-start"}
          flexDirection={"row"}
          gap={2}
        >
          <Typography className="transaction-text supplier-voucher">
            {menu?.transactions?.supplier?.name}
          </Typography>
          <Typography className="transaction-text supplier-voucher">
            {`Amount: ${convertToPeso(parseFloat(menu?.amount).toFixed(2))}`}
          </Typography>
        </Stack>
      ))}
      <form onSubmit={handleSubmit(submitHandler)}>
        <Box ref={componentRef}>
          <TableContainer className="table-container-for-print-treasury">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    align="center"
                    className="voucher-treasury name"
                  >
                    <Typography>RDF FEED, LIVESTOCK & FOODS, INC.</Typography>
                  </TableCell>
                  <TableCell
                    colSpan={4}
                    align="center"
                    className="voucher-treasury header"
                  >
                    <Typography>PAYMENT VOUCHER</Typography>
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    align="left"
                    className="voucher-treasury name"
                  >
                    <Typography className="name-supplier-typo-treasury supplier">
                      SUPPLIERS
                    </Typography>
                    <Typography
                      className="name-supplier-typo-treasury name"
                      align="center"
                      sx={{
                        fontSize: `${
                          voucherData?.supplier_name?.length <= 40 ? 14 : 12
                        }px`,
                      }}
                    >
                      {voucherData?.supplier}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell
                    align="center"
                    className="voucher-treasury highlight"
                  >
                    <Typography>Date</Typography>
                  </TableCell>
                  <TableCell
                    colSpan={6}
                    align="center"
                    className="voucher-treasury highlight"
                  >
                    <Typography>PAYMENT DETAILS</Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    className="voucher-treasury highlight"
                  >
                    <Typography className="payee-typo-treasury">
                      Amount
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell align="center" className="voucher-treasury left">
                    <Typography>
                      {moment(voucherData?.date_invoice).format("MM/DD/YYYY")}
                    </Typography>
                  </TableCell>
                  <TableCell
                    colSpan={6}
                    align="center"
                    className="voucher-treasury details"
                  >
                    <Typography>{`${voucherData?.description?.slice(
                      0,
                      200
                    )}...`}</Typography>
                  </TableCell>
                  <TableCell align="center" className="voucher-treasury right">
                    <Typography className="payee-typo-treasury">
                      {convertToPeso(
                        parseFloat(voucherData?.amount).toFixed(2)
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
                {voucherData?.state !== "For Preparation" && (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      align="center"
                      className="voucher-treasury highlight"
                    >
                      <Typography>Check Number</Typography>
                    </TableCell>
                    <TableCell
                      colSpan={2}
                      align="center"
                      className="voucher-treasury highlight"
                    >
                      <Typography>Bank</Typography>
                    </TableCell>
                    <TableCell
                      colSpan={2}
                      align="center"
                      className="voucher-treasury highlight"
                    >
                      <Typography>Amount</Typography>
                    </TableCell>
                    <TableCell
                      colSpan={2}
                      align="center"
                      className="voucher-treasury highlight"
                    >
                      <Typography>Check Date</Typography>
                    </TableCell>
                  </TableRow>
                )}

                {voucherData?.state === "For Preparation" && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      align="center"
                      className="voucher-treasury highlight"
                    >
                      <Typography>Check Details</Typography>
                    </TableCell>
                  </TableRow>
                )}

                {voucherData?.state === "For Preparation" &&
                  fields?.map((item, index) => {
                    return (
                      <TableRow key={item?.id}>
                        <TableCell
                          colSpan={8}
                          align="right"
                          className="voucher-treasury content"
                        >
                          <Stack
                            flexDirection={"row"}
                            alignItems={"center"}
                            justifyContent={"space-around"}
                          >
                            <AppTextBox
                              control={control}
                              name={`check.${index}.bank`}
                              label={"Bank"}
                              color="primary"
                              className="transaction-tax-textBox treasury-array"
                              error={Boolean(
                                errors?.check?.[index]?.bank ||
                                  errors?.check?.root
                              )}
                              helperText={
                                errors?.check?.[index]?.bank?.message ||
                                errors?.check?.root?.message
                              }
                              variant="filled"
                              onClick={() => dispatch(setUpdateMenu(true))}
                            />

                            {watch("type") !== "CHECK VOUCHER" ? (
                              <AppTextBox
                                control={control}
                                name={`check.${index}.reference_no`}
                                label={"Bank Ref#"}
                                color="primary"
                                className="transaction-tax-textBox treasury-array"
                                error={Boolean(
                                  errors?.check?.[index]?.reference_no
                                )}
                                helperText={
                                  errors?.check?.[index]?.reference_no?.message
                                }
                                variant="filled"
                              />
                            ) : (
                              <Autocomplete
                                disabled
                                control={control}
                                name={`check.${index}.check_no`}
                                options={
                                  bankData
                                    ? bankData[index]?.check_no || []
                                    : []
                                }
                                getOptionLabel={(option) =>
                                  `${option.check_no}`
                                }
                                getOptionDisabled={(option) => {
                                  return watch("check")?.some(
                                    (checks) =>
                                      checks.check_no?.id === option.id
                                  );
                                }}
                                isOptionEqualToValue={(option, value) =>
                                  option?.id === value?.id
                                }
                                renderInput={(params) => (
                                  <MuiTextField
                                    name="check_no"
                                    {...params}
                                    label="Check Number*"
                                    size="small"
                                    variant="filled"
                                    error={Boolean(
                                      errors?.check?.[index]?.check_no
                                    )}
                                    helperText={
                                      errors?.check?.[index]?.check_no?.message
                                    }
                                    className="transaction-tax-textBox treasury-array"
                                  />
                                )}
                                disableClearable
                              />
                            )}

                            <AppTextBox
                              showDecimal
                              money
                              disabled={
                                parseFloat(
                                  totalAmountCheckForm(watch("check"))
                                ).toFixed(2) ===
                                  parseFloat(voucherData?.amount).toFixed(2) &&
                                watch(`check.${index}.amount`) === 0
                              }
                              control={control}
                              name={`check.${index}.amount`}
                              label={"Amount"}
                              color="primary"
                              className="transaction-tax-textBox treasury-array"
                              error={Boolean(errors?.check?.[index]?.amount)}
                              helperText={
                                errors?.check?.[index]?.amount?.message
                              }
                              variant="filled"
                              onKeyUp={(e) => handleCheckAmount(e, index)}
                            />

                            <Controller
                              name={`check.${index}.check_date`}
                              control={control}
                              render={({
                                field: { onChange, value, ...restField },
                              }) => (
                                <Box className="date-picker-container treasury">
                                  <DatePicker
                                    className="transaction-form-date treasury-array"
                                    label="Check Date *"
                                    format="MM/DD/YYYY"
                                    value={value}
                                    onChange={(e) => {
                                      onChange(e);
                                    }}
                                    slotProps={{
                                      textField: {
                                        variant: "filled",
                                        error: Boolean(
                                          errors?.check?.[index]?.check_date
                                        ),
                                        helperText:
                                          errors?.check?.[index]?.check_date
                                            ?.message,
                                      },
                                    }}
                                  />
                                </Box>
                              )}
                            />
                            <IconButton
                              disabled={fields?.length === 1}
                              onClick={() => {
                                remove(index);

                                if (bankData?.length !== 0) {
                                  const updatedBankData = [...bankData];
                                  updatedBankData.splice(index, 1);
                                  dispatch(setBankData(updatedBankData));
                                }

                                setTimeout(() => {
                                  if (fields?.length === 1) {
                                    dispatch(setCreateMenu(false));
                                    setValue("multiple", false);
                                  }
                                }, 0);
                              }}
                            >
                              <DoNotDisturbOnOutlinedIcon
                                color={
                                  fields?.length === 1 ? "disabled" : "error"
                                }
                              />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                {voucherData?.state !== "For Preparation" &&
                  voucherData?.treasuryChecks?.map((item, index) => {
                    return (
                      <Tooltip
                        key={index}
                        title={
                          <Typography className="form-title-text-note">
                            The status of this check is{" "}
                            {item?.state === "Cancelled" ? "Void" : "Available"}
                          </Typography>
                        }
                        arrow
                        color="secondary"
                      >
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            className="voucher-treasury content"
                          >
                            <Typography
                              className="check-item-typography"
                              color={
                                item?.state === "Cancelled" ? "error" : "unset"
                              }
                            >
                              {item?.check_no}
                            </Typography>
                          </TableCell>
                          <TableCell
                            colSpan={2}
                            className="voucher-treasury content"
                          >
                            <Typography
                              className="check-item-typography"
                              color={
                                item?.state === "Cancelled" ? "error" : "unset"
                              }
                            >
                              {item?.bank_title?.bank_account?.bank?.name}
                            </Typography>
                          </TableCell>
                          <TableCell
                            colSpan={2}
                            align="right"
                            className="voucher-treasury content"
                          >
                            <Typography
                              className="check-item-typography"
                              color={
                                item?.state === "Cancelled" ? "error" : "unset"
                              }
                            >
                              {convertToPeso(
                                parseFloat(item?.amount).toFixed(2)
                              )}
                            </Typography>
                          </TableCell>

                          <TableCell
                            className="voucher-treasury content"
                            align="center"
                            colSpan={2}
                          >
                            <Stack
                              flexDirection={"row"}
                              justifyContent={"center"}
                              alignItems={"center"}
                            >
                              <Typography
                                className="check-item-typography"
                                color={
                                  item?.state === "Cancelled"
                                    ? "error"
                                    : "unset"
                                }
                              >
                                {item?.check_date
                                  ? moment(item?.check_date).format(
                                      "MM/DD/YYYY"
                                    )
                                  : "-"}
                              </Typography>

                              {voucherData?.state !== "Check Approval" && (
                                <IconButton
                                  disabled={
                                    item?.state === "Cancelled" ||
                                    voucherData?.state === "Released" ||
                                    voucherData?.is_print === 1
                                  }
                                  size="small"
                                  onClick={(e) => {
                                    dispatch(setCheckID(item?.id));
                                    setAnchorE1(e.currentTarget);
                                  }}
                                >
                                  <DriveFileRenameOutlineOutlinedIcon className="treasury-edit-icon" />
                                </IconButton>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      </Tooltip>
                    );
                  })}
                {voucherData?.state !== "For Preparation" && (
                  <TableRow>
                    <TableCell className="voucher-treasury empty-left" />
                    <TableCell className="voucher-treasury empty" />
                    <TableCell className="voucher-treasury empty" />
                    <TableCell className="voucher-treasury empty" />
                    <TableCell className="voucher-treasury empty" />
                    <TableCell className="voucher-treasury empty" />
                    <TableCell className="voucher-treasury empty" />
                    <TableCell className="voucher-treasury empty-right" />
                  </TableRow>
                )}
                {voucherData?.state === "For Preparation" && (
                  <TableRow>
                    <TableCell className="voucher-treasury empty-left" />
                    <TableCell className="voucher-treasury empty" />
                    <TableCell
                      align="center"
                      colSpan={4}
                      className="voucher-treasury empty"
                    >
                      <Button
                        startIcon={<AddCircleOutlineRoundedIcon />}
                        size="small"
                        color="secondary"
                        variant="contained"
                        className="add-transaction-button"
                        onClick={() =>
                          append({
                            id: Date.now(),
                            check_no: "",
                            bank: "",
                            reference_no: "",
                            amount: 0,
                            check_no: null,
                            check_date: dayjs(new Date(), {
                              locale: AdapterDayjs.locale,
                            }),
                          })
                        }
                      >
                        Add check
                      </Button>
                    </TableCell>
                    <TableCell className="voucher-treasury empty" />
                    <TableCell className="voucher-treasury empty-right" />
                  </TableRow>
                )}

                <TableRow>
                  <TableCell
                    colSpan={2}
                    align="left"
                    className="voucher-treasury content"
                  >
                    <Typography>Approved By: </Typography>
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    align="left"
                    className="voucher-treasury content"
                  >
                    <Typography>{`Prepared By: ${
                      voucherData?.preparedBy?.first_name
                        ? voucherData?.preparedBy?.first_name
                        : ""
                    } ${
                      voucherData?.preparedBy?.last_name
                        ? voucherData?.preparedBy?.last_name
                        : ""
                    }`}</Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    className="voucher-treasury content"
                  >
                    <Typography>Date</Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    className="voucher-treasury content"
                  >
                    <Typography>
                      {moment(new Date()).format("MM/DD/YYYY")}
                    </Typography>
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    rowSpan={3}
                    align="center"
                    className="voucher-treasury content"
                  ></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    colSpan={2}
                    align="left"
                    className="voucher-treasury content"
                  >
                    <Typography>{`${
                      voucherData?.approvedBy?.first_name
                        ? voucherData?.approvedBy?.first_name
                        : ""
                    } ${
                      voucherData?.approvedBy?.last_name
                        ? voucherData?.approvedBy?.last_name
                        : ""
                    }`}</Typography>
                  </TableCell>
                  <TableCell
                    colSpan={4}
                    align="left"
                    className="voucher-treasury content"
                  >
                    <Stack flexDirection={"row"} gap={1}>
                      <Typography>VP. No. :</Typography>
                      <Typography>
                        {menuDataMultiple?.map(
                          (menu) => `${menu?.voucher_number} / `
                        )}
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    colSpan={2}
                    align="left"
                    className="voucher-treasury content"
                  >
                    <Typography>
                      {`Date Approved : ${
                        voucherData?.date_approved === null
                          ? ""
                          : moment(voucherData?.date_approved).format(
                              "MM/DD/YYYY"
                            )
                      }`}
                    </Typography>
                  </TableCell>
                  <TableCell
                    colSpan={6}
                    align="left"
                    className="voucher-treasury content"
                  >
                    <Stack flexDirection={"row"} gap={1}>
                      <Typography>Amount:</Typography>
                      <Typography>
                        {convertToPeso(
                          parseFloat(voucherData?.amount).toFixed(2)
                        )}
                      </Typography>
                      {parseFloat(totalAmountCheckForm(watch("check"))).toFixed(
                        2
                      ) !== parseFloat(voucherData?.amount).toFixed(2) &&
                        voucherData?.state === "For Preparation" && (
                          <Typography color="error">
                            {`(Variance: ${convertToPeso(
                              parseFloat(
                                voucherData?.amount -
                                  totalAmountCheckForm(watch("check"))
                              ).toFixed(2)
                            )})`}
                          </Typography>
                        )}
                    </Stack>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    colSpan={2}
                    align="left"
                    className="voucher-treasury content"
                  >
                    <Stack flexDirection={"row"} gap={1}>
                      <Typography>Tag #:</Typography>
                      <Typography>
                        {` ${menuDataMultiple?.map(
                          (menu) => `${menu?.transactions?.tag_no} / `
                        )}`}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell
                    colSpan={4}
                    align="left"
                    className="voucher-treasury content"
                  >
                    <Stack flexDirection={"row"} gap={1}>
                      <Typography>Ref #:</Typography>
                      <Typography>
                        {` ${menuDataMultiple?.map(
                          (menu) =>
                            `${menu?.transactions?.documentType?.code} -  ${menu?.transactions?.invoice_no} / `
                        )}`}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    align="center"
                    className="voucher-treasury footer"
                  >
                    <Typography>Payment Received By:</Typography>
                    <Typography>(Signature Over Printed Name)</Typography>
                  </TableCell>
                </TableRow>

                {voucherData?.state === "For Preparation" && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      align="left"
                      className="voucher-treasury content"
                    >
                      <Stack flexDirection={"row"} gap={1}>
                        <FormControl className="form-control-radio treasury">
                          <FormLabel>Type: </FormLabel>
                          <Controller
                            name="type"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <RadioGroup {...field}>
                                <FormControlLabel
                                  value="CHECK VOUCHER"
                                  control={
                                    <Radio color="secondary" size="small" />
                                  }
                                  label="Regular Voucher"
                                  onChange={handleClearData}
                                />

                                <FormControlLabel
                                  value="MANAGER'S CHECK"
                                  control={
                                    <Radio color="secondary" size="small" />
                                  }
                                  label="Manager's Check"
                                  onChange={handleClearData}
                                />

                                <FormControlLabel
                                  value="DEBIT MEMO"
                                  control={
                                    <Radio color="secondary" size="small" />
                                  }
                                  label="Debit Memo"
                                  onChange={handleClearData}
                                />
                              </RadioGroup>
                            )}
                          />
                        </FormControl>
                      </Stack>
                      {errors.type && (
                        <FormHelperText sx={{ color: "#d32f2f" }}>
                          {errors.type.message}
                        </FormHelperText>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Menu
          anchorEl={anchorE1}
          open={Boolean(anchorE1)}
          onClose={() => {
            setAnchorE1(null);
          }}
        >
          <MenuItem
            onClick={() => {
              dispatch(setUpdateData(true));
              setAnchorE1(null);
            }}
          >
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <Typography className="supplier-menu-text">
              Update check date
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatch(setOpenVoid(true));
              setAnchorE1(null);
            }}
          >
            <ListItemIcon>
              <RemoveCircleOutlineOutlinedIcon color="error" />
            </ListItemIcon>
            <Typography className="supplier-menu-text">Void check</Typography>
          </MenuItem>
        </Menu>

        <Box className="add-transaction-button-container">
          <Box className="return-receive-container">
            {!hasCancelled &&
              voucherData?.state === "For Releasing" &&
              !hasAccess("tagging") && (
                <Button
                  variant="contained"
                  color="warning"
                  className="add-transaction-button"
                  onClick={() => dispatch(setIsContinue(true))}
                >
                  Print Voucher
                </Button>
              )}

            {!hasCancelled &&
              voucherData?.state === "For Releasing" &&
              hasAccess("tagging") && (
                <Button
                  variant="contained"
                  color="success"
                  className="add-transaction-button"
                  onClick={() => handleReleaseVoucher()}
                >
                  Release
                </Button>
              )}

            {voucherData?.state === "Released" && (
              <Button
                variant="contained"
                color="success"
                className="add-transaction-button"
                onClick={() => handleClearVoucher()}
              >
                Clear
              </Button>
            )}
            {(voucherData?.state === "For Preparation" ||
              (hasCancelled && voucherData?.state === "For Releasing")) && (
              <Button
                variant="contained"
                color="error"
                className="add-transaction-button"
                onClick={() => dispatch(setReturn(true))}
              >
                {voucherData?.state === "For Preparation" ? "Void" : "Return"}
              </Button>
            )}
          </Box>
          <Box className="archive-transaction-button-container">
            {!hasCancelled &&
              (voucherData?.state === "For Preparation" ||
                voucherData?.state === "For Clearing") && (
                <Button
                  disabled={disableSubmit()}
                  variant="contained"
                  color="success"
                  type="submit"
                  className="add-transaction-button"
                >
                  Submit
                </Button>
              )}

            {!hasCancelled && voucherData?.state === "Check Approval" && (
              <Button
                variant="contained"
                color="success"
                className="add-transaction-button"
                onClick={() => handleApproveVoucher()}
              >
                Approve
              </Button>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                dispatch(jsonServerAPI?.util?.invalidateTags(["CheckNumber"]));
                dispatch(resetMenu());
                dispatch(resetOption());
                dispatch(setViewAccountingEntries(false));
              }}
              className="add-transaction-button"
            >
              Close
            </Button>
            <ReactToPrint
              trigger={() => (
                <button id="triggerPrintButton" style={{ display: "none" }} />
              )}
              onAfterPrint={handlePrint}
              content={() => componentRef.current}
            />
          </Box>
        </Box>
      </form>
      <Dialog
        open={
          loadingTax ||
          loadingTitles ||
          releaseLoading ||
          clearLoading ||
          releasedLoading ||
          loadingReturn ||
          loadingPrint ||
          checkDateLoading ||
          loadingVoid ||
          loadingApprove ||
          loadingVoidCV
        }
        className="loading-transaction-create"
      >
        <Lottie animationData={loading} loop />
      </Dialog>

      <Dialog open={updateData} onClose={() => dispatch(setUpdateData(false))}>
        <MobileDatePicker
          className="transaction-form-check-date"
          label="Check Date *"
          format="MM/DD/YYYY"
          onChange={(e) => {
            setValue("check_date", e);
          }}
          onAccept={() => handleUpdateCheckDate()}
          slotProps={{
            textField: {
              variant: "filled",
              error: Boolean(errors?.check_date),
              helperText: errors?.check_date?.message,
            },
          }}
        />
      </Dialog>

      <Dialog open={isReturn}>
        <ReasonInput
          title={`${
            voucherData?.state === "For Preparation"
              ? "Reason for void"
              : "Reason for return"
          }`}
          reasonDesc={"Please enter the reason for returning this entry"}
          warning={`Please note that this entry will be ${
            voucherData?.state === "For Preparation"
              ? "forward to approver"
              : "return to preparation"
          }  for further processing. Kindly provide a reason for this action.`}
          confirmButton={"Confirm"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          confirmOnClick={(e) => handleReturn(e)}
        />
      </Dialog>

      <Dialog open={openVoid}>
        <ReasonInput
          title={"Reason for void"}
          reasonDesc={"Please enter the reason for voding this check"}
          warning={
            "Please note that this check will be void and can no longer be reused."
          }
          confirmButton={"Confirm"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          confirmOnClick={(e) => handleCancelCheck(e)}
        />
      </Dialog>

      <Dialog
        open={receiveMenu}
        onClose={() => dispatch(setReceiveMenu(false))}
      >
        <ClearCheck />
      </Dialog>

      <Dialog open={updateMenu} onClose={() => dispatch(setUpdateMenu(false))}>
        <SelectBankMenu type={watch("type")} />
      </Dialog>

      <Dialog open={isReceive} onClose={() => dispatch(setReceive(false))}>
        <AppPrompt
          image={receiveImg}
          title={"Print this voucher?"}
          message={"You are about to print this voucher"}
          nextLineMessage={"Please confirm if you changed the check date"}
          confirmButton={"Yes, Print it!"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          confirmOnClick={() => handleConfirmPrint()}
        />
      </Dialog>

      <Dialog open={isContinue} onClose={() => dispatch(setIsContinue(false))}>
        <AppPrompt
          image={receiveImg}
          title={"Confirm correct details?"}
          nextLineMessage={"Please confirm if all details are correct"}
          confirmButton={"Yes, Confirmed!"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          confirmOnClick={() => {
            dispatch(setReceive(true));
            dispatch(setIsContinue(false));
          }}
        />
      </Dialog>

      <TransactionDrawer transactionData={voucherData?.transactions} />
    </Paper>
  );
};

export default TreasuryModal;

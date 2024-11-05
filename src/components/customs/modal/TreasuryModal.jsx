import React, { useEffect, useRef } from "react";
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
} from "@mui/material";

import "../../styles/Modal.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  jsonServerAPI,
  useAccountTitlesQuery,
  useClearCVoucherMutation,
  useLazyCheckNumberQuery,
  useReleaseCVoucherMutation,
  useReleasedCVoucherMutation,
  useTaxComputationQuery,
  useVoidCVoucherMutation,
} from "../../../services/store/request";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import Lottie from "lottie-react";
import loading from "../../../assets/lottie/Loading-2.json";
import {
  totalAccount,
  totalAccountMapping,
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
import { DatePicker } from "@mui/x-date-pickers";
import ReactToPrint from "react-to-print";
import {
  resetMenu,
  setCreateMenu,
  setReceiveMenu,
  setUpdateCount,
  setViewAccountingEntries,
} from "../../../services/slice/menuSlice";
import { resetOption } from "../../../services/slice/optionsSlice";

import { enqueueSnackbar } from "notistack";
import { resetPrompt, setReturn } from "../../../services/slice/promptSlice";
import { singleError } from "../../../services/functions/errorResponse";
import ClearCheck from "../ClearCheck";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { hasAccess } from "../../../services/functions/access";
import ReasonInput from "../ReasonInput";
import TransactionDrawer from "../TransactionDrawer";
import { debitType } from "../../../services/constants/headers";
import { setClearChecks } from "../../../services/slice/syncSlice";

const TreasuryModal = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const menuDataMultiple = useSelector((state) => state.menu.menuDataMultiple);
  const voucherData = useSelector((state) => state.transaction.voucherData);
  const receiveMenu = useSelector((state) => state.menu.receiveMenu);
  const taxData = useSelector((state) => state.menu.taxData);
  const updateCount = useSelector((state) => state.menu.updateCount);
  const createMenu = useSelector((state) => state.menu.createMenu);
  const isReturn = useSelector((state) => state.prompt.return);

  const { convertToPeso } = AdditionalFunction();

  const {
    data: accountTitles,
    isLoading: loadingTitles,
    isSuccess: successTitles,
  } = useAccountTitlesQuery({
    status: "active",
    pagination: "none",
  });

  const [
    triggerSearchCheckNumber,
    {
      data: searchedData,
      isFetching: loadingSearch,
      isSuccess: successSearch,
      isError: errorSearch,
    },
  ] = useLazyCheckNumberQuery();

  const {
    data: taxComputation,
    isLoading: loadingTax,
    isSuccess: taxSuccess,
  } = useTaxComputationQuery(
    {
      status: "active",
      transaction_id:
        menuDataMultiple?.length !== 0
          ? menuDataMultiple?.map((tags) => tags?.transactions?.id)
          : menuData?.transactions?.id,
      voucher: "check",
      pagination: "none",
    },
    { skip: menuData === null && menuDataMultiple?.length === 0 }
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
      multiple: false,
      debit_coa_id: null,
      credit_coa_id: null,
      debit_type: null,
      bank: null,
      check_no: null,
      check_date: dayjs(new Date(), {
        locale: AdapterDayjs.locale,
      }),
      type: "CHECK VOUCHER",
      check: [
        {
          id: Date.now(),
          check_no: null,
          debit_type: null,
          bank: null,
          amount: 0,
          check_date: dayjs(new Date(), {
            locale: AdapterDayjs.locale,
          }),
        },
      ],
    },
  });

  useEffect(() => {
    if (
      successTitles &&
      (menuData?.state === "For Preparation" ||
        menuDataMultiple[0]?.state === "For Preparation")
    ) {
      const obj = {
        debit_coa_id: accountTitles?.result?.find(
          (item) => item.code === "211100"
        ),
      };

      Object.entries(obj).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [successTitles]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "check",
  });

  const [releaseVoucher, { isLoading: releaseLoading }] =
    useReleaseCVoucherMutation();

  const [releasedVoucher, { isLoading: releasedLoading }] =
    useReleasedCVoucherMutation();

  const [clearVoucher, { isLoading: clearLoading }] =
    useClearCVoucherMutation();

  const [voidedCVoucher, { isLoading: loadingReturn }] =
    useVoidCVoucherMutation();

  useEffect(() => {
    if (taxSuccess || successTitles) {
      const amount = totalAccount(taxComputation);

      dispatch(
        setVoucherData({
          amount: amount,
          description: menuData?.transactions?.description,
          supplier: menuData?.transactions?.supplier?.name,
        })
      );
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
        type: menuData?.state === "Released" ? "Clearing" : "none",
      };
      Object.entries(items).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [taxData, taxSuccess]);

  const submitHandler = async (submitData) => {
    const obj = {
      check_ids:
        menuDataMultiple?.length === 0
          ? [menuData?.id]
          : menuDataMultiple?.map((items) => items.id),
      debit_coa_id: submitData?.debit_coa_id?.id,
      credit_coa_id: submitData?.credit_coa_id?.id,
      treasury_type: submitData?.type === "CHECK VOUCHER" ? "cv" : "dm",
      treasury_checks: watch("multiple")
        ? submitData?.check?.map((items) => {
            return {
              check_no_id: items.check_no?.id,
              coa_id: submitData?.bank?.id,
              amount: items.amount,
              check_date: items?.check_date
                ? moment(items?.check_date).format("YYYY-MM-DD")
                : null,
            };
          })
        : [
            {
              coa_id: submitData?.bank?.id,
              check_no_id: submitData?.check_no?.id,
              amount: voucherData?.amount,
              check_date: moment(submitData?.check_date).format("YYYY-MM-DD"),
            },
          ],
    };

    try {
      if (submitData?.type === "CHECK VOUCHER") {
        const res = await releaseVoucher(obj).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
      }
      if (submitData?.type === "Clearing") {
        const forClearing = {
          ...taxData,
          id:
            menuDataMultiple?.length === 0
              ? menuData?.id
              : menuDataMultiple?.map((items) => items.id),
          clearing_debit_id: obj?.debit_coa_id,
          clearing_credit_id: obj?.credit_coa_id,
        };
        const res = await clearVoucher(forClearing).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
      }
      if (submitData?.type === "DEBIT MEMO") {
        const dm = {
          ...obj,
          treasury_checks: [],
          debit_memos: watch("multiple")
            ? submitData?.check?.map((items) => {
                return {
                  bank_id: items?.bank?.id,
                  dm_type: items?.debit_type?.value, // dm,mc,telegraphic or cm
                  amount: items.amount,
                  check_no_id: items.check_no?.id,
                  dm_date: items?.check_date
                    ? moment(items?.check_date).format("YYYY-MM-DD")
                    : null,
                };
              })
            : [
                {
                  bank_id: submitData?.bank?.id,
                  dm_type: submitData?.debit_type?.value, // dm,mc,telegraphic or cm
                  amount: voucherData?.amount,
                  dm_date: moment(submitData?.check_date).format("YYYY-MM-DD"),
                },
              ],
        };

        const res = await releaseVoucher(dm).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
      }
      dispatch(jsonServerAPI?.util?.invalidateTags(["CheckNumber"]));
      dispatch(setClearChecks(true));
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleReleaseVoucher = async () => {
    const obj = {
      check_ids: [menuData?.id],
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
      id: menuData?.id,
      ...reason,
    };
    try {
      const res = await voidedCVoucher(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetPrompt());
      dispatch(resetMenu());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleGetCheckNo = async () => {
    const bank = watch("bank");
    fields?.map((item, index) => setValue(`check.${index}.check_no`, null));
    if (bank) {
      const obj = {
        state: "Available",
        pagination: "none",
        coa_id: bank.id,
      };
      try {
        const res = await triggerSearchCheckNumber(obj).unwrap();
        setValue("check_no", null);
      } catch (error) {}
    }
  };

  return (
    <Paper className="transaction-modal-container">
      <form onSubmit={handleSubmit(submitHandler)}>
        {menuDataMultiple?.length !== 0 ? (
          menuDataMultiple?.map((items, index) => {
            const voucherAmount = totalAccountMapping(taxComputation, items);
            return (
              <Accordion
                elevation={1}
                key={index}
                expanded={updateCount === index}
                onChange={() => dispatch(setUpdateCount(index))}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack flexDirection={"row"} gap={5}>
                    <Typography
                      className="name-supplier-typo-treasury name"
                      align="center"
                      sx={{
                        fontSize: `${
                          items?.supplier_name?.length <= 40 ? 14 : 12
                        }px`,
                      }}
                    >
                      {items?.transactions?.supplier?.name}
                    </Typography>
                    <Typography
                      className="name-supplier-typo-treasury name"
                      align="center"
                      sx={{
                        fontSize: `${
                          items?.supplier_name?.length <= 40 ? 14 : 12
                        }px`,
                      }}
                    >
                      {convertToPeso(parseFloat(voucherAmount).toFixed(2))}
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer
                    ref={componentRef}
                    className="table-container-for-print-treasury"
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            align="center"
                            className="voucher-treasury name"
                          >
                            <Typography>
                              RDF FEED, LIVESTOCK & FOODS, INC.
                            </Typography>
                          </TableCell>
                          <TableCell
                            colSpan={4}
                            align="center"
                            className="voucher-treasury header"
                          >
                            {items?.state === "For Preparation" ? (
                              <Typography>{watch("type")}</Typography>
                            ) : (
                              <Typography>CHECK VOUCHER</Typography>
                            )}
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
                                  items?.supplier_name?.length <= 40 ? 14 : 12
                                }px`,
                              }}
                            >
                              {items?.transactions?.supplier?.name}
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
                          <TableCell
                            align="center"
                            className="voucher-treasury left"
                          >
                            <Typography>
                              {moment(items?.transactions?.date_invoice).format(
                                "MM/DD/YYYY"
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell
                            colSpan={6}
                            align="center"
                            className="voucher-treasury details"
                          >
                            <Typography>
                              {items?.transactions?.description?.length > 200
                                ? `${items?.transactions?.description?.substring(
                                    0,
                                    150
                                  )}...`
                                : items?.transactions?.description}
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="center"
                            className="voucher-treasury right"
                          >
                            <Typography className="payee-typo-treasury">
                              {convertToPeso(
                                parseFloat(voucherAmount).toFixed(2)
                              )}
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            align="center"
                            className="voucher-treasury highlight"
                          >
                            <Typography>Account Title</Typography>
                          </TableCell>
                          <TableCell
                            align="center"
                            className="voucher-treasury highlight"
                          >
                            <Typography>ACCT.CODE</Typography>
                          </TableCell>
                          <TableCell
                            align="center"
                            className="voucher-treasury highlight"
                          >
                            <Typography>DEBIT</Typography>
                          </TableCell>
                          <TableCell
                            align="center"
                            className="voucher-treasury highlight"
                          >
                            <Typography>CREDIT</Typography>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell
                            colSpan={2}
                            className="voucher-treasury left"
                            align="right"
                          >
                            {menuData?.debitCoa ? (
                              <Typography>
                                {menuData?.debitCoa?.name}{" "}
                              </Typography>
                            ) : (
                              <Autocomplete
                                control={control}
                                name={"debit_coa_id"}
                                options={accountTitles?.result || []}
                                getOptionLabel={(option) => `${option.name}`}
                                isOptionEqualToValue={(option, value) =>
                                  option?.id === value?.id
                                }
                                renderInput={(params) => (
                                  <MuiTextField
                                    name="debit_coa_id"
                                    {...params}
                                    label="Entry*"
                                    size="small"
                                    variant="filled"
                                    error={Boolean(errors.debit_coa_id)}
                                    helperText={errors.debit_coa_id?.message}
                                    className="transaction-form-textBox treasury"
                                  />
                                )}
                                disableClearable
                              />
                            )}
                          </TableCell>
                          <TableCell
                            colSpan={2}
                            className="voucher-treasury center"
                          ></TableCell>
                          <TableCell className="voucher-treasury right"></TableCell>

                          <TableCell
                            className="voucher-treasury center"
                            align="center"
                          >
                            <Typography>
                              {watch("debit_coa_id")
                                ? watch("debit_coa_id")?.code
                                : menuData?.debitCoa
                                ? menuData?.debitCoa?.code
                                : "-"}
                            </Typography>
                          </TableCell>
                          <TableCell
                            className="voucher-treasury content"
                            align="right"
                          >
                            <Typography>
                              {convertToPeso(
                                parseFloat(voucherAmount).toFixed(2)
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell
                            className="voucher-treasury"
                            align="right"
                          ></TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell
                            colSpan={2}
                            className="voucher-treasury left"
                          ></TableCell>
                          <TableCell
                            colSpan={2}
                            className="voucher-treasury center"
                          >
                            {menuData?.creditCoa ? (
                              <Typography>
                                {menuData?.creditCoa?.name}
                              </Typography>
                            ) : (
                              <Autocomplete
                                control={control}
                                name={"credit_coa_id"}
                                options={
                                  accountTitles?.result?.filter((coa) =>
                                    coa?.name?.startsWith("CIB")
                                  ) || []
                                }
                                getOptionLabel={(option) => `${option.name}`}
                                isOptionEqualToValue={(option, value) =>
                                  option?.id === value?.id
                                }
                                onClose={() => {
                                  setValue("bank", watch("credit_coa_id"));
                                  handleGetCheckNo();
                                }}
                                renderInput={(params) => (
                                  <MuiTextField
                                    name="credit_coa_id"
                                    {...params}
                                    label="Entry*"
                                    size="small"
                                    variant="filled"
                                    error={Boolean(errors.credit_coa_id)}
                                    helperText={errors.credit_coa_id?.message}
                                    className="transaction-form-textBox treasury"
                                  />
                                )}
                                disableClearable
                              />
                            )}
                          </TableCell>

                          <TableCell className="voucher-treasury center"></TableCell>
                          <TableCell
                            className="voucher-treasury content"
                            align="center"
                          >
                            <Typography>
                              {watch("credit_coa_id")
                                ? watch("credit_coa_id")?.code
                                : menuData?.creditCoa
                                ? menuData?.creditCoa?.code
                                : "-"}
                            </Typography>
                          </TableCell>
                          <TableCell className="voucher-treasury"></TableCell>
                          <TableCell className="voucher-treasury content">
                            <Typography align="right">
                              {convertToPeso(
                                parseFloat(voucherAmount).toFixed(2)
                              )}
                            </Typography>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell className="voucher-treasury empty-left"></TableCell>
                          <TableCell className="voucher-treasury empty"></TableCell>
                          <TableCell className="voucher-treasury empty"></TableCell>
                          <TableCell className="voucher-treasury empty"></TableCell>
                          <TableCell className="voucher-treasury empty"></TableCell>
                          <TableCell className="voucher-treasury empty"></TableCell>
                          <TableCell className="voucher-treasury empty"></TableCell>
                          <TableCell className="voucher-treasury empty-right"></TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell
                            colSpan={2}
                            align="left"
                            className="voucher-treasury content"
                          >
                            {items?.state !== "For Preparation" ? (
                              <Typography>
                                {`Bank: ${
                                  items?.treasuryCheck?.coa?.name
                                    ? items?.treasuryCheck?.coa?.name
                                    : ""
                                }`}
                              </Typography>
                            ) : (
                              <Autocomplete
                                control={control}
                                name={"bank"}
                                options={
                                  accountTitles?.result?.filter((coa) =>
                                    coa?.name?.startsWith("CIB")
                                  ) || []
                                }
                                getOptionLabel={(option) => `${option.name}`}
                                isOptionEqualToValue={(option, value) =>
                                  option?.id === value?.id
                                }
                                onClose={() => {
                                  setValue("credit_coa_id", watch("bank"));
                                  handleGetCheckNo();
                                }}
                                renderInput={(params) => (
                                  <MuiTextField
                                    name="bank"
                                    {...params}
                                    label="Bank*"
                                    size="small"
                                    variant="filled"
                                    error={Boolean(errors.bank)}
                                    helperText={errors.bank?.message}
                                    className="transaction-form-textBox treasury"
                                  />
                                )}
                                disableClearable
                              />
                            )}
                          </TableCell>
                          <TableCell
                            colSpan={2}
                            align="left"
                            className="voucher-treasury content"
                          >
                            <Typography>{`Prepared By: ${
                              menuData?.preparedBy?.first_name
                                ? menuData?.preparedBy?.first_name
                                : ""
                            } ${
                              menuData?.preparedBy?.last_name
                                ? menuData?.preparedBy?.last_name
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
                            {items?.state !== "For Preparation" ? (
                              <Typography>{`Check No. : ${
                                items?.treasuryCheck?.check_no
                                  ? items?.treasuryCheck?.check_no
                                  : ""
                              }`}</Typography>
                            ) : watch("type") === "DEBIT MEMO" ? (
                              <Autocomplete
                                control={control}
                                name={"debit_type"}
                                loading={loadingSearch}
                                options={debitType || []}
                                getOptionLabel={(option) => `${option?.name}`}
                                isOptionEqualToValue={(option, value) =>
                                  option.value === value.value
                                }
                                renderInput={(params) => (
                                  <MuiTextField
                                    name="bank"
                                    {...params}
                                    label="Debit Type*"
                                    size="small"
                                    variant="filled"
                                    error={Boolean(errors.debit_type)}
                                    helperText={errors.debit_type?.message}
                                    className="transaction-form-textBox treasury"
                                  />
                                )}
                                disableClearable
                              />
                            ) : (
                              <Autocomplete
                                control={control}
                                name={"check_no"}
                                loading={loadingSearch}
                                options={searchedData?.result || []}
                                getOptionLabel={(option) =>
                                  `${option.check_no}`
                                }
                                isOptionEqualToValue={(option, value) =>
                                  option?.id === value?.id
                                }
                                renderInput={(params) => (
                                  <MuiTextField
                                    name="bank"
                                    {...params}
                                    label="Check Number*"
                                    size="small"
                                    variant="filled"
                                    error={Boolean(errors.check_no)}
                                    helperText={errors.check_no?.message}
                                    className="transaction-form-textBox treasury"
                                  />
                                )}
                                disableClearable
                              />
                            )}
                          </TableCell>
                          <TableCell
                            colSpan={5}
                            align="left"
                            className="voucher-treasury content"
                          >
                            <Stack flexDirection={"row"} gap={1}>
                              <Typography>VP. No. :</Typography>
                              <Typography>{items?.voucher_number}</Typography>
                            </Stack>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell
                            colSpan={2}
                            align="left"
                            className="voucher-treasury content"
                          >
                            {items?.state !== "For Preparation" ? (
                              <Typography>{`Check Date : ${
                                items?.treasuryCheck?.check_date
                                  ? moment(
                                      items?.treasuryCheck?.check_date
                                    ).format("MM/DD/YYYY")
                                  : ""
                              }`}</Typography>
                            ) : (
                              <Controller
                                name="check_date"
                                control={control}
                                render={({
                                  field: { onChange, value, ...restField },
                                }) => (
                                  <Box className="date-picker-container treasury">
                                    <DatePicker
                                      className="transaction-form-date treasury"
                                      label="Check Date *"
                                      format="MM/DD/YYYY"
                                      value={value}
                                      onChange={(e) => {
                                        onChange(e);
                                      }}
                                      slotProps={{
                                        textField: {
                                          variant: "filled",
                                          error: Boolean(errors?.check_date),
                                          helperText:
                                            errors?.check_date?.message,
                                        },
                                      }}
                                    />
                                  </Box>
                                )}
                              />
                            )}
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
                                  parseFloat(voucherAmount).toFixed(2)
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
                            <Stack flexDirection={"row"} gap={1}>
                              <Typography>Tag #:</Typography>
                              <Typography>
                                {`${items?.transactions?.tag_year} - ${items?.transactions?.tag_no}`}
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
                                {`${items?.transactions?.documentType?.code} - ${items?.transactions?.invoice_no}`}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell
                            colSpan={2}
                            align="center"
                            className="voucher-treasury footer"
                          >
                            <Typography>Payment Received By:</Typography>
                            <Typography>
                              (Signature Over Printed Name)
                            </Typography>
                          </TableCell>
                        </TableRow>

                        {items?.state === "For Preparation" && (
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
                                            <Radio
                                              color="secondary"
                                              size="small"
                                            />
                                          }
                                          label="Check Voucher"
                                          onChange={() => {
                                            setValue("check_no", null);
                                            setValue("debit_type", null);
                                          }}
                                        />
                                        <FormControlLabel
                                          value="DEBIT MEMO"
                                          control={
                                            <Radio
                                              color="secondary"
                                              size="small"
                                            />
                                          }
                                          label="Debit Memo"
                                          onChange={() => {
                                            setValue("check_no", null);
                                            setValue("debit_type", null);
                                          }}
                                        />
                                        {/* <FormControlLabel
                                          value="OFFSET"
                                          control={
                                            <Radio
                                              color="secondary"
                                              size="small"
                                            />
                                          }
                                          label="Offset"
                                        /> */}
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
                </AccordionDetails>
              </Accordion>
            );
          })
        ) : (
          <TableContainer
            ref={componentRef}
            className="table-container-for-print-treasury"
          >
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
                    {menuData?.state === "For Preparation" ? (
                      <Typography>{watch("type")}</Typography>
                    ) : (
                      <Typography>CHECK VOUCHER</Typography>
                    )}
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
                      {moment(menuData?.transactions?.date_invoice).format(
                        "MM/DD/YYYY"
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell
                    colSpan={6}
                    align="center"
                    className="voucher-treasury details"
                  >
                    <Typography>
                      {voucherData?.description?.length > 200
                        ? `${voucherData?.description?.substring(0, 150)}...`
                        : voucherData?.description}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" className="voucher-treasury right">
                    <Typography className="payee-typo-treasury">
                      {convertToPeso(
                        parseFloat(voucherData?.amount).toFixed(2)
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    className="voucher-treasury highlight"
                  >
                    <Typography>Account Title</Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    className="voucher-treasury highlight"
                  >
                    <Typography>ACCT.CODE</Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    className="voucher-treasury highlight"
                  >
                    <Typography>DEBIT</Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    className="voucher-treasury highlight"
                  >
                    <Typography>CREDIT</Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="voucher-treasury left"
                    align="right"
                  >
                    {taxData === null && menuData?.debitCoa ? (
                      <Typography> {menuData?.debitCoa?.name} </Typography>
                    ) : (
                      <Autocomplete
                        control={control}
                        name={"debit_coa_id"}
                        options={accountTitles?.result || []}
                        getOptionLabel={(option) => `${option.name}`}
                        isOptionEqualToValue={(option, value) =>
                          option?.id === value?.id
                        }
                        renderInput={(params) => (
                          <MuiTextField
                            name="debit_coa_id"
                            {...params}
                            label="Entry*"
                            size="small"
                            variant="filled"
                            error={Boolean(errors.debit_coa_id)}
                            helperText={errors.debit_coa_id?.message}
                            className="transaction-form-textBox treasury"
                          />
                        )}
                        disableClearable
                      />
                    )}
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    className="voucher-treasury center"
                  ></TableCell>
                  <TableCell className="voucher-treasury right"></TableCell>

                  <TableCell className="voucher-treasury center" align="center">
                    <Typography>
                      {watch("debit_coa_id")
                        ? watch("debit_coa_id")?.code
                        : menuData?.debitCoa
                        ? menuData?.debitCoa?.code
                        : "-"}
                    </Typography>
                  </TableCell>
                  <TableCell className="voucher-treasury content" align="right">
                    <Typography>
                      {convertToPeso(
                        parseFloat(voucherData?.amount).toFixed(2)
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell
                    className="voucher-treasury"
                    align="right"
                  ></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="voucher-treasury left"
                  ></TableCell>
                  <TableCell colSpan={2} className="voucher-treasury center">
                    {taxData === null && menuData?.creditCoa ? (
                      <Typography>{menuData?.creditCoa?.name}</Typography>
                    ) : (
                      <Autocomplete
                        control={control}
                        name={"credit_coa_id"}
                        options={
                          accountTitles?.result?.filter((coa) =>
                            coa?.name?.startsWith("CIB")
                          ) || []
                        }
                        getOptionLabel={(option) => `${option.name}`}
                        isOptionEqualToValue={(option, value) =>
                          option?.id === value?.id
                        }
                        onClose={() => {
                          setValue("bank", watch("credit_coa_id"));
                          setValue("check_no", null);
                          handleGetCheckNo();
                        }}
                        renderInput={(params) => (
                          <MuiTextField
                            name="credit_coa_id"
                            {...params}
                            label="Entry*"
                            size="small"
                            variant="filled"
                            error={Boolean(errors.credit_coa_id)}
                            helperText={errors.credit_coa_id?.message}
                            className="transaction-form-textBox treasury"
                          />
                        )}
                        disableClearable
                      />
                    )}
                  </TableCell>

                  <TableCell className="voucher-treasury center"></TableCell>
                  <TableCell
                    className="voucher-treasury content"
                    align="center"
                  >
                    <Typography>
                      {watch("credit_coa_id")
                        ? watch("credit_coa_id")?.code
                        : menuData?.creditCoa
                        ? menuData?.creditCoa?.code
                        : "-"}
                    </Typography>
                  </TableCell>
                  <TableCell className="voucher-treasury"></TableCell>
                  <TableCell className="voucher-treasury content">
                    <Typography align="right">
                      {convertToPeso(
                        parseFloat(voucherData?.amount).toFixed(2)
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="voucher-treasury empty-left"></TableCell>
                  <TableCell className="voucher-treasury empty"></TableCell>
                  <TableCell className="voucher-treasury empty"></TableCell>
                  <TableCell className="voucher-treasury empty"></TableCell>
                  <TableCell className="voucher-treasury empty"></TableCell>
                  <TableCell className="voucher-treasury empty"></TableCell>
                  <TableCell className="voucher-treasury empty"></TableCell>
                  <TableCell className="voucher-treasury empty-right"></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    colSpan={2}
                    align="left"
                    className="voucher-treasury content"
                  >
                    {createMenu || menuData?.state !== "For Preparation" ? (
                      <Typography>
                        {`Bank: ${
                          menuData?.treasuryChecks[0]?.coa?.name
                            ? menuData?.treasuryChecks[0]?.coa?.name
                            : ""
                        }`}
                      </Typography>
                    ) : (
                      <Autocomplete
                        control={control}
                        name={"bank"}
                        options={
                          accountTitles?.result?.filter((coa) =>
                            coa?.name?.startsWith("CIB")
                          ) || []
                        }
                        getOptionLabel={(option) => `${option.name}`}
                        isOptionEqualToValue={(option, value) =>
                          option?.id === value?.id
                        }
                        onClose={() => {
                          setValue("credit_coa_id", watch("bank"));
                          setValue("check_no", null);
                          handleGetCheckNo();
                        }}
                        renderInput={(params) => (
                          <MuiTextField
                            name="bank"
                            {...params}
                            label="Bank*"
                            size="small"
                            variant="filled"
                            error={Boolean(errors.bank)}
                            helperText={errors.bank?.message}
                            className="transaction-form-textBox treasury"
                          />
                        )}
                        disableClearable
                      />
                    )}
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    align="left"
                    className="voucher-treasury content"
                  >
                    <Typography>{`Prepared By: ${
                      menuData?.preparedBy?.first_name
                        ? menuData?.preparedBy?.first_name
                        : ""
                    } ${
                      menuData?.preparedBy?.last_name
                        ? menuData?.preparedBy?.last_name
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
                    {createMenu || menuData?.state !== "For Preparation" ? (
                      <Typography>{`Check No. : ${
                        menuData?.treasuryChecks[0]?.check_no
                          ? menuData?.treasuryChecks[0]?.check_no
                          : ""
                      }`}</Typography>
                    ) : watch("type") === "DEBIT MEMO" ? (
                      <Autocomplete
                        control={control}
                        name={"debit_type"}
                        loading={loadingSearch}
                        options={debitType || []}
                        getOptionLabel={(option) => `${option?.name}`}
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                        renderInput={(params) => (
                          <MuiTextField
                            name="bank"
                            {...params}
                            label="Debit Type*"
                            size="small"
                            variant="filled"
                            error={Boolean(errors.debit_type)}
                            helperText={errors.debit_type?.message}
                            className="transaction-form-textBox treasury"
                          />
                        )}
                        disableClearable
                      />
                    ) : (
                      <Autocomplete
                        control={control}
                        name={"check_no"}
                        options={searchedData?.result || []}
                        getOptionLabel={(option) => `${option.check_no}`}
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
                            error={Boolean(errors.check_no)}
                            helperText={errors.check_no?.message}
                            className="transaction-form-textBox treasury"
                          />
                        )}
                        disableClearable
                      />
                    )}
                  </TableCell>
                  <TableCell
                    colSpan={5}
                    align="left"
                    className="voucher-treasury content"
                  >
                    <Stack flexDirection={"row"} gap={1}>
                      <Typography>VP. No. :</Typography>
                      <Typography>{menuData?.voucher_number}</Typography>
                    </Stack>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    colSpan={2}
                    align="left"
                    className="voucher-treasury content"
                  >
                    {createMenu || menuData?.state !== "For Preparation" ? (
                      <Typography>
                        {`Check Date : ${
                          menuData?.treasuryChecks[0]?.check_date
                            ? moment(
                                menuData?.treasuryChecks[0]?.check_date
                              ).format("MM/DD/YYYY")
                            : ""
                        }`}
                      </Typography>
                    ) : (
                      <Controller
                        name="check_date"
                        control={control}
                        render={({
                          field: { onChange, value, ...restField },
                        }) => (
                          <Box className="date-picker-container treasury">
                            <DatePicker
                              className="transaction-form-date treasury"
                              label="Check Date *"
                              format="MM/DD/YYYY"
                              value={value}
                              onChange={(e) => {
                                onChange(e);
                              }}
                              slotProps={{
                                textField: {
                                  variant: "filled",
                                  error: Boolean(errors?.check_date),
                                  helperText: errors?.check_date?.message,
                                },
                              }}
                            />
                          </Box>
                        )}
                      />
                    )}
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
                        {`${menuData?.transactions?.tag_year} - ${menuData?.transactions?.tag_no}`}
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
                        {`${menuData?.transactions?.documentType?.code} - ${menuData?.transactions?.invoice_no}`}
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

                {menuData?.state === "For Preparation" && (
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
                                  label="Check Voucher"
                                  onChange={() => {
                                    setValue("check_no", null);
                                    setValue("debit_type", null);
                                  }}
                                />
                                <FormControlLabel
                                  value="DEBIT MEMO"
                                  control={
                                    <Radio color="secondary" size="small" />
                                  }
                                  label="Debit Memo"
                                  onChange={() => {
                                    setValue("check_no", null);
                                    setValue("debit_type", null);
                                  }}
                                />
                                {/* <FormControlLabel
                                  value="OFFSET EXPENSE MEMO"
                                  control={
                                    <Radio color="secondary" size="small" />
                                  }
                                  label="Offset"
                                /> */}
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

                {menuData?.state === "For Preparation" && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      align="left"
                      className="voucher-treasury content"
                    >
                      {!watch("multiple") ? (
                        <Button
                          variant="contained"
                          color="warning"
                          className="add-transaction-button"
                          onClick={() => {
                            setValue("bank", null);
                            setValue("check_date", null);
                            setValue("check_no", null);
                            setValue("multiple", true);
                            dispatch(setCreateMenu(true));
                          }}
                        >
                          Add Check
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="error"
                          className="add-transaction-button"
                          onClick={() => {
                            remove(fields?.map((_, index) => index));
                            setValue("multiple", false);
                            dispatch(setCreateMenu(false));
                          }}
                        >
                          Clear Checks
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {createMenu && (
          <Accordion elevation={1}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack display={"flex"} flexDirection={"row"} gap={76}>
                <Typography
                  className="name-supplier-typo-treasury name"
                  align="center"
                >
                  Check Details
                </Typography>

                <Typography
                  className="name-supplier-typo-treasury name"
                  align="center"
                  color={
                    parseFloat(totalAmountCheckForm(watch("check"))).toFixed(
                      2
                    ) !== parseFloat(voucherData?.amount).toFixed(2)
                      ? "error"
                      : ""
                  }
                >
                  {`Total Amount: ₱ ${convertToPeso(
                    parseFloat(totalAmountCheckForm(watch("check"))).toFixed(2)
                  )}`}
                </Typography>
              </Stack>
            </AccordionSummary>

            {fields?.map((item, index) => {
              return (
                <AccordionDetails key={item.id}>
                  <Stack
                    flexDirection={"row"}
                    gap={2}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    {watch("type") === "DEBIT MEMO" ? (
                      <Autocomplete
                        control={control}
                        name={`check.${index}.debit_type`}
                        loading={loadingSearch}
                        options={debitType || []}
                        getOptionLabel={(option) => `${option?.name}`}
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                        renderInput={(params) => (
                          <MuiTextField
                            name="bank"
                            {...params}
                            label="Debit Type*"
                            size="small"
                            variant="filled"
                            error={Boolean(errors.debit_type)}
                            helperText={errors.debit_type?.message}
                            className="transaction-tax-textBox treasury-array"
                          />
                        )}
                        disableClearable
                      />
                    ) : (
                      <Autocomplete
                        control={control}
                        name={`check.${index}.check_no`}
                        options={searchedData?.result || []}
                        getOptionLabel={(option) => `${option.check_no}`}
                        getOptionDisabled={(option) => {
                          return watch("check")?.some(
                            (checks) => checks.check_no?.id === option.id
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
                            error={Boolean(errors?.check?.[index]?.check_no)}
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
                      control={control}
                      name={`check.${index}.amount`}
                      label={"Amount"}
                      color="primary"
                      className="transaction-tax-textBox treasury-array"
                      error={Boolean(errors?.check?.[index]?.amount)}
                      helperText={errors?.check?.[index]?.amount?.message}
                      variant="filled"
                      onKeyUp={(e) => handleCheckAmount(e, index)}
                    />
                    {watch("type") === "DEBIT MEMO" ? (
                      <Autocomplete
                        control={control}
                        name={`check.${index}.bank`}
                        options={
                          accountTitles?.result?.filter((coa) =>
                            coa?.name?.startsWith("CIB")
                          ) || []
                        }
                        getOptionLabel={(option) => `${option.name}`}
                        isOptionEqualToValue={(option, value) =>
                          option?.id === value?.id
                        }
                        renderInput={(params) => (
                          <MuiTextField
                            name="bank"
                            {...params}
                            label="Bank*"
                            size="small"
                            variant="filled"
                            error={Boolean(errors.bank)}
                            helperText={errors.bank?.message}
                            className="transaction-form-textBox treasury-array"
                          />
                        )}
                        disableClearable
                      />
                    ) : (
                      <Autocomplete
                        control={control}
                        name={"bank"}
                        options={
                          accountTitles?.result?.filter((coa) =>
                            coa?.name?.startsWith("CIB")
                          ) || []
                        }
                        getOptionLabel={(option) => `${option.name}`}
                        isOptionEqualToValue={(option, value) =>
                          option?.id === value?.id
                        }
                        onClose={() => {
                          setValue("credit_coa_id", watch("bank"));
                          handleGetCheckNo();
                        }}
                        renderInput={(params) => (
                          <MuiTextField
                            name="bank"
                            {...params}
                            label="Bank*"
                            size="small"
                            variant="filled"
                            error={Boolean(errors.bank)}
                            helperText={errors.bank?.message}
                            className="transaction-form-textBox treasury-array"
                          />
                        )}
                        disableClearable
                      />
                    )}

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
                                  errors?.check?.[index]?.check_date?.message,
                              },
                            }}
                          />
                        </Box>
                      )}
                    />
                    <IconButton
                      onClick={() => {
                        remove(index);
                        setTimeout(() => {
                          if (fields?.length === 1) {
                            dispatch(setCreateMenu(false));
                            setValue("multiple", false);
                          }
                        }, 0);
                      }}
                    >
                      <DoNotDisturbOnOutlinedIcon color="error" />
                    </IconButton>
                  </Stack>
                </AccordionDetails>
              );
            })}
            <AccordionDetails className="accordion-check-details">
              <Button
                variant="contained"
                color="success"
                className="add-transaction-button"
                onClick={() =>
                  append({
                    id: Date.now(),
                    check_no: "",
                    bank: watch("credit_coa_id"),
                    amount: 0,
                    check_no: null,
                    check_date: dayjs(new Date(), {
                      locale: AdapterDayjs.locale,
                    }),
                  })
                }
              >
                Add
              </Button>
            </AccordionDetails>
          </Accordion>
        )}

        <Box className="add-transaction-button-container">
          <Box className="return-receive-container">
            <ReactToPrint
              trigger={() => (
                <div>
                  {menuData?.state === "Check Approval" &&
                    !hasAccess("check_approval") && (
                      <Button
                        variant="contained"
                        color="warning"
                        className="add-transaction-button"
                        // startIcon={<DeleteForeverOutlinedIcon />}
                      >
                        Print Voucher
                      </Button>
                    )}
                </div>
              )}
              content={() => componentRef.current}
            />

            {menuData?.state === "For Releasing" && (
              <Button
                variant="contained"
                color="success"
                className="add-transaction-button"
                onClick={() => handleReleaseVoucher()}
              >
                Release
              </Button>
            )}

            {menuData?.state === "Released" && (
              <Button
                variant="contained"
                color="success"
                className="add-transaction-button"
                onClick={() => dispatch(setReceiveMenu(true))}
                // startIcon={<DeleteForeverOutlinedIcon />}
              >
                {taxData === null ? "Clear" : "View OR"}
              </Button>
            )}
            {menuData?.state === "For Preparation" && (
              <Button
                variant="contained"
                color="error"
                className="add-transaction-button"
                onClick={() => dispatch(setReturn(true))}
              >
                Return
              </Button>
            )}
          </Box>
          <Box className="archive-transaction-button-container">
            {(taxData !== null ||
              menuDataMultiple?.length !== 0 ||
              menuData?.state === "For Preparation" ||
              menuData?.state === "For Clearing") && (
              <Button
                disabled={
                  watch("multiple") === true &&
                  parseFloat(totalAmountCheckForm(watch("check"))).toFixed(
                    2
                  ) !== parseFloat(voucherData?.amount).toFixed(2)
                }
                variant="contained"
                color="success"
                type="submit"
                className="add-transaction-button"
              >
                Submit
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
          loadingSearch
        }
        className="loading-transaction-create"
      >
        <Lottie animationData={loading} loop />
      </Dialog>

      <Dialog open={isReturn}>
        <ReasonInput
          title={"Reason for return"}
          reasonDesc={"Please enter the reason for returning this entry"}
          warning={
            "Please note that this entry will be forwarded back to Approver for further processing. Kindly provide a reason for this action."
          }
          confirmButton={"Confirm"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          confirmOnClick={(e) => handleReturn(e)}
        />
      </Dialog>

      <Dialog
        open={receiveMenu}
        onClose={() => dispatch(setReceiveMenu(false))}
      >
        <ClearCheck />
      </Dialog>

      <TransactionDrawer transactionData={menuData?.transactions} />
    </Paper>
  );
};

export default TreasuryModal;

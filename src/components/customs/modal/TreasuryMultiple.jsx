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
import "../../styles/TransactionModalApprover.scss";

import { useDispatch, useSelector } from "react-redux";
import {
  useAccountTitlesQuery,
  useClearCVoucherMutation,
  useForApprovalCVoucherMutation,
  useReleaseCVoucherMutation,
  useReleasedCVoucherMutation,
  useTaxComputationQuery,
  useUpdateCheckDateMutation,
} from "../../../services/store/request";
import Lottie from "lottie-react";
import loading from "../../../assets/lottie/Loading-2.json";
import {
  totalAccount,
  totalAccountMapping,
  totalAmountCheck,
} from "../../../services/functions/compute";
import { setVoucherData } from "../../../services/slice/transactionSlice";
import { AdditionalFunction } from "../../../services/functions/AdditionalFunction";
import Autocomplete from "../AutoComplete";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import treasurySchema from "../../../schemas/treasurySchema";
import moment from "moment";
import AppTextBox from "../AppTextBox";
import { DatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import ReactToPrint from "react-to-print";
import {
  resetMenu,
  setCheckID,
  setMenuData,
  setReceiveMenu,
  setUpdateData,
  setViewAccountingEntries,
} from "../../../services/slice/menuSlice";
import { resetOption } from "../../../services/slice/optionsSlice";

import { enqueueSnackbar } from "notistack";
import { resetPrompt } from "../../../services/slice/promptSlice";
import { singleError } from "../../../services/functions/errorResponse";
import ClearCheck from "../ClearCheck";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { hasAccess } from "../../../services/functions/access";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";

const TreasuryMultiple = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const menuDataMultiple = useSelector((state) => state.menu.menuDataMultiple);
  const voucherData = useSelector((state) => state.transaction.voucherData);
  const receiveMenu = useSelector((state) => state.menu.receiveMenu);
  const updateData = useSelector((state) => state.menu.updateData);
  const checkID = useSelector((state) => state.menu.checkID);
  const taxData = useSelector((state) => state.menu.taxData);

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
      transaction_id: menuData?.treasuryChecks[0]?.batch?.map(
        (tags) => tags?.transactions?.id
      ),
      voucher: "check",
      pagination: "none",
    },
    { skip: menuData === null }
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(treasurySchema),
    defaultValues: {
      debit_coa_id: null,
      credit_coa_id: null,
      bank: null,
      check_no: "",
      check_date: null,
      type: "",
    },
  });

  const [releaseVoucher, { isLoading: releaseLoading }] =
    useReleaseCVoucherMutation();

  const [forApprovalVoucher, { isLoading: forApprovalLoading }] =
    useForApprovalCVoucherMutation();

  const [releasedVoucher, { isLoading: releasedLoading }] =
    useReleasedCVoucherMutation();

  const [clearVoucher, { isLoading: clearLoading }] =
    useClearCVoucherMutation();

  const [updateCheckDate, { isLoading: checkDateLoading }] =
    useUpdateCheckDateMutation();

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
        check_no: menuData?.treasuryChecks[0]?.check_no,
        check_date:
          dayjs(new Date(menuData?.treasuryChecks[0]?.check_date), {
            locale: AdapterDayjs.locale,
          }) || null,
        bank: accountTitles?.result?.find(
          (item) => menuData?.treasuryChecks[0]?.coa?.code === item?.code
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
      treasury_checks: [
        {
          coa_id: submitData?.bank?.id,
          check_no: submitData?.check_no,
          amount: voucherData?.amount,
          check_date: moment(submitData?.check_date).format("YYYY-MM-DD"),
        },
      ],
    };

    try {
      if (submitData?.type === "CHECK VOUCHER") {
        const res = await forApprovalVoucher(obj).unwrap();
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

  const handleApproveVoucher = async () => {
    const obj = {
      check_ids: [menuData?.id],
    };
    try {
      const res = await releaseVoucher(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleUpdateCheckDate = async () => {
    const obj = {
      id: checkID,
      check_date: moment(new Date(watch("check_date"))).format("YYYY-MM-DD"),
    };
    const updatedDate = {
      ...menuData,
      treasuryChecks: menuData?.treasuryChecks?.map((check) => {
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
      dispatch(setMenuData(updatedDate));
      dispatch(setCheckID(""));
      dispatch(setUpdateData(false));
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };
  return (
    <Paper className="transaction-modal-container">
      <form onSubmit={handleSubmit(submitHandler)}>
        <Box ref={componentRef}>
          {menuData?.treasuryChecks[0]?.batch?.map((items, index) => {
            const voucherAmount = totalAccountMapping(taxComputation, items);
            return (
              <TableContainer
                key={index}
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
                          {convertToPeso(parseFloat(voucherAmount).toFixed(2))}
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
                          <Typography>{menuData?.debitCoa?.name} </Typography>
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
                          {convertToPeso(parseFloat(voucherAmount).toFixed(2))}
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
                        {taxData === null && menuData?.creditCoa ? (
                          <Typography>{menuData?.creditCoa?.name}</Typography>
                        ) : (
                          <Autocomplete
                            control={control}
                            name={"credit_coa_id"}
                            options={accountTitles?.result || []}
                            getOptionLabel={(option) => `${option.name}`}
                            isOptionEqualToValue={(option, value) =>
                              option?.id === value?.id
                            }
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
                          {convertToPeso(parseFloat(voucherAmount).toFixed(2))}
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
                              menuData?.treasuryChecks[0]?.coa?.name
                                ? menuData?.treasuryChecks[0]?.coa?.name
                                : ""
                            }`}
                          </Typography>
                        ) : (
                          <Autocomplete
                            control={control}
                            name={"bank"}
                            options={accountTitles?.result || []}
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
                            menuData?.treasuryChecks[0]?.check_no
                              ? menuData?.treasuryChecks[0]?.check_no
                              : ""
                          }`}</Typography>
                        ) : (
                          <AppTextBox
                            showDecimal
                            type={
                              watch("type") === "DEBIT MEMO" ? "" : "number"
                            }
                            control={control}
                            name={"check_no"}
                            label={
                              watch("type") === "CHECK VOUCHER"
                                ? "Check No. *"
                                : "Remarks"
                            }
                            color="primary"
                            className="transaction-tax-textBox treasury"
                            error={Boolean(errors?.check_no)}
                            helperText={errors?.check_no?.message}
                            variant="filled"
                          />
                        )}
                      </TableCell>
                      <TableCell
                        colSpan={5}
                        align="left"
                        className="voucher-treasury content"
                      >
                        <Stack flexDirection={"row"} gap={1}>
                          <Typography>CV. No. :</Typography>
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
                          <Typography>
                            {`Check Date : ${
                              menuData?.treasuryChecks[0]?.check_date
                                ? moment(
                                    menuData?.treasuryChecks[0]?.check_date
                                  ).format("MM/DD/YYYY")
                                : ""
                            }`}
                            {items?.state === "For Releasing" && (
                              <IconButton
                                className="check-date-edit treasury"
                                onClick={() => {
                                  dispatch(
                                    setCheckID(menuData?.treasuryChecks[0]?.id)
                                  );
                                  dispatch(setUpdateData(true));
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            )}
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
                        <Typography>(Signature Over Printed Name)</Typography>
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
                                        <Radio color="secondary" size="small" />
                                      }
                                      label="Check Voucher"
                                    />
                                    <FormControlLabel
                                      value="DEBIT MEMO"
                                      control={
                                        <Radio color="secondary" size="small" />
                                      }
                                      label="Debit Memo"
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
            );
          })}
        </Box>
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
              >
                {`Total Amount: ₱ ${convertToPeso(
                  parseFloat(
                    totalAmountCheck(menuData?.treasuryChecks)
                  ).toFixed(2)
                )}`}
              </Typography>
            </Stack>
          </AccordionSummary>

          <AccordionDetails className="treasury-check-details-summary">
            <TableContainer className="tag-transaction-table-container">
              <Table stickyHeader>
                <TableHead>
                  <TableRow className="table-header1-import-tag-transaction">
                    <TableCell align="center">Check Number</TableCell>
                    <TableCell align="center">Amount</TableCell>
                    <TableCell align="center">Bank</TableCell>
                    <TableCell align="center">Check Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {menuData?.treasuryChecks?.map((item, index) => {
                    return (
                      <TableRow
                        key={index}
                        className="table-body-tag-transaction"
                      >
                        <TableCell>
                          <Typography
                            align="center"
                            className="check-item-typography"
                          >
                            {item?.check_no}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography className="check-item-typography">
                            {convertToPeso(parseFloat(item?.amount).toFixed(2))}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            align="center"
                            className="check-item-typography"
                          >
                            {item?.coa?.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography className="check-item-typography">
                            {item?.check_date
                              ? moment(item?.check_date).format("MM/DD/YYYY")
                              : "-"}

                            <IconButton
                              className="check-date-edit treasury"
                              onClick={() => {
                                dispatch(setCheckID(item?.id));
                                dispatch(setUpdateData(true));
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
        <Box className="add-transaction-button-container">
          <Box className="return-receive-container">
            <ReactToPrint
              trigger={() => (
                <div>
                  {menuData?.state === "For Releasing" &&
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

            {hasAccess("check_approval") && (
              <Button
                variant="contained"
                color="success"
                className="add-transaction-button"
                onClick={() => handleApproveVoucher()}
              >
                Approve
              </Button>
            )}

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

            {menuData?.state === "For Filling" && (
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
          </Box>
          <Box className="archive-transaction-button-container">
            {(taxData !== null ||
              menuDataMultiple?.length !== 0 ||
              menuData?.state === "For Preparation" ||
              menuData?.state === "For Clearing") && (
              <Button
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
          forApprovalLoading ||
          checkDateLoading
        }
        className="loading-transaction-create"
      >
        <Lottie animationData={loading} loop />
      </Dialog>

      <Dialog
        open={receiveMenu}
        onClose={() => dispatch(setReceiveMenu(false))}
      >
        <ClearCheck />
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
    </Paper>
  );
};

export default TreasuryMultiple;

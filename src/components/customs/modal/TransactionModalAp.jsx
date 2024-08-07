import React, { useEffect, useRef } from "react";

import {
  Box,
  Button,
  Dialog,
  Divider,
  Paper,
  Typography,
  TextField as MuiTextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {
  resetMenu,
  setComputationMenu,
  setCreateTax,
  setTaxData,
  setUpdateTax,
  setViewAccountingEntries,
  setViewMenu,
} from "../../../services/slice/menuSlice";
import {
  useAccountNumberQuery,
  useAccountTitlesQuery,
  useArchiveCheckEntriesMutation,
  useArchiveJournalEntriesMutation,
  useAtcQuery,
  useCheckedCVoucherMutation,
  useCheckedJVoucherMutation,
  useDocumentTypeQuery,
  useLocationQuery,
  useSupplierQuery,
  useSupplierTypeQuery,
  useTaxComputationQuery,
  useVpCheckNumberQuery,
  useVpJournalNumberQuery,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import { singleError } from "../../../services/functions/errorResponse";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { resetPrompt, setReturn } from "../../../services/slice/promptSlice";
import { mapAPTransaction } from "../../../services/functions/mapObject";

import "../../styles/TransactionModal.scss";

import transaction from "../../../assets/svg/transaction.svg";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Autocomplete from "../AutoComplete";
import AppPrompt from "../AppPrompt";
import warningImg from "../../../assets/svg/warning.svg";

import TransactionDrawer from "../TransactionDrawer";

import dayjs from "dayjs";
import Lottie from "lottie-react";

import AddIcon from "@mui/icons-material/Add";

import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ViewQuiltOutlinedIcon from "@mui/icons-material/ViewQuiltOutlined";

import apTransactionSchema from "../../../schemas/apTransactionSchema";

import TaxComputation from "./TaxComputation";
import {
  resetOption,
  setDisableCheck,
} from "../../../services/slice/optionsSlice";
import ComputationMenu from "./ComputationMenu";
import { totalAccount, totalAmount } from "../../../services/functions/compute";
import TransactionModalApprover from "./TransactionModalApprover";
import socket from "../../../services/functions/serverSocket";

const TransactionModalAp = ({
  view,
  update,
  receive,
  checked,
  viewVoucher,
}) => {
  const dispatch = useDispatch();
  const transactionData = useSelector((state) => state.menu.menuData);
  const createTax = useSelector((state) => state.menu.createTax);
  const updateTax = useSelector((state) => state.menu.updateTax);
  const computationMenu = useSelector((state) => state.menu.computationMenu);
  const viewAccountingEntries = useSelector(
    (state) => state.menu.viewAccountingEntries
  );

  const disableButton = useSelector((state) => state.options.disableButton);
  const disableCheck = useSelector((state) => state.options.disableCheck);
  const voucher = useSelector((state) => state.options.voucher);

  const isReturn = useSelector((state) => state.prompt.return);

  const { enqueueSnackbar } = useSnackbar();

  const hasRun = useRef(false);

  const {
    data: tin,
    isLoading: loadingTIN,
    isSuccess: supplySuccess,
  } = useSupplierQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: document,
    isLoading: loadingDocument,
    isSuccess: documentSuccess,
  } = useDocumentTypeQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: accountNumber,
    isLoading: loadingAccountNumber,
    isSuccess: accountSuccess,
  } = useAccountNumberQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: taxComputation,
    isLoading: loadingTax,
    isError: errorTaxComputation,
  } = useTaxComputationQuery(
    {
      status: "active",
      transaction_id: transactionData?.transactions?.id,
      voucher: voucher,
      pagination: "none",
    },
    { skip: transactionData === null }
  );

  const {
    data: supplierType,
    isLoading: loadingType,
    isSuccess: typeSuccess,
  } = useSupplierTypeQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: accountTitles,
    isLoading: loadingTitles,
    isSuccess: successTitles,
  } = useAccountTitlesQuery({
    status: "active",
    pagination: "none",
  });

  const { data: vpCheckNumber, isLoading: loadingVp } = useVpCheckNumberQuery(
    {
      ap_tagging_id: transactionData?.apTagging?.id,
      yearMonth: transactionData?.tag_year,
    },
    {
      skip:
        voucher === "journal" || voucher === null || transactionData === null,
    }
  );

  const { data: vpJournalNumber, isLoading: loadingJournalVP } =
    useVpJournalNumberQuery(
      {
        ap_tagging_id: transactionData?.apTagging?.id,
        yearMonth: transactionData?.tag_year,
      },
      {
        skip:
          voucher === "check" || voucher === null || transactionData === null,
      }
    );

  const [checkedCV, { isLoading: loadingChecked }] =
    useCheckedCVoucherMutation();
  const [checkedJV, { isLoading: loadingJournal }] =
    useCheckedJVoucherMutation();

  const [archiveCV, { isLoading: loadingArchiveCV }] =
    useArchiveCheckEntriesMutation();
  const [archiveJV, { isLoading: loadingArchiveJV }] =
    useArchiveJournalEntriesMutation();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(apTransactionSchema),
    defaultValues: {
      tag_no: "",
      description: "",
      supplier: "",
      proprietor: "",
      company_address: "",
      invoice_no: "",
      cip_no: "",
      amount: transactionData?.amount,
      tin: null,
      date_invoice: null,
      document_type: null,
      store: null,
      remarks: "",
      voucherType: voucher,
      coa_id: null,
    },
  });

  const validateAmount = (amount) => {
    const total = totalAmount(taxComputation);
    return total?.toFixed(2) !== parseFloat(amount)?.toFixed(2);
  };

  useEffect(() => {
    if (
      supplySuccess &&
      documentSuccess &&
      accountSuccess &&
      typeSuccess &&
      successTitles &&
      !hasRun?.current
    ) {
      const tagMonthYear = dayjs(transactionData?.tag_year, "YYMM").toDate();
      const mapData = mapAPTransaction(
        transactionData?.transactions,
        tin,
        document,
        accountNumber
      );
      validateAmount(watch("amount"));
      const values = {
        ...mapData,
        coa_id: accountTitles?.result?.find(
          (item) => transactionData?.coa_id === item?.id
        ),
        remarks: transactionData?.remarks || "",
        tag_month_year:
          dayjs(new Date(tagMonthYear), {
            locale: AdapterDayjs.locale,
          }) || null,
      };

      Object.entries(values).forEach(([key, value]) => {
        setValue(key, value);
      });

      if (update) {
        const updateField = {
          remarks: transactionData?.remarks,
        };

        Object.entries(updateField).forEach(([key, value]) => {
          setValue(key, value);
        });
      }
      hasRun.current = true;
    }
  }, [
    supplySuccess,
    documentSuccess,
    accountSuccess,
    document,
    accountNumber,
    tin,
    typeSuccess,
    successTitles,
    transactionData,
    taxComputation,
    watch,
    dispatch,
    receive,
    setValue,
    update,
    view,
    checked,
    accountTitles,
  ]);

  const submitHandler = async (submitData) => {
    const obj = {
      id: transactionData?.id,
      transaction_id: transactionData?.transactions?.id,
      cip_no: submitData?.cip_no,
      remarks: submitData?.remarks,
      coa_id: submitData?.coa_id?.id,
      tag_no: transactionData?.transactions?.tag_no,
    };
    try {
      const res =
        voucher === "check"
          ? await checkedCV(obj).unwrap()
          : await checkedJV(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      socket.emit("transaction_approval", {
        ...obj,
        message: `The transaction ${obj?.tag_no} is now for approval`,
      });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const archiveHandler = async () => {
    const obj = {
      id: transactionData?.id,
      transaction_id: transactionData?.transactions?.id,
    };

    try {
      const res =
        voucher === "check"
          ? await archiveCV(obj).unwrap()
          : await archiveJV(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const convertToPeso = (value) => {
    return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Paper className="transaction-modal-container">
      <img
        src={transaction}
        alt="transaction"
        className="transaction-image"
        draggable="false"
      />

      <Typography className="transaction-text">
        {receive && "Transaction"}
        {update && "Update Transaction"}
      </Typography>
      <Divider orientation="horizontal" className="transaction-devider" />
      <Box className="form-title-transaction">
        <Typography className="form-title-text-transaction">
          Supplier Details
        </Typography>
      </Box>

      <form
        className="form-container-transaction"
        onSubmit={handleSubmit(submitHandler)}
      >
        <AppTextBox
          disabled
          control={control}
          name={"tag_no"}
          label={"Tag Number *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.tag_no)}
          helperText={errors?.tag_no?.message}
        />
        <Autocomplete
          disabled
          control={control}
          name={"tin"}
          options={tin?.result || []}
          getOptionLabel={(option) => `${option.tin}`}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <MuiTextField
              name="ap_tagging"
              {...params}
              label="TIN *"
              size="small"
              variant="outlined"
              error={Boolean(errors.tin)}
              helperText={errors.tin?.message}
              className="transaction-form-textBox"
            />
          )}
          disableClearable
        />
        <AppTextBox
          disabled
          control={control}
          name={"supplier"}
          label={"Supplier *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.supplier)}
          helperText={errors?.supplier?.message}
        />
        <AppTextBox
          disabled
          control={control}
          name={"proprietor"}
          label={"Proprietor"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.proprietor)}
          helperText={errors?.proprietor?.message}
        />
        {checked || receive ? (
          <AppTextBox
            disabled
            multiline
            minRows={1}
            control={control}
            name={"company_address"}
            className="transaction-form-field-textBox "
            label="Address"
            error={Boolean(errors.company_address)}
            helperText={errors.company_address?.message}
          />
        ) : (
          <></>
        )}
        <Box className="form-title-transaction">
          <Divider orientation="horizontal" className="transaction-devider" />

          <Typography className="form-title-text-transaction">
            Receipt Details
          </Typography>
        </Box>
        <Controller
          name="date_invoice"
          control={control}
          render={({ field: { onChange, value, ...restField } }) => (
            <Box className="date-picker-container-transaction">
              <DatePicker
                disabled
                className="transaction-form-date"
                label="Date Invoice *"
                format="MMMM DD, YYYY"
                value={value}
                onChange={(e) => {
                  onChange(e);
                }}
              />
              {errors.date_invoice && (
                <Typography variant="caption" color="error">
                  {errors.date_invoice?.message}
                </Typography>
              )}
            </Box>
          )}
        />

        <AppTextBox
          disabled
          control={control}
          name={"invoice_no"}
          label={"Invoice No. *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.invoice_no)}
          helperText={errors?.invoice_no?.message}
        />

        {watch("tin") && (
          <Autocomplete
            disabled
            control={control}
            name={"document_type"}
            options={
              watch("tin")?.supplier_documenttypes?.map((item) =>
                document?.result?.find(
                  (docs) => item.document_code === docs.code
                )
              ) || []
            }
            getOptionLabel={(option) => `${option.name}`}
            isOptionEqualToValue={(option, value) =>
              option?.code === value?.code
            }
            renderInput={(params) => (
              <MuiTextField
                name="document_type"
                {...params}
                label="Document type *"
                size="small"
                variant="outlined"
                error={Boolean(errors.document_type)}
                helperText={errors.document_type?.message}
                className="transaction-form-textBox"
              />
            )}
          />
        )}
        <AppTextBox
          disabled={checked || disableCheck}
          control={control}
          name={"cip_no"}
          label={"CIP No. (Optional)"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.cip_no)}
          helperText={errors?.cip_no?.message}
        />
        {voucher === "journal" && (
          <Autocomplete
            disabled={checked || disableCheck}
            control={control}
            name={"coa_id"}
            options={accountTitles?.result || []}
            getOptionLabel={(option) => `${option.code} - ${option.name}`}
            isOptionEqualToValue={(option, value) =>
              option?.code === value?.code
            }
            renderInput={(params) => (
              <MuiTextField
                name="coa_id"
                {...params}
                label="Account Title"
                size="small"
                variant="outlined"
                error={Boolean(errors.coa_id)}
                helperText={errors.coa_id?.message}
                className="transaction-form-textBox"
              />
            )}
          />
        )}

        <AppTextBox
          disabled={true}
          money
          control={control}
          name={"amount"}
          label={"Amount *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.amount)}
          helperText={errors?.amount?.message}
        />

        <AppTextBox
          disabled
          multiline
          minRows={1}
          control={control}
          name={"description"}
          className="transaction-form-field-textBox "
          label="Description (Optional)"
          error={Boolean(errors.description)}
          helperText={errors.description?.message}
        />

        {voucher === "journal" && (
          <AppTextBox
            disabled={checked || disableCheck}
            multiline
            minRows={1}
            control={control}
            name={"remarks"}
            className="transaction-form-field-textBox "
            label="Journal Description *"
            error={Boolean(errors.remarks)}
            helperText={errors.remarks?.message}
          />
        )}
        {update || checked ? (
          <Box className="form-title-transaction">
            <Divider orientation="horizontal" className="transaction-devider" />
            <Typography className="form-title-text-transaction">
              Tax computation
            </Typography>
          </Box>
        ) : (
          <></>
        )}
        {update || checked ? (
          <Box className="form-tax-details">
            {!checked && (
              <Button
                disabled={disableButton}
                endIcon={<AddIcon />}
                color="secondary"
                variant="contained"
                size="small"
                className="add-tax-computation"
                onClick={() => dispatch(setCreateTax(true))}
              >
                Add
              </Button>
            )}
            <Box className="form-tax-box-details">
              {taxComputation?.result?.map((tax, index) => {
                const type = supplierType?.result?.find(
                  (item) => tax?.stype_id === item.id
                );
                const title = accountTitles?.result?.find(
                  (item) => tax?.coa_id === item?.id
                );

                const vpCheck = parseInt(vpCheckNumber?.result) + 1;
                const vpJournal = parseInt(vpJournalNumber?.result) + 1;

                const year = Math.floor(
                  transactionData?.transactions?.tag_year / 100
                );
                const month = transactionData?.transactions?.tag_year % 100;
                const formattedDate = `20${year}-${month
                  .toString()
                  .padStart(2, "0")}`;
                return (
                  !errorTaxComputation && (
                    <Paper
                      elevation={3}
                      key={index}
                      className="tax-details-value"
                      onClick={() => {
                        update && dispatch(setUpdateTax(true));
                        update && dispatch(setTaxData(tax));
                      }}
                    >
                      <LocalOfferOutlinedIcon />
                      <Box className="tax-box-value-container">
                        <Box className="tax-box-value">
                          <Typography className="amount-tax">
                            Amount: <span>&#8369;</span>{" "}
                            {convertToPeso(parseFloat(tax.amount).toFixed(2))}
                          </Typography>
                          <Typography className="amount-tax">
                            Code: {type?.code}
                          </Typography>
                          <Typography className="amount-tax">
                            Wtax: {type?.wtax}
                          </Typography>
                        </Box>
                        <Box className="tax-box-value">
                          <Typography className="amount-tax">
                            Input Tax: <span>&#8369;</span>{" "}
                            {convertToPeso(
                              parseFloat(tax.vat_input_tax).toFixed(2)
                            )}
                          </Typography>
                          {tax?.nvat_local !== 0 && (
                            <Typography className="amount-tax">
                              Tax Based: <span>&#8369;</span>{" "}
                              {convertToPeso(
                                parseFloat(tax.nvat_local).toFixed(2)
                              )}
                            </Typography>
                          )}
                          {tax?.nvat_service !== 0 && (
                            <Typography className="amount-tax">
                              Tax Based: <span>&#8369;</span>{" "}
                              {convertToPeso(
                                parseFloat(tax.nvat_service).toFixed(2)
                              )}
                            </Typography>
                          )}
                          {tax?.vat_local !== 0 && (
                            <Typography className="amount-tax">
                              Tax Based: <span>&#8369;</span>{" "}
                              {convertToPeso(
                                parseFloat(tax.vat_local).toFixed(2)
                              )}
                            </Typography>
                          )}
                          {tax?.vat_service !== 0 && (
                            <Typography className="amount-tax">
                              Tax Based: <span>&#8369;</span>{" "}
                              {convertToPeso(
                                parseFloat(tax.vat_service).toFixed(2)
                              )}
                            </Typography>
                          )}

                          <Typography className="amount-tax">
                            Wtax Payable Expanded: <span>&#8369;</span>{" "}
                            {convertToPeso(
                              parseFloat(tax.wtax_payable_cr).toFixed(2)
                            )}
                          </Typography>
                        </Box>
                        <Box className="tax-box-value">
                          <Typography className="amount-tax">
                            Total invoice amount: <span>&#8369;</span>{" "}
                            {convertToPeso(
                              parseFloat(tax.total_invoice_amount).toFixed(2)
                            )}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider
                        orientation="horizontal"
                        className="transaction-devider"
                      />
                      <Box className="tax-box-value-container">
                        <Box className="tax-box-value">
                          <Typography className="amount-tax">
                            Account Code: {title?.code}
                          </Typography>
                          <Typography className="amount-tax">
                            Account Title: {title?.name}
                          </Typography>
                        </Box>
                        <Box className="tax-box-value">
                          {transactionData?.voucher_number === null && (
                            <Typography className="amount-tax">
                              VP#: {voucher === "check" ? "CV" : "JV"}
                              {transactionData?.apTagging?.vp}
                              {formattedDate}-
                              {voucher === "check"
                                ? vpCheck.toString().padStart(4, "0")
                                : vpJournal.toString().padStart(4, "0")}
                            </Typography>
                          )}
                          {transactionData?.voucher_number !== null && (
                            <Typography className="amount-tax">
                              VP#: {transactionData?.voucher_number}
                            </Typography>
                          )}
                          {tax?.remarks !== null && (
                            <Typography className="amount-tax">
                              Remarks: {tax?.remarks}
                            </Typography>
                          )}
                        </Box>
                        <Box className="tax-box-value">
                          <Typography className="amount-tax">
                            {tax?.mode} : <span>&#8369;</span>{" "}
                            {tax?.mode === "Debit"
                              ? convertToPeso(parseFloat(tax.debit).toFixed(2))
                              : convertToPeso(
                                  parseFloat(tax.credit).toFixed(2)
                                )}
                          </Typography>
                          <Typography className="amount-tax">
                            Total amount: <span>&#8369;</span>{" "}
                            {tax?.mode === "Debit"
                              ? convertToPeso(
                                  parseFloat(tax.account).toFixed(2)
                                )
                              : `-${convertToPeso(
                                  parseFloat(tax.credit).toFixed(2)
                                )}`}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  )
                );
              })}
              <Paper
                elevation={3}
                className="tax-details-value"
                onClick={() => dispatch(setComputationMenu(true))}
              >
                <Box className="tax-total-value">
                  <Typography
                    className="amount-tax"
                    color={
                      !errorTaxComputation &&
                      parseFloat(totalAmount(taxComputation)).toFixed(2) ===
                        parseFloat(watch("amount")).toFixed(2)
                        ? "black"
                        : "error"
                    }
                  >
                    Total invoice amount : <span>&#8369;</span>{" "}
                    {errorTaxComputation
                      ? convertToPeso((0).toFixed(2))
                      : convertToPeso(totalAmount(taxComputation)?.toFixed(2))}
                  </Typography>
                  <Typography className="amount-tax">
                    {voucher === "check" ? "Check amount" : "Total amount"}:{" "}
                    <span>&#8369;</span>{" "}
                    {errorTaxComputation
                      ? convertToPeso((0).toFixed(2))
                      : convertToPeso(totalAccount(taxComputation)?.toFixed(2))}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        ) : (
          <></>
        )}
        <Box className="form-title-transaction">
          <Divider orientation="horizontal" className="transaction-devider" />
        </Box>

        <Box className="add-transaction-button-container">
          <Box className="return-receive-container">
            {update && (
              <Button
                variant="contained"
                color="error"
                className="add-transaction-button"
                startIcon={<DeleteForeverOutlinedIcon />}
                onClick={() => dispatch(setReturn(true))}
              >
                Archive
              </Button>
            )}
            {!errorTaxComputation && viewVoucher && (
              <Button
                variant="contained"
                color="success"
                className="add-transaction-button"
                startIcon={<ViewQuiltOutlinedIcon />}
                onClick={() => dispatch(setViewAccountingEntries(true))}
              >
                View Voucher
              </Button>
            )}
          </Box>
          <Box className="archive-transaction-button-container">
            {update && (
              <LoadingButton
                variant="contained"
                color="warning"
                type="submit"
                className="add-transaction-button"
                disabled={
                  errorTaxComputation || validateAmount(watch("amount"))
                }
              >
                Checked
              </LoadingButton>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                dispatch(resetMenu());
                dispatch(resetOption());
              }}
              className="add-transaction-button"
            >
              {view ? "Close" : update ? "Cancel" : "Cancel"}
            </Button>
          </Box>
        </Box>
      </form>

      <Dialog
        open={
          loadingTIN ||
          loadingDocument ||
          loadingAccountNumber ||
          loadingType ||
          loadingTitles ||
          loadingTax ||
          loadingVp ||
          loadingChecked ||
          loadingJournal ||
          loadingJournalVP ||
          loadingArchiveCV ||
          loadingArchiveJV
        }
        className="loading-transaction-create"
      >
        <Lottie animationData={loading} loop />
      </Dialog>

      <Dialog open={isReturn} onClose={() => dispatch(setReturn(false))}>
        <AppPrompt
          image={warningImg}
          title={"Archive Entry?"}
          message={"You are about to archive this Entry"}
          nextLineMessage={"Please confirm to archive it to tagging"}
          confirmButton={"Yes, Archive it!"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          confirmOnClick={() => archiveHandler()}
        />
      </Dialog>

      {view || update ? (
        <TransactionDrawer transactionData={transactionData?.transactions} />
      ) : (
        <></>
      )}

      <Dialog
        open={createTax}
        className="transaction-modal-dialog"
        onClose={() => dispatch(setCreateTax(false))}
      >
        <TaxComputation
          create
          taxComputation={errorTaxComputation ? [] : taxComputation}
        />
      </Dialog>

      <Dialog
        open={computationMenu}
        className="transaction-modal-dialog-tax"
        onClose={() => dispatch(setComputationMenu(false))}
      >
        <ComputationMenu />
      </Dialog>

      <Dialog
        open={viewAccountingEntries}
        className="transaction-modal-dialog"
        onClose={() => dispatch(setViewAccountingEntries(false))}
      >
        <TransactionModalApprover viewAccountingEntries />
      </Dialog>

      <Dialog
        open={updateTax}
        className="transaction-modal-dialog"
        onClose={() => dispatch(setUpdateTax(false))}
      >
        <TaxComputation update taxComputation={taxComputation} />
      </Dialog>
    </Paper>
  );
};

export default TransactionModalAp;

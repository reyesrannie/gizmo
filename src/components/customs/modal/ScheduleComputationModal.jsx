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
} from "../../../services/slice/menuSlice";
import {
  useAccountNumberQuery,
  useAccountTitlesQuery,
  useAtcQuery,
  useCheckedScheduleTransactionMutation,
  useCompleteSchedTransactionMutation,
  useDocumentTypeQuery,
  useGenerateTransactionMutation,
  useLocationQuery,
  useResetSchedTransactionMutation,
  useSupplierQuery,
  useSupplierTypeQuery,
  useTaxComputationQuery,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import { singleError } from "../../../services/functions/errorResponse";
import { resetPrompt, setWarning } from "../../../services/slice/promptSlice";
import {
  mapAPScheduleTransaction,
  mapScheduleTransactionData,
} from "../../../services/functions/mapObject";

import "../../styles/TransactionModal.scss";
import warningImg from "../../../assets/svg/warning.svg";

import transaction from "../../../assets/svg/transaction.svg";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Autocomplete from "../AutoComplete";
import TransactionDrawer from "../TransactionDrawer";

import Lottie from "lottie-react";

import AddIcon from "@mui/icons-material/Add";

import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ViewQuiltOutlinedIcon from "@mui/icons-material/ViewQuiltOutlined";

import TaxComputation from "./TaxComputation";
import {
  resetOption,
  setDisableCheck,
} from "../../../services/slice/optionsSlice";
import ComputationMenu from "./ComputationMenu";
import { totalAccount, totalAmount } from "../../../services/functions/compute";
import TransactionModalApprover from "./TransactionModalApprover";

import scheduleTransactionAPSchema from "../../../schemas/scheduleTransactionAPSchema";
import { DatePicker } from "@mui/x-date-pickers";
import DateChecker from "../../../services/functions/DateChecker";
import { useNavigate } from "react-router-dom";
import AppPrompt from "../AppPrompt";
import { setHeader } from "../../../services/slice/headerSlice";

const ScheduleComputationModal = ({ view, update, receive, checked, ap }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const transactionData = useSelector((state) => state.menu.menuData);
  const warning = useSelector((state) => state.prompt.warning);

  const createTax = useSelector((state) => state.menu.createTax);
  const updateTax = useSelector((state) => state.menu.updateTax);
  const computationMenu = useSelector((state) => state.menu.computationMenu);
  const viewAccountingEntries = useSelector(
    (state) => state.menu.viewAccountingEntries
  );
  const { isCoverageTodayTable } = DateChecker();
  const isToday = isCoverageTodayTable(transactionData);

  const disableButton = useSelector((state) => state.options.disableButton);
  const disableCheck = useSelector((state) => state.options.disableCheck);
  const voucher = useSelector((state) => state.options.voucher);

  const { enqueueSnackbar } = useSnackbar();

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
    data: location,
    isLoading: loadingLocation,
    isSuccess: locationSuccess,
  } = useLocationQuery({
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
      schedule_id: transactionData?.id,
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

  const [checkScheduleTransaction, { isLoading: loadingCheck }] =
    useCheckedScheduleTransactionMutation();

  const [resetScheduleTransaction, { isLoading: loadingReset }] =
    useResetSchedTransactionMutation();

  const [generateTransaction, { isLoading: loadingGenerate }] =
    useGenerateTransactionMutation();

  const [completeTransaction, { isLoading: loadingComplete }] =
    useCompleteSchedTransactionMutation();

  const hasRun = useRef(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(scheduleTransactionAPSchema),
    defaultValues: {
      description: "",
      supplier: "",
      proprietor: "",
      company_address: "",
      invoice_no: "",
      cip_no: "",
      amount: transactionData?.month_amount,
      tin: null,
      date_invoice: null,
      document_type: null,
      store: null,
      remarks: "",
      coa_id: null,
      month_paid: "0",
      month_total: "",
      coverage_to: null,
      coverage_from: null,
    },
  });

  const validateAmount = (amount) => {
    const total = totalAmount(taxComputation);

    dispatch(
      setDisableCheck(total?.toFixed(2) !== parseFloat(amount)?.toFixed(2))
    );
  };

  useEffect(() => {
    if (
      supplySuccess &&
      documentSuccess &&
      accountSuccess &&
      locationSuccess &&
      typeSuccess &&
      successTitles &&
      !hasRun?.current
    ) {
      const mapData = mapAPScheduleTransaction(
        transactionData,
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
      };

      Object.entries(values).forEach(([key, value]) => {
        setValue(key, value);
      });
      hasRun.current = true;
    }
  }, [
    supplySuccess,
    documentSuccess,
    accountSuccess,
    locationSuccess,
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
    hasRun,
  ]);

  const submitHandler = async (submitData) => {
    const obj = {
      id: transactionData?.id,
      cip_no: submitData?.cip_no,
    };
    try {
      const res = await checkScheduleTransaction(obj).unwrap();
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

  const handleReset = async () => {
    const obj = {
      id: transactionData?.id,
    };

    try {
      const res = await resetScheduleTransaction(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleGenerate = async () => {
    const obj = {
      id: transactionData?.id,
    };

    try {
      const res = await generateTransaction(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
      dispatch(setHeader("Approved"));
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleComplete = async () => {
    const obj = {
      id: transactionData?.id,
    };

    try {
      const res = await completeTransaction(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
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
        Scheduled Transaction
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

        {view && (
          <Controller
            name="coverage_from"
            control={control}
            render={({ field: { onChange, value, ...restField } }) => (
              <Box className="date-picker-container-transaction">
                <DatePicker
                  disabled={view}
                  className="transaction-form-date"
                  label="From *"
                  format="MMMM DD, YYYY"
                  value={value}
                  maxDate={watch("coverage_to")}
                  onChange={(e) => {
                    onChange(e);
                  }}
                />
                {errors.coverage_from && (
                  <Typography variant="caption" color="error">
                    {errors.coverage_from.message}
                  </Typography>
                )}
              </Box>
            )}
          />
        )}

        {view && (
          <Controller
            name="coverage_to"
            control={control}
            render={({ field: { onChange, value, ...restField } }) => (
              <Box className="date-picker-container-transaction">
                <DatePicker
                  disabled={view}
                  className="transaction-form-date"
                  label="To *"
                  minDate={watch("coverage_from")}
                  format="MMMM DD, YYYY"
                  value={value}
                  onChange={(e) => {
                    onChange(e);
                  }}
                />
                {errors.coverage_to && (
                  <Typography variant="caption" color="error">
                    {errors.coverage_to.message}
                  </Typography>
                )}
              </Box>
            )}
          />
        )}

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
          disabled={disableCheck}
          control={control}
          name={"cip_no"}
          label={"CIP No. (Optional)"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.cip_no)}
          helperText={errors?.cip_no?.message}
        />

        <AppTextBox
          disabled
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
          money
          control={control}
          name={"month_total"}
          label={"Total Month/s"}
          color="primary"
          className="transaction-form-textBox"
        />

        <AppTextBox
          disabled
          control={control}
          name={"month_paid"}
          label={"Total month/s paid"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.amount)}
          helperText={errors?.amount?.message}
        />

        <AppTextBox
          disabled={view}
          multiline
          minRows={1}
          control={control}
          name={"description"}
          className="transaction-form-field-textBox "
          label="Description (Optional)"
          error={Boolean(errors.description)}
          helperText={errors.description?.message}
        />

        {!view && (
          <Box className="form-title-transaction">
            <Divider orientation="horizontal" className="transaction-devider" />
            <Typography className="form-title-text-transaction">
              Tax computation
            </Typography>
          </Box>
        )}

        {!view && (
          <Box className="form-tax-details">
            <Button
              disabled={disableButton || view}
              endIcon={<AddIcon />}
              color="secondary"
              variant="contained"
              size="small"
              className="add-tax-computation"
              onClick={() => dispatch(setCreateTax(true))}
            >
              Add
            </Button>
            <Box className="form-tax-box-details">
              {taxComputation?.result?.map((tax, index) => {
                const type = supplierType?.result?.find(
                  (item) => tax?.stype_id === item.id
                );
                const title = accountTitles?.result?.find(
                  (item) => tax?.coa_id === item?.id
                );

                return (
                  <Paper
                    elevation={3}
                    key={index}
                    className="tax-details-value"
                    onClick={() => {
                      !view && dispatch(setUpdateTax(true));
                      !view && dispatch(setTaxData(tax));
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
                            : convertToPeso(parseFloat(tax.credit).toFixed(2))}
                        </Typography>
                        <Typography className="amount-tax">
                          Total amount: <span>&#8369;</span>{" "}
                          {tax?.mode === "Debit"
                            ? convertToPeso(parseFloat(tax.account).toFixed(2))
                            : `-${convertToPeso(
                                parseFloat(tax.credit).toFixed(2)
                              )}`}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
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
                      parseFloat(totalAmount(taxComputation)).toFixed(2) ===
                      parseFloat(watch("amount")).toFixed(2)
                        ? "black"
                        : "error"
                    }
                  >
                    Total invoice amount : <span>&#8369;</span>{" "}
                    {convertToPeso(totalAmount(taxComputation)?.toFixed(2))}
                  </Typography>
                  <Typography className="amount-tax">
                    {voucher === "check" ? "Check amount" : "Total amount"}:{" "}
                    <span>&#8369;</span>{" "}
                    {convertToPeso(totalAccount(taxComputation)?.toFixed(2))}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        )}

        <Box className="form-title-transaction">
          <Divider orientation="horizontal" className="transaction-devider" />
        </Box>

        <Box className="add-transaction-button-container">
          <Box className="return-receive-container">
            {!view && (
              <Button
                variant="contained"
                color="error"
                className="add-transaction-button"
                onClick={handleReset}
              >
                Reset
              </Button>
            )}
            {transactionData?.state !== "completed" && view && ap && (
              <Button
                disabled={
                  transactionData?.month_total === transactionData?.month_paid
                }
                variant="contained"
                color="primary"
                className="add-transaction-button"
                onClick={() => dispatch(setWarning(true))}
              >
                Complete Transaction
              </Button>
            )}

            {!errorTaxComputation && (
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
            {!view && (
              <LoadingButton
                variant="contained"
                color="warning"
                type="submit"
                className="add-transaction-button"
                disabled={
                  errorTaxComputation ||
                  parseFloat(totalAmount(taxComputation)).toFixed(2) !==
                    parseFloat(watch("amount")).toFixed(2)
                }
              >
                Checked
              </LoadingButton>
            )}
            {transactionData?.state !== "completed" &&
              view &&
              ap &&
              isToday && (
                <Button
                  disabled={
                    transactionData?.month_total === transactionData?.month_paid
                  }
                  variant="contained"
                  color="warning"
                  className="add-transaction-button"
                  onClick={handleGenerate}
                >
                  Generate Voucher
                </Button>
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
          loadingLocation ||
          loadingType ||
          loadingTitles ||
          loadingTax ||
          loadingCheck ||
          loadingReset ||
          loadingGenerate ||
          loadingComplete
        }
        className="loading-transaction-create"
      >
        <Lottie animationData={loading} loop />
      </Dialog>

      <TransactionDrawer schedule />

      <Dialog
        open={createTax}
        className="transaction-modal-dialog"
        onClose={() => dispatch(setCreateTax(false))}
      >
        <TaxComputation schedule create taxComputation={taxComputation} />
      </Dialog>

      <Dialog
        open={computationMenu}
        className="transaction-modal-dialog-tax"
        onClose={() => dispatch(setComputationMenu(false))}
      >
        <ComputationMenu schedule />
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
        <TaxComputation schedule update taxComputation={taxComputation} />
      </Dialog>

      <Dialog
        open={warning}
        className="transaction-modal-dialog"
        onClose={() => dispatch(setWarning(false))}
      >
        <AppPrompt
          image={warningImg}
          title={"Complete Transaction?"}
          message={"Once the transaction is complete, it cannot be reset."}
          nextLineMessage={
            "You need to create a separate transaction to cover the remaining balance."
          }
          confirmButton={"Yes, Complete it!"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          confirmOnClick={handleComplete}
        />
      </Dialog>
    </Paper>
  );
};

export default ScheduleComputationModal;

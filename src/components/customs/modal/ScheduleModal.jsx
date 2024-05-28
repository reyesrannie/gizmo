import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  Divider,
  Paper,
  Typography,
  TextField as MuiTextField,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { resetMenu, setUpdateCount } from "../../../services/slice/menuSlice";
import {
  useAccountNumberQuery,
  useApQuery,
  useCreateScheduleTransactionMutation,
  useDocumentTypeQuery,
  useLocationQuery,
  useReceiveTransactionMutation,
  useSupplierQuery,
  useUpdateScheduleTransactionMutation,
} from "../../../services/store/request";
import { useSnackbar } from "notistack";
import { singleError } from "../../../services/functions/errorResponse";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  resetPrompt,
  setEntryReceive,
  setIsContinue,
  setReceive,
} from "../../../services/slice/promptSlice";
import {
  mapResponse,
  mapScheduleTransactionData,
  mapScheduledTransaction,
} from "../../../services/functions/mapObject";
import { resetLogs } from "../../../services/slice/logSlice";

import "../../styles/TransactionModal.scss";
import "../../styles/UserModal.scss";
import "../../styles/RolesModal.scss";

import transaction from "../../../assets/svg/transaction.svg";
import AppTextBox from "../AppTextBox";
import loading from "../../../assets/lottie/Loading-2.json";
import Autocomplete from "../AutoComplete";
import AppPrompt from "../AppPrompt";
import TransactionDrawer from "../TransactionDrawer";
import receiveImg from "../../../assets/svg/receive.svg";

import dayjs from "dayjs";
import Lottie from "lottie-react";
import ClearIcon from "@mui/icons-material/Clear";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import AddIcon from "@mui/icons-material/Add";

import {
  clearValue,
  transactionDefaultValue,
} from "../../../services/constants/defaultValues";
import ReceiveEntry from "../ReceiveEntry";
import { useNavigate } from "react-router-dom";
import ShortcutHandler from "../../../services/functions/ShortcutHandler";
import socket from "../../../services/functions/serverSocket";
import {
  resetTransaction,
  setAddDocuments,
  setClearSearch,
  setDocuments,
} from "../../../services/slice/transactionSlice";
import { AdditionalFunction } from "../../../services/functions/AdditionalFunction";
import { convertToArray } from "../../../services/functions/toArrayFn";
import schedulTransactionSchema from "../../../schemas/schedulTransactionSchema";

const ScheduleModal = ({ create, view, update, receive }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [oldValues, setOldValues] = useState(null);
  const isReceive = useSelector((state) => state.prompt.receive);
  const entryReceive = useSelector((state) => state.prompt.entryReceive);
  const isContinue = useSelector((state) => state.prompt.isContinue);
  const navigateTo = useSelector((state) => state.prompt.navigate);
  const updateCount = useSelector((state) => state.menu.updateCount);
  const transactionData = useSelector((state) => state.menu.menuData);
  const documents = useSelector((state) => state.transaction.documents);
  const addDocuments = useSelector((state) => state.transaction.addDocuments);

  const defaultValue = transactionDefaultValue();
  const { enqueueSnackbar } = useSnackbar();
  const { insertDocument, deepEqual } = AdditionalFunction();

  const [createTransaction, { isLoading }] =
    useCreateScheduleTransactionMutation();
  const [updateTransaction, { isLoading: updateLoading }] =
    useUpdateScheduleTransactionMutation();

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
    data: ap,
    isLoading: loadingAp,
    isSuccess: apSuccess,
  } = useApQuery({
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

  const [receiveTransaction, { isLoading: receiveLoading }] =
    useReceiveTransactionMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(schedulTransactionSchema),
    defaultValues: defaultValue,
  });

  const handleClear = (e) => {
    clearErrors();
    const defaultValue = clearValue();

    Object.entries(defaultValue).forEach(([key, value]) => {
      setValue(key, value);
    });

    if (!e) {
      handleAutoFill();
    } else {
      setValue("tin", null);
    }
  };

  const handleAutoFill = () => {
    const items = {
      supplier: watch("tin")?.company_name || "",
      proprietor: watch("tin")?.proprietor || "",
      company_address: watch("tin")?.company_address || "",
      name_in_receipt: watch("tin")?.receipt_name || "",
      supplier_type_id: watch("tin")?.supplier_types[0]?.type_id || "",
      atc_id: watch("tin")?.supplier_atcs[0]?.atc_id || "",
      document_type:
        document?.result?.find(
          (item) =>
            item.code === watch("tin")?.supplier_documenttypes[0]?.document_code
        ) || null,
      account_number: accountNumber?.result?.find(
        (item) => watch("tin")?.id === item?.supplier?.id || null
      ),
    };

    Object.entries(items).forEach(([key, value]) => {
      setValue(key, value);
    });

    setValue(
      "store",
      location?.result?.find(
        (item) => watch("account_number")?.location?.id === item?.id || null
      )
    );
  };

  useEffect(() => {
    if (
      supplySuccess &&
      documentSuccess &&
      apSuccess &&
      accountSuccess &&
      locationSuccess &&
      !create
    ) {
      const tagMonthYear = dayjs(transactionData?.tag_year, "YYMM").toDate();
      const docs = insertDocument(transactionData);
      const mapData = mapScheduledTransaction(
        transactionData,
        ap,
        tin,
        document,
        accountNumber,
        location,
        docs
      );

      const values = {
        ...mapData,
        tag_month_year:
          dayjs(new Date(tagMonthYear), {
            locale: AdapterDayjs.locale,
          }) || null,
      };

      Object.entries(values).forEach(([key, value]) => {
        setValue(key, value);
      });
      setOldValues(values);
    }
  }, [
    documents,
    supplySuccess,
    documentSuccess,
    apSuccess,
    accountSuccess,
    locationSuccess,
    transactionData,
    document,
    ap,
    location,
    accountNumber,
    tin,
    create,
    update,
    view,
    receive,
    setValue,
    setOldValues,
  ]);

  useEffect(() => {
    if (transactionData?.reference_no !== "") {
      const docs = insertDocument(transactionData);
      const toArrayItems = convertToArray(docs);
      const addToDocs =
        document?.result?.filter((item) =>
          toArrayItems?.some((doc) => item?.code === doc?.code)
        ) || [];

      dispatch(setDocuments(addToDocs));
    }
  }, [transactionData, insertDocument, document, dispatch, setAddDocuments]);

  const checkField = (field) => {
    return watch("document_type")?.required_fields?.includes(field);
  };

  const getFormattedString = (arr, values) => {
    return arr
      .map((item) => {
        const code = item.code;
        const value = values[code];
        return value ? `${code} ${value}` : null;
      })
      .filter(Boolean)
      .join(", ");
  };

  const submitHandler = async (submitData) => {
    const addedDocs = getFormattedString(documents, submitData);
    const mappedData = mapScheduleTransactionData(submitData);
    const obj = {
      ...mappedData,
      id: !create ? transactionData?.id : null,
      reference_no: addedDocs,
    };

    try {
      const res =
        update || receive
          ? await updateTransaction(obj).unwrap()
          : await createTransaction(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      socket.emit(
        update || receive ? "transaction_updated" : "transaction_created",
        {
          ...obj,
          message:
            update || receive
              ? `The transaction ${obj?.tag_no} has been updated`
              : `A new transaction has been created.`,
        }
      );
      const docs = insertDocument(res?.result);
      const resData = await mapScheduledTransaction(
        res?.result,
        ap,
        tin,
        document,
        accountNumber,
        location,
        docs
      );
      setOldValues(resData);
      update || receive
        ? Object.entries(resData).forEach(([key, value]) => {
            setValue(key, value);
          })
        : dispatch(resetMenu());
      dispatch(resetLogs());
      dispatch(setUpdateCount(0));
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleReceive = async () => {
    const obj = {
      tag_no: transactionData?.tag_no,
      id: transactionData?.id,
    };

    try {
      const res = await receiveTransaction(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleShortCut = () => {
    handleSubmit(submitHandler)();
  };

  const handleRemove = (item) => {
    const docs = documents?.filter((doc) => doc?.code !== item?.code);
    setValue(item?.code, "");
    dispatch(setDocuments(docs));
  };

  const checkChanges = () => {
    const item = getValues();
    const propertiesToCheck = [
      "tin",
      "reference_no",
      "document_type",
      "amount",
      "description",
      "ap",
    ];

    const hasChanges = !propertiesToCheck.every((prop) =>
      deepEqual(item?.[prop], oldValues?.[prop])
    );

    return hasChanges;
  };

  return (
    <Paper className="transaction-modal-container">
      <ShortcutHandler
        onUpdate={() =>
          updateCount === 1 ? dispatch(setUpdateCount(1)) : handleShortCut()
        }
        onEsc={() => dispatch(resetMenu())}
        onReceive={() => dispatch(setReceive(!checkChanges()))}
        onConfirm={() => dispatch(setEntryReceive(true))}
      />
      <img
        src={transaction}
        alt="transaction"
        className="transaction-image"
        draggable="false"
      />

      <Typography className="transaction-text">
        Scheduled transaction
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
        {false && (
          <AppTextBox
            disabled={view}
            control={control}
            name={"tag_no"}
            label={"Tag Number *"}
            color="primary"
            className="transaction-form-textBox"
            error={Boolean(errors?.tag_no)}
            helperText={errors?.tag_no?.message}
          />
        )}
        <Autocomplete
          disabled={view}
          control={control}
          name={"tin"}
          options={tin?.result || []}
          getOptionLabel={(option) =>
            `${option.tin} -> ${option?.company_name}`
          }
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          onClose={() => {
            handleClear(false);
          }}
          renderInput={(params) => (
            <MuiTextField
              name="tin"
              {...params}
              label="TIN *"
              size="small"
              variant="outlined"
              error={Boolean(errors.tin)}
              helperText={errors.tin?.message}
              className="transaction-form-textBox"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    {watch("tin") && (
                      <IconButton
                        onClick={() => {
                          handleClear(true);
                        }}
                        className="icon-clear-user"
                      >
                        <ClearIcon />
                      </IconButton>
                    )}
                  </>
                ),
              }}
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

        <Box className="form-title-transaction">
          <Divider orientation="horizontal" className="transaction-devider" />

          <Typography className="form-title-text-transaction">
            Coverage
          </Typography>
          <Button
            disabled={view}
            endIcon={<AddIcon />}
            color="secondary"
            variant="contained"
            size="small"
            className="add-tax-document"
            onClick={() => dispatch(setAddDocuments(true))}
          >
            Add Document
          </Button>
        </Box>
        <Controller
          name="coverage_from"
          control={control}
          render={({ field: { onChange, value, ...restField } }) => (
            <Box className="date-picker-container-transaction">
              <DatePicker
                disabled={view}
                className="transaction-form-date"
                label="From *"
                format="YYYY-MM-DD"
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
                format="YYYY-MM-DD"
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
        {watch("tin") && (
          <Autocomplete
            disabled={view}
            control={control}
            name={"document_type"}
            options={document?.result || []}
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
          disabled={view}
          control={control}
          name={"invoice_no"}
          label={"Invoice No. *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.invoice_no)}
          helperText={errors?.invoice_no?.message}
        />

        <AppTextBox
          money
          disabled={view}
          control={control}
          name={"amount"}
          label={"Amount *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.amount)}
          helperText={errors?.amount?.message}
        />
        {checkField("account_number") && (
          <Autocomplete
            disabled={view}
            control={control}
            name={"account_number"}
            options={
              accountNumber?.result?.filter(
                (account) => account?.supplier?.id === watch("tin")?.id
              ) || []
            }
            getOptionLabel={(option) => `${option.account_no}`}
            isOptionEqualToValue={(option, value) =>
              option?.code === value?.code
            }
            renderInput={(params) => (
              <MuiTextField
                name="account_number"
                {...params}
                label="Account Number *"
                size="small"
                variant="outlined"
                error={Boolean(errors.account_number)}
                helperText={errors.account_number?.message}
                className="transaction-form-textBox"
              />
            )}
          />
        )}
        {checkField("store") && (
          <Autocomplete
            disabled={view}
            control={control}
            name={"store"}
            options={location?.result}
            getOptionLabel={(option) => `${option.name}`}
            isOptionEqualToValue={(option, value) =>
              option?.code === value?.code
            }
            renderInput={(params) => (
              <MuiTextField
                name="store"
                {...params}
                label="Store *"
                size="small"
                variant="outlined"
                error={Boolean(errors.store)}
                helperText={errors.store?.message}
                className="transaction-form-textBox"
              />
            )}
          />
        )}

        {documents?.length !== 0 &&
          documents?.map((item, index) => {
            return (
              <AppTextBox
                key={index}
                disabled={view}
                control={control}
                name={`${item?.code}`}
                label={`${item?.code}`}
                color="primary"
                className="transaction-form-textBox"
                handleRemove={() => handleRemove(item)}
                secure
                remove
              />
            );
          })}

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

        <Box className="form-title-transaction">
          <Divider orientation="horizontal" className="transaction-devider" />
          <Typography className="form-title-text-transaction">
            Allocation
          </Typography>
        </Box>
        <Autocomplete
          disabled={view}
          control={control}
          name={"ap"}
          options={ap?.result || []}
          getOptionLabel={(option) =>
            `${option.company_code} - ${option.description}`
          }
          isOptionEqualToValue={(option, value) => option?.code === value?.code}
          renderInput={(params) => (
            <MuiTextField
              name="ap_tagging"
              {...params}
              label="AP *"
              size="small"
              variant="outlined"
              error={Boolean(errors.ap)}
              helperText={errors.ap?.message}
              className="transaction-form-textBox"
            />
          )}
        />
        <Box className="add-transaction-button-container">
          {receive ? (
            <Box className="add-transaction-button-receive">
              <LoadingButton
                disabled={checkChanges()}
                variant="contained"
                color="success"
                className="add-transaction-button"
                onClick={() => dispatch(setReceive(!checkChanges()))}
                startIcon={<HandshakeOutlinedIcon />}
              >
                Receive
              </LoadingButton>
            </Box>
          ) : (
            "."
          )}
          <Box className="archive-transaction-button-container">
            {!view && (
              <LoadingButton
                variant="contained"
                color="warning"
                type="submit"
                className="add-transaction-button"
                disabled={!watch("tin")}
              >
                {create ? "Add" : "Update"}
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
              {view ? "Close" : "Cancel"}
            </Button>
          </Box>
        </Box>
      </form>

      <Dialog
        open={
          isLoading ||
          updateLoading ||
          loadingTIN ||
          loadingDocument ||
          loadingAccountNumber ||
          loadingAp ||
          loadingLocation ||
          receiveLoading
        }
        className="loading-transaction-create"
      >
        <Lottie animationData={loading} loop />
      </Dialog>

      <Dialog open={isReceive} onClose={() => dispatch(setReceive(false))}>
        <AppPrompt
          image={receiveImg}
          title={"Receive Transaction?"}
          message={"You are about to receive this Transaction"}
          nextLineMessage={"Please confirm to receive"}
          confirmButton={"Yes, Receive it!"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          // confirmOnClick={() => validateRoute()}
        />
      </Dialog>

      <Dialog
        open={entryReceive}
        onClose={() => dispatch(setEntryReceive(false))}
      >
        <ReceiveEntry />
      </Dialog>

      <Dialog
        open={addDocuments}
        className="additional-documents"
        onClose={() => dispatch(setAddDocuments(false))}
      >
        <Autocomplete
          disabled={view}
          control={control}
          name={"addedDocuments"}
          options={
            document?.result.filter(
              (item) => !documents?.some((doc) => item?.code === doc?.code)
            ) || []
          }
          getOptionLabel={(option) => `${option.name}`}
          isOptionEqualToValue={(option, value) => option?.code === value?.code}
          onClose={() => {
            if (watch("addedDocuments")) {
              dispatch(setDocuments([...documents, watch("addedDocuments")]));
              dispatch(setAddDocuments(false));
              setValue("addedDocuments", null);
            }
            setValue("addedDocuments", null);
            dispatch(setAddDocuments(false));
          }}
          renderInput={(params) => (
            <MuiTextField
              name="addedDocuments"
              {...params}
              label="Document type"
              size="small"
              variant="outlined"
              error={Boolean(errors.addedDocuments)}
              helperText={errors.addedDocuments?.message}
              className="transaction-form-textBox"
            />
          )}
        />
      </Dialog>

      <TransactionDrawer transactionData={transactionData} />

      <Dialog open={isContinue} onClose={() => dispatch(setIsContinue(false))}>
        <AppPrompt
          image={receiveImg}
          title={"Proceed with Computation?"}
          message={"Do you want to proceed with The Tax Computation?"}
          confirmButton={"Yes, Continue!"}
          cancelButton={"Later"}
          cancelOnClick={() => {
            dispatch(setClearSearch(true));
            dispatch(resetPrompt());
            dispatch(resetMenu());
          }}
          confirmOnClick={() => {
            navigate(navigateTo);
            dispatch(resetPrompt());
            dispatch(resetMenu());
          }}
        />
      </Dialog>
    </Paper>
  );
};

export default ScheduleModal;

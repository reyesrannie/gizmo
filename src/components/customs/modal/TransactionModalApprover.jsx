import React, { useEffect, useRef } from "react";

import {
  Box,
  Button,
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
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import Lottie from "lottie-react";
import loading from "../../../assets/lottie/Loading-2.json";
import warningImg from "../../../assets/svg/warning.svg";

import "../../styles/TransactionModal.scss";
import "../../styles/TransactionModalApprover.scss";
import { LoadingButton } from "@mui/lab";
import {
  resetMenu,
  setComputationMenu,
  setPrintable,
} from "../../../services/slice/menuSlice";
import { resetOption } from "../../../services/slice/optionsSlice";
import { resetPrompt, setReturn } from "../../../services/slice/promptSlice";

import {
  useAccountTitlesQuery,
  useApproveCheckEntriesMutation,
  useApproveJournalEntriesMutation,
  useApproveTransactionMutation,
  useReturnCheckEntriesMutation,
  useReturnJournalEntriesMutation,
  useStatusLogsQuery,
  useSupplierQuery,
  useSupplierTypeQuery,
  useTaxComputationQuery,
  useUsersQuery,
  useVpCheckNumberQuery,
  useVpJournalNumberQuery,
} from "../../../services/store/request";
import {
  setFromBIR,
  setVoucherData,
} from "../../../services/slice/transactionSlice";
import moment from "moment";
import {
  arrayFieldOne,
  arrayFieldThree,
  coaArrays,
} from "../../../services/functions/toArrayFn";
import ReactToPrint from "react-to-print";

import TransactionDrawer from "../TransactionDrawer";
import ReasonInput from "../ReasonInput";
import { enqueueSnackbar } from "notistack";
import { singleError } from "../../../services/functions/errorResponse";
import Form2307 from "./Form2307";
import ComputationMenu from "./ComputationMenu";

const TransactionModalApprover = ({ view, update, approved, ap }) => {
  const dispatch = useDispatch();
  const isReturn = useSelector((state) => state.prompt.return);
  const menuData = useSelector((state) => state.menu.menuData);
  const printable = useSelector((state) => state.menu.printable);
  const computationMenu = useSelector((state) => state.menu.computationMenu);

  const voucher = useSelector((state) => state.options.voucher);
  const voucherData = useSelector((state) => state.transaction.voucherData);
  const formBIR = useSelector((state) => state.transaction.formBIR);

  const {
    data: tin,
    isLoading: loadingTIN,
    isSuccess: supplySuccess,
  } = useSupplierQuery({
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
      transaction_id: menuData?.transactions?.id,
      voucher: voucher,
      pagination: "none",
    },
    { skip: menuData === null }
  );

  const {
    data: accountTitles,
    isLoading: loadingTitles,
    isSuccess: successTitles,
  } = useAccountTitlesQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: supplierType,
    isLoading: loadingType,
    isSuccess: typeSuccess,
  } = useSupplierTypeQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: logs,
    isLoading: loadingLogs,
    isSuccess: successLogs,
  } = useStatusLogsQuery(
    {
      transaction_id: menuData?.transactions?.id,
      sorts: "created_at",
      pagination: "none",
    },
    { skip: menuData === null }
  );

  const { data: user, isSuccess: successUser } = useUsersQuery({
    status: "active",
    pagination: "none",
  });

  const { data: vpCheckNumber, isLoading: loadingVp } = useVpCheckNumberQuery(
    {
      ap_tagging_id: menuData?.apTagging?.id,
      yearMonth: menuData?.tag_year,
    },
    {
      skip: voucher === "journal" || voucher === null || menuData === null,
    }
  );

  const { data: vpJournalNumber, isLoading: loadingJournalVP } =
    useVpJournalNumberQuery(
      {
        ap_tagging_id: menuData?.apTagging?.id,
        yearMonth: menuData?.tag_year,
      },
      {
        skip: voucher === "check" || voucher === null || menuData === null,
      }
    );

  const [returnCheckEntry, { isLoading: loadingReturn }] =
    useReturnCheckEntriesMutation();

  const [returnJournalkEntry, { isLoading: loadingReturnJournal }] =
    useReturnJournalEntriesMutation();

  const [approveCheckEntry, { isLoading: loadingApprove }] =
    useApproveCheckEntriesMutation();

  const [approveJournalEntry, { isLoading: loadingApproveJournal }] =
    useApproveJournalEntriesMutation();

  const [approveTransaction, { isLoading: loadingApproveTransaction }] =
    useApproveTransactionMutation();

  useEffect(() => {
    if (
      taxSuccess &&
      supplySuccess &&
      successTitles &&
      typeSuccess &&
      successLogs &&
      successUser
    ) {
      const sumAmount = taxComputation?.result?.reduce((acc, curr) => {
        return parseFloat(curr.credit)
          ? acc - parseFloat(0)
          : acc + parseFloat(curr.account);
      }, 0);

      const supplier = tin?.result?.find(
        (item) => menuData?.transactions?.supplier_id === item?.id
      );
      dispatch(
        setPrintable(supplier?.tin?.length < 10 && supplier?.tin !== undefined)
      );

      const coa = taxComputation?.result?.map((item) => {
        const checkCOa = accountTitles?.result?.find(
          (coa) => item?.coa_id === coa?.id
        );
        return {
          ...item,
          coa: checkCOa,
        };
      });

      const supTypePercent = taxComputation?.result?.map((item) =>
        supplierType?.result?.find((sup) => item?.stype_id === sup?.id)
      );

      const coa_id = accountTitles?.result?.find(
        (item) => menuData?.coa_id === item?.id
      );

      const preparedBy = logs?.result?.find(
        (stat) => stat?.status === "For Approval"
      );

      const rowThree = arrayFieldThree(menuData);
      const row = arrayFieldOne(menuData, sumAmount, voucher);
      const arrayCoa = coaArrays(
        coa,
        taxComputation?.result,
        supTypePercent,
        coa_id
      );

      const obj = {
        supplier_name: supplier?.company_name,
        first_row: row,
        third_row: rowThree,
        coaArray: arrayCoa,
        preparedBy: user?.result?.find(
          (users) => preparedBy?.updated_by_id === users?.id
        ),
        account: sumAmount,
      };

      dispatch(setVoucherData(obj));
    }
  }, [
    taxSuccess,
    supplySuccess,
    successTitles,
    typeSuccess,
    successLogs,
    successUser,
    dispatch,
    setVoucherData,
    accountTitles,
    successTitles,
    supplierType,
  ]);

  const convertToPeso = (value) => {
    return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const returnHandler = async (submitData) => {
    const obj = {
      ...submitData,
      id: menuData?.id,
    };
    try {
      const res =
        voucher === "check"
          ? await returnCheckEntry(obj).unwrap()
          : await returnJournalkEntry(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const approveHandler = async () => {
    const vpCheck = parseInt(vpCheckNumber?.result) + 1;
    const vpJournal = parseInt(vpJournalNumber?.result) + 1;
    const year = Math.floor(menuData?.transactions?.tag_year / 100);
    const month = menuData?.transactions?.tag_year % 100;
    const formattedDate = `20${year}-${month.toString().padStart(2, "0")}`;

    const obj = {
      id: menuData?.id,
      voucher_number:
        voucher === "check"
          ? `CV${menuData?.apTagging?.vp}${formattedDate}-${vpCheck
              .toString()
              .padStart(4, "0")}`
          : `JV${menuData?.apTagging?.vp}${formattedDate}-${vpJournal
              .toString()
              .padStart(4, "0")}`,
      vp_no:
        voucher === "check"
          ? vpCheck.toString().padStart(4, "0")
          : vpJournal.toString().padStart(4, "0"),
    };

    const transactId = {
      id: menuData?.transactions?.id,
    };
    try {
      const res =
        voucher === "check"
          ? await approveCheckEntry(obj).unwrap()
          : await approveJournalEntry(obj).unwrap();
      menuData?.transactions?.gas_status !== "approved" &&
        (await approveTransaction(transactId).unwrap());
      enqueueSnackbar(res?.message, { variant: "success" });

      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const componentRef = useRef();

  const vpCheck = parseInt(vpCheckNumber?.result) + 1;
  const vpJournal = parseInt(vpJournalNumber?.result) + 1;

  const year = Math.floor(menuData?.transactions?.tag_year / 100);
  const month = menuData?.transactions?.tag_year % 100;
  const formattedDate = `20${year}-${month.toString().padStart(2, "0")}`;
  const totalDebitAmount = voucherData?.coaArray.reduce(
    (total, item) =>
      item?.mode === "Debit" ? total + parseFloat(item?.amount) : total,
    0
  );

  const totalCreditAmount = voucherData?.coaArray.reduce(
    (total, item) =>
      item?.mode === "Credit" ? total + parseFloat(item?.amount) : total,
    0
  );

  return (
    <Paper className="transaction-modal-container">
      <TableContainer ref={componentRef} className="table-container-for-print">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={9}
                align="right"
                className="voucher-number-header"
              >
                <Typography>
                  {menuData?.voucher_number === null &&
                    (voucher === "check" ? "CV" : "JV") +
                      menuData?.apTagging?.vp +
                      formattedDate +
                      "-" +
                      (voucher === "check"
                        ? vpCheck.toString().padStart(4, "0")
                        : vpJournal.toString().padStart(4, "0"))}
                  {menuData?.voucher_number !== null &&
                    menuData?.voucher_number}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={4}
                align="center"
                className="voucher-name-header"
              >
                <Typography>RDF FEED, LIVESTOCK & FOODS, INC.</Typography>
              </TableCell>
              <TableCell
                colSpan={3}
                align="center"
                className="voucher-type-header"
              >
                <Typography>{voucher?.toUpperCase()} VOUCHER</Typography>
              </TableCell>
              <TableCell
                colSpan={2}
                align="left"
                className="voucher-payee-header"
              >
                <Typography className="payee-typo">
                  {voucher === "check" ? "PAYEE" : "SUPPLIERS"}
                </Typography>
                <Typography className="name-supplier-typo" align="center">
                  {voucherData?.supplier_name}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" className="voucher-payment-header">
                <Typography>Date</Typography>
              </TableCell>
              <TableCell
                colSpan={5}
                align="center"
                className="voucher-payment-header"
              >
                <Typography>
                  {voucher === "check" ? "Payment Details" : "Descriptions"}
                </Typography>
              </TableCell>
              <TableCell
                colSpan={2}
                className="voucher-empty-details"
              ></TableCell>
              <TableCell align="center" className="voucher-payment-header">
                <Typography>Amount</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {voucherData?.first_row?.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell
                    align="center"
                    className={
                      item === undefined
                        ? "voucher-empty-row-details"
                        : "voucher-payment-details"
                    }
                  >
                    {item !== undefined && <Typography>{item.date}</Typography>}
                  </TableCell>
                  <TableCell
                    align="left"
                    colSpan={5}
                    className={
                      item === undefined
                        ? "voucher-empty-row-details"
                        : "voucher-payment-details"
                    }
                  >
                    {item !== undefined && (
                      <Typography>
                        &nbsp;
                        {voucher === "check" ? "PAYMENT FOR" : "Reference No."}
                        &nbsp; {item?.invoice}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell
                    align="center"
                    className={
                      item === undefined
                        ? "voucher-empty-row-details"
                        : "voucher-payment-details"
                    }
                    colSpan={2}
                  />

                  <TableCell
                    align="center"
                    className={
                      item === undefined
                        ? "voucher-empty-row-details"
                        : "voucher-payment-details"
                    }
                  >
                    {item !== undefined && (
                      <Typography>
                        {convertToPeso(parseFloat(item?.amount).toFixed(2))}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}

            {voucher === "journal" && (
              <TableRow>
                <TableCell
                  align="center"
                  className={"voucher-empty-row-details"}
                ></TableCell>
                <TableCell
                  align="center"
                  colSpan={5}
                  className={"voucher-empty-row-details"}
                >
                  <Typography>
                    &nbsp;
                    {menuData?.remarks}
                    &nbsp;
                  </Typography>
                </TableCell>

                <TableCell
                  align="center"
                  className={"voucher-empty-row-details"}
                  colSpan={2}
                />

                <TableCell
                  align="center"
                  className={"voucher-empty-row-details"}
                ></TableCell>
              </TableRow>
            )}
            {voucherData?.first_row?.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell
                    colSpan={2}
                    className={
                      item === undefined
                        ? "voucher-empty-row-details"
                        : "voucher-empty-row-top-details"
                    }
                  />
                  <TableCell
                    colSpan={4}
                    className={
                      item === undefined
                        ? "voucher-empty-row-details"
                        : "voucher-empty-row-top-details"
                    }
                  >
                    {index === 2 && (
                      <Typography> &nbsp; &nbsp; &nbsp; &nbsp;Tag #</Typography>
                    )}
                  </TableCell>

                  <TableCell
                    colSpan={2}
                    className={
                      item === undefined
                        ? "voucher-empty-row-details"
                        : "voucher-empty-row-top-details"
                    }
                  />

                  <TableCell
                    className={
                      item === undefined
                        ? "voucher-empty-row-details"
                        : "voucher-empty-row-top-details"
                    }
                  />
                </TableRow>
              );
            })}
            {voucherData?.third_row?.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell
                    colSpan={2}
                    className={
                      index !== 0
                        ? "voucher-empty-row-details"
                        : "voucher-empty-row-top-details"
                    }
                  />
                  <TableCell
                    colSpan={4}
                    className={
                      index !== 0
                        ? "voucher-empty-row-details"
                        : "voucher-empty-row-top-details"
                    }
                  >
                    {item?.tag_no !== undefined && (
                      <Typography>&nbsp; {item?.tag_no}</Typography>
                    )}
                    {item?.time !== undefined && (
                      <Typography> &nbsp; &nbsp; {item?.time}</Typography>
                    )}
                  </TableCell>

                  <TableCell
                    colSpan={2}
                    className={
                      index !== 0
                        ? "voucher-empty-row-details"
                        : "voucher-empty-row-top-details"
                    }
                  />

                  <TableCell
                    className={
                      index !== 0
                        ? "voucher-empty-row-details"
                        : "voucher-empty-row-top-details"
                    }
                  />
                </TableRow>
              );
            })}
          </TableBody>
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={6}
                align="center"
                className="voucher-payment-header"
              >
                <Typography>ACCOUNT TITLE</Typography>
              </TableCell>
              <TableCell align="center" className="voucher-payment-header">
                <Typography> ACCT.CODE</Typography>
              </TableCell>
              <TableCell align="center" className="voucher-payment-header">
                <Typography>DEBIT</Typography>
              </TableCell>
              <TableCell align="center" className="voucher-payment-header">
                <Typography>CREDIT</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {voucherData?.coaArray.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell
                    align="left"
                    colSpan={6}
                    className="voucher-computation-details-border"
                  >
                    <Stack
                      display={"flex"}
                      flexDirection={"row"}
                      justifyContent={"space-between"}
                    >
                      {item !== undefined && (
                        <Typography
                          className={
                            item?.mode === "Debit"
                              ? "voucher-titles-typography"
                              : "voucher-titles-typography-indent"
                          }
                        >
                          {
                            accountTitles?.result?.find(
                              (titles) => item?.code === titles?.code
                            )?.name
                          }
                        </Typography>
                      )}
                      {item?.name === "WITHHOLDING TAX PAYABLE" && (
                        <Typography>{item?.wtax}</Typography>
                      )}
                    </Stack>
                  </TableCell>

                  <TableCell
                    align="center"
                    className="voucher-computation-details-border"
                  >
                    {item !== undefined && <Typography>{item.code}</Typography>}
                  </TableCell>
                  <TableCell
                    align="right"
                    className="voucher-computation-details-border"
                  >
                    {item !== undefined && (
                      <Typography>
                        {item?.mode === "Debit" &&
                          convertToPeso(parseFloat(item?.amount).toFixed(2))}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell
                    align="right"
                    className="voucher-computation-details-border"
                  >
                    {item !== undefined && (
                      <Typography>
                        {item?.mode === "Credit" &&
                          convertToPeso(parseFloat(item?.amount).toFixed(2))}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {voucher === "journal" && (
              <TableRow>
                <TableCell
                  align="left"
                  colSpan={6}
                  className="voucher-computation-details-border"
                ></TableCell>

                <TableCell
                  align="right"
                  className="voucher-computation-details-border"
                ></TableCell>
                <TableCell
                  align="left"
                  className="voucher-computation-details-border"
                >
                  <Stack flexDirection="row" justifyContent="space-between">
                    <Typography>&nbsp; Total:</Typography>
                    <Typography>
                      {convertToPeso(parseFloat(totalDebitAmount).toFixed(2))}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell
                  align="right"
                  className="voucher-computation-details-border"
                >
                  <Stack flexDirection="row" justifyContent="space-between">
                    <Typography> &nbsp; Total</Typography>
                    <Typography>
                      {convertToPeso(parseFloat(totalCreditAmount).toFixed(2))}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}

            <TableRow>
              <TableCell
                colSpan={3}
                align="left"
                className="voucher-payment-footer"
              >
                <Typography>Bank</Typography>
              </TableCell>
              <TableCell align="left" className="voucher-payment-footer">
                <Typography>Prepared by:</Typography>
              </TableCell>
              <TableCell align="center" className="voucher-payment-footer">
                <Typography>{voucherData?.preparedBy?.first_name}</Typography>
              </TableCell>
              <TableCell align="center" className="voucher-payment-footer">
                <Typography>Date</Typography>
              </TableCell>
              <TableCell align="center" className="voucher-payment-footer">
                <Typography>{moment(new Date()).format("MM/DD/YY")}</Typography>
              </TableCell>

              <TableCell
                colSpan={2}
                rowSpan={3}
                className="voucher-payment-footer-sign"
              >
                <Typography>
                  Payment Received (Signature Over Printed Name, Date)
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={3}
                align="left"
                className="voucher-payment-footer"
              >
                <Typography>Check No:</Typography>
              </TableCell>

              <TableCell
                align="left"
                colSpan={2}
                rowSpan={2}
                className={`voucher-payment-footer-approve ${
                  approved ? `approved` : ""
                }`}
              >
                <Typography> Approved by:</Typography>

                {approved && (
                  <Stack
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography>
                      {`${menuData?.approvedBy?.first_name} ${
                        menuData?.approvedBy?.last_name
                      } ${menuData?.approvedBy?.suffix || ""}`}
                    </Typography>
                  </Stack>
                )}
              </TableCell>
              <TableCell align="left" className="voucher-payment-footer">
                <Typography>{voucher === "check" ? "CV" : "JV"} NO.</Typography>
              </TableCell>
              <TableCell align="center" className="voucher-payment-footer">
                <Typography>
                  {menuData?.voucher_number === null &&
                    (voucher === "check" ? "CV" : "JV") +
                      menuData?.apTagging?.vp +
                      formattedDate +
                      "-" +
                      (voucher === "check"
                        ? vpCheck.toString().padStart(4, "0")
                        : vpJournal.toString().padStart(4, "0"))}
                  {menuData?.voucher_number !== null &&
                    menuData?.voucher_number}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={3}
                align="left"
                className="voucher-payment-footer"
              >
                <Typography>Date</Typography>
              </TableCell>
              <TableCell align="left" className="voucher-payment-footer">
                <Typography>Amount</Typography>
              </TableCell>
              <TableCell align="center" className="voucher-payment-footer">
                <Typography>
                  {convertToPeso(parseFloat(voucherData?.account).toFixed(2))}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box className="add-transaction-button-container">
        <Box className="return-receive-container">
          {!approved && (
            <Button
              variant="contained"
              color="error"
              className="add-transaction-button"
              // startIcon={<DeleteForeverOutlinedIcon />}
              onClick={() => dispatch(setReturn(true))}
            >
              Return
            </Button>
          )}

          <Button
            variant="contained"
            color="success"
            className="add-transaction-button"
            // startIcon={<DeleteForeverOutlinedIcon />}
            onClick={() => dispatch(setComputationMenu(true))}
          >
            Details
          </Button>

          {approved && ap && (
            <ReactToPrint
              trigger={() => (
                <Button
                  variant="contained"
                  color="warning"
                  className="add-transaction-button"
                  // startIcon={<DeleteForeverOutlinedIcon />}
                >
                  Print Voucher
                </Button>
              )}
              content={() => componentRef.current}
            />
          )}
          {approved && ap && !printable && (
            <Button
              variant="contained"
              color="success"
              className="add-transaction-button"
              // startIcon={<DeleteForeverOutlinedIcon />}
              onClick={() => dispatch(setFromBIR(true))}
            >
              Print 2307
            </Button>
          )}
        </Box>
        <Box className="archive-transaction-button-container">
          {!approved && (
            <LoadingButton
              variant="contained"
              color="warning"
              onClick={approveHandler}
              className="add-transaction-button"
            >
              Approve
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
      <Dialog
        open={
          loadingTIN ||
          loadingTax ||
          loadingTitles ||
          loadingLogs ||
          loadingReturn ||
          loadingApprove ||
          loadingType ||
          loadingReturnJournal ||
          loadingApproveJournal ||
          loadingVp ||
          loadingJournalVP ||
          loadingApproveTransaction
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
            "Please note that this entry will be forwarded back to Accounts Payable (AP) for further processing. Kindly provide a reason for this action."
          }
          confirmButton={"Confirm"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          confirmOnClick={(e) => returnHandler(e)}
        />
      </Dialog>

      <Dialog open={formBIR} className="transaction-modal-dialog">
        <Form2307 />
      </Dialog>

      <Dialog open={computationMenu} className="transaction-modal-dialog-tax">
        <ComputationMenu details />
      </Dialog>

      {/* <Dialog open={createTax} className="transaction-modal-dialog">
        <TaxComputation create taxComputation={taxComputation} />
      </Dialog>

      <Dialog open={updateTax} className="transaction-modal-dialog">
        <TaxComputation update taxComputation={taxComputation} />
      </Dialog> */}

      <TransactionDrawer transactionData={menuData?.transactions} />
    </Paper>
  );
};

export default TransactionModalApprover;
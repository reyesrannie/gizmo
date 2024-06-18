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

import "../../styles/TransactionModal.scss";
import "../../styles/TransactionModalApprover.scss";
import { LoadingButton } from "@mui/lab";
import {
  resetMenu,
  setComputationMenu,
  setViewAccountingEntries,
} from "../../../services/slice/menuSlice";
import { resetOption } from "../../../services/slice/optionsSlice";
import { resetPrompt, setReturn } from "../../../services/slice/promptSlice";

import {
  useAccountTitlesQuery,
  useApproveSchedTransactionMutation,
  useDocumentTypeQuery,
  useReturnSchedTransactionMutation,
  useStatusScheduleLogsQuery,
  useSupplierQuery,
  useSupplierTypeQuery,
  useTaxComputationQuery,
  useUsersQuery,
} from "../../../services/store/request";
import { setVoucherData } from "../../../services/slice/transactionSlice";
import moment from "moment";
import {
  arrayFieldThree,
  coaArrays,
  schedArrayOne,
} from "../../../services/functions/toArrayFn";

import TransactionDrawer from "../TransactionDrawer";
import ReasonInput from "../ReasonInput";
import { enqueueSnackbar } from "notistack";
import { singleError } from "../../../services/functions/errorResponse";
import ComputationMenu from "./ComputationMenu";
import socket from "../../../services/functions/serverSocket";

const ScheduleTransactionApproverModal = ({
  view,
  update,
  approved,
  ap,
  viewAccountingEntries,
  voiding,
}) => {
  const dispatch = useDispatch();
  const isReturn = useSelector((state) => state.prompt.return);
  const menuData = useSelector((state) => state.menu.menuData);
  const computationMenu = useSelector((state) => state.menu.computationMenu);

  const voucherData = useSelector((state) => state.transaction.voucherData);

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
    data: taxComputation,
    isLoading: loadingTax,
    isSuccess: taxSuccess,
  } = useTaxComputationQuery(
    {
      status: "active",
      schedule_id: menuData?.id,
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
  } = useStatusScheduleLogsQuery(
    {
      schedule_id: menuData?.id,
      sorts: "created_at",
      pagination: "none",
    },
    { skip: menuData === null }
  );

  const { data: user, isSuccess: successUser } = useUsersQuery({
    status: "active",
    pagination: "none",
  });

  const [returnCheckEntry, { isLoading: loadingReturn }] =
    useReturnSchedTransactionMutation();

  const [approveCheckEntry, { isLoading: loadingApprove }] =
    useApproveSchedTransactionMutation();

  useEffect(() => {
    if (
      taxSuccess &&
      supplySuccess &&
      successTitles &&
      typeSuccess &&
      successLogs &&
      successUser &&
      documentSuccess
    ) {
      const sumAmount = taxComputation?.result?.reduce((acc, curr) => {
        return parseFloat(curr.credit)
          ? acc - parseFloat(0)
          : acc + parseFloat(curr.account);
      }, 0);

      const supplier = tin?.result?.find(
        (item) => menuData?.supplier?.id === item?.id
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
        (stat) => stat?.state === "For Approval"
      );

      const rowThree = arrayFieldThree(menuData);
      const row = schedArrayOne(menuData, sumAmount, document);
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
        preparedBy:
          user?.result?.find(
            (users) => preparedBy?.updated_by_id === users?.id
          ) || null,
        approvedBy:
          user?.result?.find(
            (users) => menuData?.approved_by_id === users?.id
          ) || null,
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
    documentSuccess,
    document,
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
      const res = await returnCheckEntry(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      socket.emit("schedule_returned");
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const approveHandler = async () => {
    const obj = {
      id: menuData?.id,
    };

    try {
      const res = await approveCheckEntry(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      socket.emit("schedule_approved");
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const componentRef = useRef();

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
              ></TableCell>
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
                <Typography>CHECK VOUCHER</Typography>
              </TableCell>
              <TableCell
                colSpan={2}
                align="left"
                className="voucher-payee-header"
              >
                <Typography className="payee-typo">PAYEE</Typography>
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
                <Typography>Payment Details</Typography>
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
                        &nbsp; PAYMENT FOR &nbsp; {item?.invoice}
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
                      marginRight={1}
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
                  voiding || approved ? `approved` : ""
                }`}
              >
                <Typography> Approved by:</Typography>

                <Stack
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {voucherData?.approvedBy !== null && (
                    <Typography>
                      {`${voucherData?.approvedBy?.first_name} ${
                        voucherData?.approvedBy?.last_name
                      } ${voucherData?.approvedBy?.suffix || ""}`}
                    </Typography>
                  )}
                </Stack>
              </TableCell>
              <TableCell align="left" className="voucher-payment-footer">
                <Typography>CV NO.</Typography>
              </TableCell>
              <TableCell
                align="center"
                className="voucher-payment-footer"
              ></TableCell>
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
        <Typography className="disclaimer-voucher-signature">
          **This voucher is system-generated and does not require a signature.**
        </Typography>
      </TableContainer>

      <Box className="add-transaction-button-container">
        <Box className="return-receive-container">
          {!approved && !viewAccountingEntries && (
            <Button
              variant="contained"
              color="error"
              className="add-transaction-button"
              onClick={() => dispatch(setReturn(true))}
            >
              Return
            </Button>
          )}

          {!viewAccountingEntries && (
            <Button
              variant="contained"
              color="success"
              className="add-transaction-button"
              onClick={() => dispatch(setComputationMenu(true))}
            >
              Details
            </Button>
          )}
        </Box>
        <Box className="archive-transaction-button-container">
          {!approved && !viewAccountingEntries && !voiding && (
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
              !viewAccountingEntries && dispatch(resetMenu());
              !viewAccountingEntries && dispatch(resetOption());
              viewAccountingEntries &&
                dispatch(setViewAccountingEntries(false));
            }}
            className="add-transaction-button"
          >
            {view || viewAccountingEntries
              ? "Close"
              : update
              ? "Cancel"
              : "Cancel"}
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
          loadingType
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
      <Dialog open={computationMenu} className="transaction-modal-dialog-tax">
        <ComputationMenu details schedule />
      </Dialog>

      <TransactionDrawer schedule />
    </Paper>
  );
};

export default ScheduleTransactionApproverModal;

import React, { useEffect } from "react";

import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

import "../../styles/TransactionModal.scss";
import "../../styles/TransactionModalApprover.scss";
import { LoadingButton } from "@mui/lab";
import { resetMenu } from "../../../services/slice/menuSlice";
import { resetOption } from "../../../services/slice/optionsSlice";
import { setReturn } from "../../../services/slice/promptSlice";
import {
  useSupplierQuery,
  useTaxComputationQuery,
} from "../../../services/store/request";
import { setVoucherData } from "../../../services/slice/transactionSlice";

const TransactionModalApprover = ({ view, update, receive, checked }) => {
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const voucher = useSelector((state) => state.options.voucher);

  const row = ["1", "2", "3"];
  const rowFive = ["1", "2", "3", "4", "5"];
  const acctTitle = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

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

  useEffect(() => {
    if (taxSuccess) {
      dispatch(setVoucherData());
    }
  }, [taxSuccess, taxComputation, dispatch, setVoucherData]);

  console.log(
    tin?.result?.find(
      (item) => menuData?.transactions?.supplier_id === item?.id
    )
  );

  return (
    <Paper className="transaction-modal-container">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={9}
                align="right"
                className="voucher-number-header"
              >
                <Typography>{menuData?.voucher_number}</Typography>
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
                <Typography className="payee-typo">PAYEE</Typography>
                <Typography className="name-supplier-typo" align="center">
                  HEBBORN BIOTECHNOLOGY AND LOGISTIC SERVICES INC.
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
            {row?.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell
                    align="center"
                    className={
                      item !== "1"
                        ? "voucher-empty-row-details"
                        : "voucher-payment-details"
                    }
                  >
                    {item === "1" && <Typography>01/12/24</Typography>}
                  </TableCell>
                  <TableCell
                    align="left"
                    colSpan={5}
                    className={
                      item !== "1"
                        ? "voucher-empty-row-details"
                        : "voucher-payment-details"
                    }
                  >
                    {item === "1" && (
                      <Typography>
                        &nbsp; PAYMENT FOR &nbsp; SI 0648, DR 0151 PO-34144
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell
                    align="center"
                    className={
                      item !== "1"
                        ? "voucher-empty-row-details"
                        : "voucher-payment-details"
                    }
                    colSpan={2}
                  ></TableCell>

                  <TableCell
                    align="center"
                    className={
                      item !== "1"
                        ? "voucher-empty-row-details"
                        : "voucher-payment-details"
                    }
                  >
                    {item === "1" && <Typography>58,473.21</Typography>}
                  </TableCell>
                </TableRow>
              );
            })}
            {row?.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell
                    colSpan={2}
                    className={
                      item !== "1"
                        ? "voucher-empty-row-details"
                        : "voucher-empty-row-top-details"
                    }
                  />
                  <TableCell
                    colSpan={4}
                    className={
                      item !== "1"
                        ? "voucher-empty-row-details"
                        : "voucher-empty-row-top-details"
                    }
                  >
                    {item === "3" && (
                      <Typography> &nbsp; &nbsp; &nbsp; &nbsp;Tag #</Typography>
                    )}
                  </TableCell>

                  <TableCell
                    colSpan={2}
                    className={
                      item !== "1"
                        ? "voucher-empty-row-details"
                        : "voucher-empty-row-top-details"
                    }
                  />

                  <TableCell
                    className={
                      item !== "1"
                        ? "voucher-empty-row-details"
                        : "voucher-empty-row-top-details"
                    }
                  />
                </TableRow>
              );
            })}
            {rowFive?.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell
                    colSpan={2}
                    className={
                      item !== "1"
                        ? "voucher-empty-row-details"
                        : "voucher-empty-row-top-details"
                    }
                  />
                  <TableCell
                    colSpan={4}
                    className={
                      item !== "1"
                        ? "voucher-empty-row-details"
                        : "voucher-empty-row-top-details"
                    }
                  >
                    {item === "1" && <Typography>&nbsp; 2401-0638</Typography>}
                    {item === "2" && (
                      <Typography> &nbsp; &nbsp; 3:50 pm</Typography>
                    )}
                  </TableCell>

                  <TableCell
                    colSpan={2}
                    className={
                      item !== "1"
                        ? "voucher-empty-row-details"
                        : "voucher-empty-row-top-details"
                    }
                  />

                  <TableCell
                    className={
                      item !== "1"
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
            {acctTitle?.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell
                    align="left"
                    colSpan={6}
                    className="voucher-computation-details-border"
                  >
                    {index === 3 && (
                      <Typography className="voucher-titles-typography">
                        GA - OTHER SUPPLIES EXPENSE
                      </Typography>
                    )}
                    {index === 4 && (
                      <Typography className="voucher-titles-typography">
                        INPUT TAX
                      </Typography>
                    )}
                    {index === 5 && (
                      <Typography className="voucher-titles-typography-indent">
                        WITHHOLDING TAX PAYABLE - EXPANDED
                      </Typography>
                    )}
                    {index === 6 && (
                      <Typography className="voucher-titles-typography-indent">
                        ACCOUNTS PAYABLE
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell
                    align="center"
                    className="voucher-computation-details-border"
                  >
                    {index === 3 && <Typography>531300</Typography>}
                    {index === 4 && <Typography>531300</Typography>}
                    {index === 5 && <Typography>531300</Typography>}
                    {index === 6 && <Typography>531300</Typography>}
                  </TableCell>
                  <TableCell
                    align="center"
                    className="voucher-computation-details-border"
                  >
                    {index === 3 && <Typography>531300</Typography>}
                    {index === 4 && <Typography>531300</Typography>}
                    {index === 5 && <Typography>531300</Typography>}
                    {index === 6 && <Typography>531300</Typography>}
                  </TableCell>
                  <TableCell
                    align="center"
                    className="voucher-computation-details-border"
                  >
                    {index === 3 && <Typography>531300</Typography>}
                    {index === 4 && <Typography>531300</Typography>}
                    {index === 5 && <Typography>531300</Typography>}
                    {index === 6 && <Typography>531300</Typography>}
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
                <Typography>TRISHA</Typography>
              </TableCell>
              <TableCell align="center" className="voucher-payment-footer">
                <Typography>Date</Typography>
              </TableCell>
              <TableCell align="center" className="voucher-payment-footer">
                <Typography>01/24/24</Typography>
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
                className="voucher-payment-footer"
              >
                <Typography> Approve by:</Typography>
              </TableCell>
              <TableCell align="left" className="voucher-payment-footer">
                <Typography>CV NO.</Typography>
              </TableCell>
              <TableCell align="center" className="voucher-payment-footer">
                <Typography>GA2024-01-088</Typography>
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
                <Typography>58,473.21</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box className="add-transaction-button-container">
        <Box className="return-receive-container">
          <Button
            variant="contained"
            color="error"
            className="add-transaction-button"
            // startIcon={<DeleteForeverOutlinedIcon />}
            onClick={() => dispatch(setReturn(true))}
          >
            Return
          </Button>
        </Box>
        <Box className="archive-transaction-button-container">
          <LoadingButton
            variant="contained"
            color="warning"
            type="submit"
            className="add-transaction-button"
          >
            Approve
          </LoadingButton>
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
      {/* <Dialog
        open={
          loadingTIN ||
          loadingDocument ||
          loadingAccountNumber ||
          loadingLocation ||
          loadingAtc ||
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
      </Dialog> */}

      {/* <Dialog open={isReturn}>
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

      <Dialog open={createTax} className="transaction-modal-dialog">
        <TaxComputation create taxComputation={taxComputation} />
      </Dialog>

      <Dialog open={updateTax} className="transaction-modal-dialog">
        <TaxComputation update taxComputation={taxComputation} />
      </Dialog> */}
    </Paper>
  );
};

export default TransactionModalApprover;

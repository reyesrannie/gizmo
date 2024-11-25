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

import loading from "../../assets/lottie/Loading-2.json";
import moment from "moment";
import {
  arrayFieldOne,
  arrayFieldThree,
  coaArrays,
} from "../../services/functions/toArrayFn";
import ReactToPrint from "react-to-print";

import { totalAccount } from "../../services/functions/compute";
import Lottie from "lottie-react";
import { setMenuDataMultiple } from "../../services/slice/menuSlice";
import { useUsersQuery } from "../../services/api/authApi";
import { useSupplierTypeQuery } from "../../services/api/supplierTypeApi";
import { useSupplierQuery } from "../../services/api/supplierApi";
import { useDocumentTypeQuery } from "../../services/api/documentTypeApi";
import { useAccountTitlesQuery } from "../../services/api/coaApi";
import {
  useStatusLogsQuery,
  useVpCheckNumberQuery,
} from "../../services/api/vouchersPayableApi";
import { useTaxComputationQuery } from "../../services/api/taxComputationApi";

const MultipleVoucherPrinting = ({ afterPrint }) => {
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const menuDataMultiple = useSelector((state) => state.menu.menuDataMultiple);

  const voucher = useSelector((state) => state.options.voucher);

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
  } = useTaxComputationQuery({
    status: "active",
    transaction_id:
      voucher === "gj"
        ? []
        : menuDataMultiple?.map((item) => item?.transactions?.id),
    gj_id: voucher !== "gj" ? "" : menuData?.id,
    voucher: voucher,
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
      transaction_id: menuDataMultiple?.map((item) => item?.transactions?.id),
      sorts: "created_at",
      pagination: "none",
    },
    { skip: menuDataMultiple?.length === 0 }
  );

  const { data: user, isSuccess: successUser } = useUsersQuery({
    status: "active",
    pagination: "none",
  });

  const { data: vpCheckNumber, isLoading: loadingVp } = useVpCheckNumberQuery(
    {
      yearMonth: menuData?.tag_year,
    },
    {
      skip: voucher === "journal" || voucher === null || menuData === null,
    }
  );

  const convertToPeso = (value) => {
    return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const componentRef = useRef();

  const vpCheck = parseInt(vpCheckNumber?.result) + 1;

  const year = Math.floor(menuData?.transactions?.tag_year / 100);
  const month = menuData?.transactions?.tag_year % 100;
  const formattedDate = `20${year}-${month.toString().padStart(2, "0")}`;

  return (
    <Paper className="transaction-modal-container">
      <Box ref={componentRef}>
        {menuDataMultiple?.map((menuData, index) => {
          const voucherItems = () => {
            const taxItems = taxComputation?.result
              ? {
                  result: taxComputation.result.filter(
                    (item) =>
                      item?.transaction_id === menuData?.transactions?.id
                  ),
                }
              : { result: [] };
            const sumAmount = totalAccount(taxItems);
            const supplier = tin?.result?.find(
              (item) => menuData?.transactions?.supplier?.id === item?.id
            );

            const coa = taxItems?.result?.map((item) => {
              const checkCOa = accountTitles?.result?.find(
                (coa) => item?.coa_id === coa?.id
              );
              return {
                ...item,
                coa: checkCOa,
              };
            });

            const supTypePercent = taxItems?.result?.map((item) =>
              supplierType?.result?.find((sup) => item?.stype_id === sup?.id)
            );

            const coa_id = accountTitles?.result?.find(
              (item) => menuData?.coa?.id === item?.id
            );

            const preparedBy = logs?.result?.find(
              (stat) =>
                stat?.status === "For Approval" &&
                stat?.transaction_id === menuData?.transactions?.id
            );

            const receivedBy = logs?.result
              ?.filter((stat) => stat?.status === "received")
              ?.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
              )[0];

            const rowThree = arrayFieldThree(menuData, receivedBy);
            const row = arrayFieldOne(menuData, sumAmount, voucher, document);
            const arrayCoa = coaArrays(coa, taxItems, supTypePercent, coa_id);

            const obj = {
              supplier_name: supplier?.company_name,
              first_row: row,
              third_row: rowThree,
              coaArray: arrayCoa,
              preparedBy: user?.result?.find(
                (users) => preparedBy?.updated_by_id === users?.id
              ),
              account: sumAmount,
              dateCreated: receivedBy,
            };

            return obj;
          };

          const totalDebitAmount = voucherItems()?.coaArray.reduce(
            (total, item) =>
              item?.mode === "Debit" ? total + parseFloat(item?.amount) : total,
            0
          );

          const totalCreditAmount = voucherItems()?.coaArray.reduce(
            (total, item) =>
              item?.mode === "Credit"
                ? total + parseFloat(item?.amount)
                : total,
            0
          );

          return (
            <TableContainer
              key={index}
              className="table-container-for-print-multiple"
            >
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
                          (voucher === "check" ? "VPRL" : "GJRL") +
                            formattedDate +
                            "-" +
                            vpCheck.toString().padStart(4, "0")}
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
                      <Typography>
                        {voucher === "check"
                          ? "VOUCHER'S PAYABLE"
                          : "GENERAL JOURNAL"}
                      </Typography>
                    </TableCell>
                    <TableCell
                      colSpan={2}
                      align="left"
                      className="voucher-payee-header"
                    >
                      <Typography className="payee-typo">
                        {voucher === "check" ? "PAYEE" : "SUPPLIERS"}
                      </Typography>
                      <Typography
                        className="name-supplier-typo"
                        align="center"
                        sx={{
                          fontSize: `${
                            voucherItems()?.supplier_name?.length <= 40 ? 12 : 8
                          }px`,
                        }}
                      >
                        {voucherItems()?.supplier_name}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      align="center"
                      className="voucher-payment-header"
                    >
                      <Typography>Date</Typography>
                    </TableCell>
                    <TableCell
                      colSpan={5}
                      align="center"
                      className="voucher-payment-header"
                    >
                      <Typography>
                        {voucher === "check"
                          ? "Payment Details"
                          : "Descriptions"}
                      </Typography>
                    </TableCell>
                    <TableCell
                      colSpan={2}
                      className="voucher-empty-details"
                    ></TableCell>
                    <TableCell
                      align="center"
                      className="voucher-payment-header"
                    >
                      <Typography>Amount</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {voucherItems()?.first_row?.map((item, index) => {
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
                          {item !== undefined && (
                            <Typography>{item.date}</Typography>
                          )}
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
                              {voucher === "check"
                                ? "PAYMENT FOR"
                                : "Reference No."}
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
                              {convertToPeso(
                                parseFloat(item?.amount).toFixed(2)
                              )}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {voucher === "gj" && (
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
                  {voucherItems()?.first_row?.map((item, index) => {
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
                            <Typography>
                              {" "}
                              &nbsp; &nbsp; &nbsp; &nbsp;Tag #
                            </Typography>
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
                  {voucherItems()?.third_row?.map((item, index) => {
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
                    <TableCell
                      align="center"
                      className="voucher-payment-header"
                    >
                      <Typography> ACCT.CODE</Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      className="voucher-payment-header"
                    >
                      <Typography>DEBIT</Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      className="voucher-payment-header"
                    >
                      <Typography>CREDIT</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {voucherItems()?.coaArray.map((item, index) => {
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
                          {item !== undefined && (
                            <Typography>{item.code}</Typography>
                          )}
                        </TableCell>
                        <TableCell
                          align="right"
                          className="voucher-computation-details-border"
                        >
                          {item !== undefined && (
                            <Typography>
                              {item?.mode === "Debit" &&
                                convertToPeso(
                                  parseFloat(item?.amount).toFixed(2)
                                )}
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
                                convertToPeso(
                                  parseFloat(item?.amount).toFixed(2)
                                )}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {voucher === "gj" && (
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
                        <Stack
                          flexDirection="row"
                          justifyContent="space-between"
                        >
                          <Typography>&nbsp; Total:</Typography>
                          <Typography>
                            {convertToPeso(
                              parseFloat(totalDebitAmount).toFixed(2)
                            )}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell
                        align="right"
                        className="voucher-computation-details-border"
                      >
                        <Stack
                          flexDirection="row"
                          justifyContent="space-between"
                        >
                          <Typography> &nbsp; Total</Typography>
                          <Typography>
                            {convertToPeso(
                              parseFloat(totalCreditAmount).toFixed(2)
                            )}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}

                  <TableRow>
                    <TableCell
                      colSpan={2}
                      align={"left"}
                      className="voucher-payment-footer"
                    >
                      <Typography>Prepared by:</Typography>
                    </TableCell>

                    <TableCell
                      colSpan={3}
                      align="center"
                      className="voucher-payment-footer prepared"
                    >
                      <Typography>
                        {voucherItems()?.preparedBy?.first_name}
                      </Typography>
                    </TableCell>
                    <TableCell align="left" className="voucher-payment-footer">
                      <Typography>Date</Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      className="voucher-payment-footer"
                    >
                      <Typography>
                        {moment(voucherItems()?.dateCreated?.created_at).format(
                          "MM/DD/YY"
                        )}
                      </Typography>
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
                      align="left"
                      colSpan={5}
                      rowSpan={2}
                      className={`voucher-payment-footer-approve ${
                        menuData?.state === "For Voiding" ||
                        menuData?.state === "approved"
                          ? `approved`
                          : ""
                      }`}
                    >
                      <Typography> Approved by:</Typography>

                      <Stack
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {menuData?.approvedBy?.first_name !== undefined && (
                          <Typography>
                            {`${menuData?.approvedBy?.first_name} ${
                              menuData?.approvedBy?.last_name
                            } ${menuData?.approvedBy?.suffix || ""}`}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="left" className="voucher-payment-footer">
                      <Typography>
                        {voucher === "check" ? "VP" : "GJ"} NO.
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      className="voucher-payment-footer"
                    >
                      <Typography>
                        {menuData?.voucher_number === null &&
                          (voucher === "check" ? "VPRL" : "GJRL") +
                            formattedDate +
                            "-" +
                            vpCheck.toString().padStart(4, "0")}
                        {menuData?.voucher_number !== null &&
                          menuData?.voucher_number}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left" className="voucher-payment-footer">
                      <Typography>Amount</Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      className="voucher-payment-footer"
                    >
                      <Typography>
                        {convertToPeso(
                          parseFloat(voucherItems()?.account).toFixed(2)
                        )}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Typography className="disclaimer-voucher-signature">
                **This voucher is system-generated and does not require a
                signature.**
              </Typography>
            </TableContainer>
          );
        })}
      </Box>

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
        onAfterPrint={afterPrint}
      />

      {/* <ReactToPrint
        trigger={() => (
          <Button
            variant="contained"
            color="warning"
            className="add-transaction-button"
          >
            Print Voucher
          </Button>
        )}
        content={() => componentRef.current}
        onAfterPrint={() => {
          if (!hasPrinted.current) {
            console.log("First print completed");
            handleSecondPrint();
            hasPrinted.current = true; // Mark as printed to avoid retriggering
          }
        }}
      />

      <ReactToPrint
        trigger={() => <></>}
        content={() => print2307Ref.current}
        ref={secondPrintRef}
      />

      <Print2307 ref={print2307Ref} /> */}

      <Dialog
        open={
          loadingTIN ||
          loadingTax ||
          loadingTitles ||
          loadingLogs ||
          loadingType ||
          loadingVp
        }
        className="loading-transaction-create"
      >
        <Lottie animationData={loading} loop />
      </Dialog>
    </Paper>
  );
};

export default MultipleVoucherPrinting;

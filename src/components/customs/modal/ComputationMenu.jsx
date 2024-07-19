import React from "react";
import "../../styles/TransactionModal.scss";
import "../../styles/TagTransaction.scss";
import "../../styles/Supplier.scss";

import {
  Paper,
  Typography,
  Box,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  Stack,
  Divider,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import {
  useApQuery,
  useAtcQuery,
  useDocumentTypeQuery,
  useLocationQuery,
  useSupplierQuery,
  useTaxComputationQuery,
} from "../../../services/store/request";
import { setComputationMenu } from "../../../services/slice/menuSlice";
import loading from "../../../assets/lottie/Loading-2.json";
import noData from "../../../assets/lottie/NoData.json";

import vat from "../../../assets/svg/vat.svg";
import Lottie from "lottie-react";
import {
  totalAccountPaginated,
  totalCredit,
  totalVat,
} from "../../../services/functions/compute";

const ComputationMenu = ({ details, schedule }) => {
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const voucher = useSelector((state) => state.options.voucher);

  const {
    data: taxComputation,
    isLoading: loadingTax,
    status,
    isError,
    isSuccess: successTax,
  } = useTaxComputationQuery(
    {
      status: "active",
      transaction_id: schedule ? "" : menuData?.transactions?.id,
      schedule_id: schedule ? menuData?.id : "",
      voucher: schedule ? "" : voucher,
    },
    { skip: menuData === null }
  );

  const {
    data: supplier,
    isLoading: loadingSupplier,
    isSuccess: successSupplier,
  } = useSupplierQuery({
    status: "active",
    pagination: "none",
  });

  const {
    data: ap,
    isLoading: loadingAP,
    isSuccess: successAP,
  } = useApQuery({ status: "active", pagination: "none" });

  const {
    data: document,
    isLoading: loadingDocument,
    isSuccess: documentSuccess,
  } = useDocumentTypeQuery({
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
    data: atc,
    isLoading: loadingAtc,
    isSuccess: atcSuccess,
  } = useAtcQuery({
    status: "active",
    pagination: "none",
  });

  const convertToPeso = (value) => {
    return parseFloat(value)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const debit = totalVat(taxComputation, "debit");
  const credit = totalCredit(taxComputation, "credit");
  const wtax = totalCredit(taxComputation, "wtax_payable_cr");
  const vatInput = totalVat(taxComputation, "vat_input_tax");

  const supplierDetails = schedule
    ? supplier?.result?.find((item) => menuData?.supplier?.id === item?.id)
    : supplier?.result?.find((item) => menuData?.supplier?.id === item?.id);

  const documentDetails = schedule
    ? document?.result?.find((item) => menuData?.document_type_id === item?.id)
    : document?.result?.find(
        (item) => menuData?.transactions?.document_type_id === item?.id
      );

  const apDetails = schedule
    ? ap?.result?.find((item) => menuData?.ap_tagging_id === item?.id)
    : ap?.result?.find(
        (item) => menuData?.transactions?.ap_tagging === item?.company_code
      );

  const locationDetails = schedule
    ? location?.result?.find((item) => menuData?.location_id === item?.id)
    : location?.result?.find((item) => menuData?.location === item?.id);

  const atcDetails = schedule
    ? atc?.result?.find((item) => menuData?.atc_id === item?.id)
    : atc?.result?.find((item) => menuData?.atc === item?.id);

  return (
    <Paper className="transaction-modal-container">
      <img
        src={vat}
        alt="vat"
        className="transaction-image"
        draggable="false"
      />
      <Typography className="transaction-text">
        {!details ? "Total Tax Computation" : "Complete Details"}
      </Typography>
      {details &&
        successAP &&
        successTax &&
        successSupplier &&
        locationSuccess &&
        documentSuccess &&
        atcSuccess && (
          <TableContainer className="tag-transaction-table-container">
            <Table stickyHeader>
              <TableHead>
                <TableRow className="table-header1-import-tag-transaction">
                  <TableCell>Tag #.</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell align="center">Invoice</TableCell>
                  <TableCell align="center">Description</TableCell>
                  <TableCell align="center">Allocation</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow className="table-body-tag-transaction">
                  <TableCell>
                    {`${menuData?.transactions?.tag_year} - ${menuData?.transactions?.tag_no}`}
                  </TableCell>
                  <TableCell>
                    <Stack>
                      <Typography className="supplier-company-name">
                        {schedule
                          ? menuData?.supplier?.name
                          : menuData?.transactions?.supplier?.name}
                      </Typography>
                      <Typography className="supplier-company-tin">
                        {schedule
                          ? menuData?.supplier?.tin
                          : menuData?.transactions?.supplier?.tin}
                      </Typography>
                      <Typography className="supplier-company-address">
                        {schedule
                          ? menuData?.supplier?.address
                          : menuData?.transactions?.supplier?.address}
                      </Typography>
                      <Typography className="supplier-company-proprietor">
                        {menuData?.transactions?.supplier?.proprietor !== null
                          ? menuData?.transactions?.supplier?.proprietor
                          : ""}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack>
                      <Typography className="supplier-company-name">
                        {!schedule && menuData?.transactions?.invoice_no}
                      </Typography>
                      <Typography className="supplier-company-money">
                        {convertToPeso(
                          schedule
                            ? menuData?.month_amount
                            : menuData?.transactions?.purchase_amount
                        )}
                      </Typography>

                      <Typography className="supplier-company-address">
                        {atcDetails?.code}
                      </Typography>
                      <Typography className="supplier-company-address">
                        {documentDetails?.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Typography className="supplier-company-address">
                      {schedule
                        ? menuData?.description
                        : menuData?.transactions?.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack>
                      <Typography className="supplier-company-name">
                        {!schedule && menuData?.transactions?.ap_tagging} -
                        {!schedule && menuData?.transactions?.tag_year}
                      </Typography>
                      <Typography className="supplier-company-tin">
                        {apDetails?.description}
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}

      <Divider orientation="horizontal" className="transaction-devider-menu" />

      <TableContainer className="tag-transaction-table-container">
        <Table stickyHeader>
          <TableHead>
            <TableRow className="table-header1-import-tag-transaction">
              <TableCell>Line</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Account Title</TableCell>
              <TableCell>ATC</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Supplier Type</TableCell>
              <TableCell align="center">Amount</TableCell>
              <TableCell align="center">Input Tax</TableCell>
              <TableCell align="center">Debit</TableCell>
              <TableCell align="center">WTax Payable Expanded</TableCell>
              <TableCell align="center">Credit</TableCell>

              <TableCell align="center">
                {voucher === "check" ? "Check Amount" : "Total Amount"}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loadingDocument ||
            loadingAP ||
            loadingSupplier ||
            loadingTax ||
            loadingLocation ||
            loadingAtc ||
            status === "pending" ? (
              <TableRow>
                <TableCell colSpan={16} align="center">
                  <Lottie
                    animationData={loading}
                    className="loading-tag-transaction"
                  />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={16} align="center">
                  <Lottie
                    animationData={noData}
                    className="no-data-tag-transaction"
                  />
                </TableCell>
              </TableRow>
            ) : (
              taxComputation?.result?.data?.map((tax, index) => {
                const loc =
                  location?.result?.find(
                    (item) => tax?.location_id === item?.id
                  ) || null;

                return (
                  <TableRow className="table-body-tag-transaction" key={index}>
                    <TableCell>
                      <Typography className="tag-transaction-company-type">
                        {index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography className="tag-transaction-company-type">
                        {loc !== null && `${loc?.code} - ${loc?.name}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography className="tag-transaction-company-type">
                        {tax?.coa?.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography className="tag-transaction-company-type">
                        {tax?.atc?.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography className="tag-transaction-company-type">
                        {tax?.remarks}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography className="tag-transaction-company-type">
                        {tax?.supplierType?.code}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography className="tag-transaction-company-type">
                        {convertToPeso(tax?.total_invoice_amount)}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography className="tag-transaction-company-type">
                        {convertToPeso(tax?.vat_input_tax)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography className="tag-transaction-company-type">
                        {convertToPeso(tax?.debit)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography className="tag-transaction-company-type">
                        {convertToPeso(tax?.wtax_payable_cr)}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography className="tag-transaction-company-type">
                        {convertToPeso(tax?.credit)}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Typography className="tag-transaction-company-type">
                        {tax?.credit !== 0
                          ? `-${convertToPeso(tax?.account)}`
                          : convertToPeso(tax?.account)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })
            )}

            {!isError && !loadingTax && (
              <TableRow className="table-body-tag-transaction">
                <TableCell align="center" colSpan={8} />
                <TableCell align="center">
                  <Typography className="tag-transaction-company-type">
                    Total Debit
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography className="tag-transaction-company-type">
                    {convertToPeso(vatInput + debit)}
                  </Typography>
                </TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            )}

            {!isError && !loadingTax && (
              <TableRow className="table-body-tag-transaction">
                <TableCell align="center" colSpan={8} />
                <TableCell align="center">
                  <Typography className="tag-transaction-company-type">
                    Total Credit
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography className="tag-transaction-company-type">
                    {convertToPeso(wtax + credit)}
                  </Typography>
                </TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            )}

            {!isError && !loadingTax && (
              <TableRow className="table-body-tag-transaction">
                <TableCell align="center" colSpan={8} />
                <TableCell align="right">
                  <Typography className="tag-transaction-company-type">
                    Total
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography className="tag-transaction-company-type">
                    {convertToPeso(totalAccountPaginated(taxComputation))}
                  </Typography>
                </TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="tax-computation-button-container">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            dispatch(setComputationMenu(false));
          }}
          className="add-transaction-button"
        >
          Close
        </Button>
      </Box>
    </Paper>
  );
};

export default ComputationMenu;

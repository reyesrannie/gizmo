import {
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
import React from "react";
import { useSelector } from "react-redux";
import { AdditionalFunction } from "../../services/functions/AdditionalFunction";

const GJPrinting = React.forwardRef((props, ref) => {
  const menuData = useSelector((state) => state.menu.menuData);
  const { totalValue, convertToPeso } = AdditionalFunction();

  return (
    <Paper className="gj-printing" ref={ref} elevation={0}>
      <Stack display={"flex"} alignItems={"flex-start"}>
        <Typography>{`Series: ${menuData?.gj_series}`}</Typography>
        <Typography>{`Name: ${menuData?.gj_name}`}</Typography>
        <Typography>{`Ref #: ${menuData?.reference_no}`}</Typography>
        <Typography>{`Description : ${menuData?.gj_description}`}</Typography>
      </Stack>
      <Stack display={"flex"} alignItems={"flex-start"}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableCell className="voucher-treasury left">Line</TableCell>
              <TableCell className="voucher-treasury center">Code</TableCell>
              <TableCell className="voucher-treasury center">
                Account Title
              </TableCell>
              <TableCell className="voucher-treasury center">Debit</TableCell>
              <TableCell className="voucher-treasury right">Credit</TableCell>
            </TableHead>
            <TableBody>
              {menuData?.gj_items?.map((items, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="voucher-treasury left">
                      {index + 1}
                    </TableCell>
                    <TableCell className="voucher-treasury center">
                      {items?.coa?.code}
                    </TableCell>
                    <TableCell className="voucher-treasury center">
                      {items?.coa?.name}
                    </TableCell>
                    <TableCell className="voucher-treasury center">
                      {items?.debit_amount === 0
                        ? ""
                        : convertToPeso(
                            parseFloat(items?.debit_amount).toFixed(2)
                          )}
                    </TableCell>
                    <TableCell className="voucher-treasury right">
                      {items?.credit_amount === 0
                        ? ""
                        : convertToPeso(
                            parseFloat(items?.credit_amount).toFixed(2)
                          )}
                    </TableCell>
                  </TableRow>
                );
              })}

              <TableRow>
                <TableCell
                  align="right"
                  className="voucher-treasury left"
                  colSpan={3}
                >
                  Total
                </TableCell>

                <TableCell className="voucher-treasury center">
                  {convertToPeso(
                    parseFloat(
                      totalValue(menuData?.gj_items, "debit_amount")
                    ).toFixed(2)
                  )}
                </TableCell>
                <TableCell className="voucher-treasury right">
                  {convertToPeso(
                    parseFloat(
                      totalValue(menuData?.gj_items, "credit_amount")
                    ).toFixed(2)
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Paper>
  );
});

export default GJPrinting;

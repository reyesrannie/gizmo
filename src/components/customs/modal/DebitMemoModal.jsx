import React, { useEffect, useRef, useState } from "react";
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
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
} from "@mui/material";

import "../../styles/Modal.scss";
import "../../styles/TransactionModal.scss";
import "../../styles/TransactionModalApprover.scss";

import { useDispatch, useSelector } from "react-redux";
import {
  useAccountTitlesQuery,
  useClearCVoucherMutation,
  useClearDebitMemoMutation,
  useReleasedCVoucherMutation,
  useReturnCheckEntriesMutation,
  useReturnDebitMemoMutation,
  useTaxComputationQuery,
  useUpdateCheckDateMutation,
  useVoidCheckNumberMutation,
} from "../../../services/store/request";
import Lottie from "lottie-react";
import loading from "../../../assets/lottie/Loading-2.json";

import { AdditionalFunction } from "../../../services/functions/AdditionalFunction";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import treasurySchema from "../../../schemas/treasurySchema";
import moment from "moment";
import { MobileDatePicker } from "@mui/x-date-pickers";
import ReactToPrint from "react-to-print";
import {
  resetMenu,
  setCheckID,
  setMenuData,
  setUpdateData,
  setViewAccountingEntries,
} from "../../../services/slice/menuSlice";
import { resetOption } from "../../../services/slice/optionsSlice";

import { enqueueSnackbar } from "notistack";
import {
  resetPrompt,
  setOpenVoid,
  setReturn,
} from "../../../services/slice/promptSlice";
import { singleError } from "../../../services/functions/errorResponse";
import dayjs from "dayjs";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import ReasonInput from "../ReasonInput";
import TransactionDrawer from "../TransactionDrawer";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";

const DebitMemoModal = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const isReturn = useSelector((state) => state.prompt.return);

  const { convertToPeso } = AdditionalFunction();

  const [clearDebitMemo, { isLoading: releasedLoading }] =
    useClearDebitMemoMutation();

  const [returnCheckEntry, { isLoading: loadingReturn }] =
    useReturnDebitMemoMutation();

  const handleClearDebitMemo = async () => {
    const obj = {
      dm_ids: [menuData?.id],
    };

    try {
      const res = await clearDebitMemo(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleReturn = async (reason) => {
    const obj = {
      id: menuData?.id,
      ...reason,
    };
    try {
      const res = await returnCheckEntry(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetPrompt());
      dispatch(resetMenu());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  return (
    <Paper className="transaction-modal-container">
      <Box>
        <TableContainer
          ref={componentRef}
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
                  <Typography>RDF FEED, LIVESTOCK & FOODS, INC.</Typography>
                </TableCell>
                <TableCell
                  colSpan={4}
                  align="center"
                  className="voucher-treasury header"
                >
                  <Typography>DEBIT MEMO</Typography>
                </TableCell>
                <TableCell
                  colSpan={2}
                  align="left"
                  className="voucher-treasury name"
                >
                  <Typography className="name-supplier-typo-treasury supplier">
                    SUPPLIERSs
                  </Typography>
                  <Typography
                    className="name-supplier-typo-treasury name"
                    align="center"
                    sx={{
                      fontSize: `${
                        menuData?.transaction?.supplier?.name?.length <= 40
                          ? 14
                          : 12
                      }px`,
                    }}
                  >
                    {menuData?.transaction?.supplier?.name}
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
                <TableCell align="center" className="voucher-treasury left">
                  <Typography>
                    {moment(menuData?.transaction?.date_invoice).format(
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
                    {menuData?.transaction?.description?.length > 200
                      ? `${menuData?.transaction?.description?.substring(
                          0,
                          150
                        )}...`
                      : menuData?.transaction?.description}
                  </Typography>
                </TableCell>
                <TableCell align="center" className="voucher-treasury right">
                  <Typography className="payee-typo-treasury">
                    {convertToPeso(parseFloat(menuData?.amount).toFixed(2))}
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
                  <Typography>{menuData?.debit_coa?.name}</Typography>
                </TableCell>
                <TableCell
                  colSpan={2}
                  className="voucher-treasury center"
                ></TableCell>
                <TableCell className="voucher-treasury right"></TableCell>

                <TableCell className="voucher-treasury center" align="center">
                  <Typography>{menuData?.debit_coa?.code}</Typography>
                </TableCell>
                <TableCell className="voucher-treasury content" align="right">
                  <Typography>
                    {convertToPeso(parseFloat(menuData?.amount).toFixed(2))}
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
                <TableCell colSpan={2} className="voucher-treasury center">
                  <Typography>{menuData?.credit_coa?.name}</Typography>
                </TableCell>

                <TableCell className="voucher-treasury center"></TableCell>
                <TableCell className="voucher-treasury content" align="center">
                  <Typography>{menuData?.credit_coa?.code}</Typography>
                </TableCell>
                <TableCell className="voucher-treasury"></TableCell>
                <TableCell className="voucher-treasury content">
                  <Typography align="right">
                    {convertToPeso(parseFloat(menuData?.amount).toFixed(2))}
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
                  <Typography>{`Bank: ${menuData?.bank?.name}`}</Typography>
                </TableCell>
                <TableCell
                  colSpan={2}
                  align="left"
                  className="voucher-treasury content"
                >
                  <Typography>{`Prepared By: ${
                    menuData?.prepared_by?.first_name
                      ? menuData?.prepared_by?.first_name
                      : ""
                  } ${
                    menuData?.prepared_by?.last_name
                      ? menuData?.prepared_by?.last_name
                      : ""
                  }`}</Typography>
                </TableCell>
                <TableCell align="center" className="voucher-treasury content">
                  <Typography>Date</Typography>
                </TableCell>
                <TableCell align="center" className="voucher-treasury content">
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
                  <Typography>{`Type: ${menuData?.dm_type.toUpperCase()}`}</Typography>
                </TableCell>
                <TableCell
                  colSpan={5}
                  align="left"
                  className="voucher-treasury content"
                >
                  <Stack flexDirection={"row"} gap={1}>
                    <Typography>DM. No. :</Typography>
                    <Typography>{`DMRL${moment(menuData?.tagYear).get(
                      "year"
                    )} - ${menuData?.dm_no}`}</Typography>
                  </Stack>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  colSpan={2}
                  align="left"
                  className="voucher-treasury content"
                >
                  <Typography>{`DM Date: ${moment(
                    new Date(menuData?.dm_date)
                  ).format("MM/DD/YYYY")}`}</Typography>
                </TableCell>
                <TableCell
                  colSpan={6}
                  align="left"
                  className="voucher-treasury content"
                >
                  <Stack flexDirection={"row"} gap={1}>
                    <Typography>Amount:</Typography>
                    <Typography>
                      {convertToPeso(parseFloat(menuData?.amount).toFixed(2))}
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
                      {`${moment(menuData?.tagYear).get("year")} - ${
                        menuData?.transaction?.tag_no
                      }`}
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
                      {`${menuData?.transaction?.documentType?.code} - ${menuData?.transaction?.invoice_no}`}
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
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box className="add-transaction-button-container">
        <Box className="return-receive-container">
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

          <Button
            variant="contained"
            color="success"
            className="add-transaction-button"
            onClick={() => handleClearDebitMemo()}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="error"
            className="add-transaction-button"
            onClick={() => dispatch(setReturn(true))}
          >
            Return
          </Button>
        </Box>
        <Box className="archive-transaction-button-container">
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

      <Dialog
        open={releasedLoading || loadingReturn}
        className="loading-transaction-create"
      >
        <Lottie animationData={loading} loop />
      </Dialog>

      <Dialog open={isReturn}>
        <ReasonInput
          title={"Reason for return"}
          reasonDesc={"Please enter the reason for returning this entry"}
          warning={
            "Please note that this entry will be forwarded back to Preparation for further processing. Kindly provide a reason for this action."
          }
          confirmButton={"Confirm"}
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
          }}
          confirmOnClick={(e) => handleReturn(e)}
        />
      </Dialog>

      <TransactionDrawer transactionData={menuData?.transactions} />
    </Paper>
  );
};

export default DebitMemoModal;

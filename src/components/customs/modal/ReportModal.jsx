import React, { useEffect, useRef, useState } from "react";
import "../../styles/TransactionModal.scss";
import "../../styles/TagTransaction.scss";
import "../../styles/Supplier.scss";
import "../../styles/UserManagement.scss";

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
  TableFooter,
  IconButton,
  Dialog,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

import { setViewMenu } from "../../../services/slice/menuSlice";
import { useReportQuery } from "../../../services/store/request";
import loading from "../../../assets/lottie/Loading-2.json";
import noData from "../../../assets/lottie/NoData.json";

import Lottie from "lottie-react";
import moment from "moment";
import { AdditionalFunction } from "../../../services/functions/AdditionalFunction";
import {
  totalAmount,
  totalInputTax,
  totalWTax,
} from "../../../services/functions/compute";

import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import {
  generateExcelReport,
  generateExcelReportPerATC,
  generateExcelReportPerSup,
} from "../../../services/functions/exportFile";
import { hasAccess } from "../../../services/functions/access";
import CardNavigation from "../CardNavigation";
import { report } from "../../../services/constants/items";

const ReportModal = ({ transaction, title }) => {
  const { convertToPeso } = AdditionalFunction();
  const [selectedReport, setSelectedReport] = useState("");
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const voucher = useSelector((state) => state.options.voucher);

  const {
    data: reportData,
    isLoading,
    isError,
    isSuccess,
  } = useReportQuery(
    { ...menuData, state: "approved" },
    { skip: menuData === null || selectedReport === "" }
  );

  const hasRun = useRef(false);

  useEffect(() => {
    if (isSuccess) {
      generateReport(selectedReport);
      hasRun.current = true;
    }
  }, [isSuccess]);

  const generateReport = async (type) => {
    if (type === "Transaction") {
      setSelectedReport("");
      generateExcelReport(reportData, menuData, type);
    } else if (type === "ATC") {
      setSelectedReport("");
      generateExcelReportPerATC(reportData, menuData, type);
    } else if (type === "Supplier") {
      setSelectedReport("");
      generateExcelReportPerSup(reportData, menuData, type);
    }
  };

  return (
    <Paper className="transaction-modal-container">
      <Typography className="transaction-text">{title}</Typography>

      <Box className="report-management-body">
        {report?.map(
          (card, index) =>
            hasAccess(card?.permission) && (
              <Box
                className="report-tiles"
                key={index}
                onClick={() => {
                  setSelectedReport(card?.name);
                }}
              >
                <Stack display={"flex"} alignItems={"center"}>
                  <Typography className="supplier-company-name">
                    {card?.name}
                  </Typography>
                  {card?.firstIcon}
                </Stack>
              </Box>
            )
        )}
      </Box>
      <Box className="add-transaction-button-container-report">
        .
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            dispatch(setViewMenu(false));
          }}
          className="add-transaction-button"
        >
          Close
        </Button>
      </Box>

      <Dialog open={isLoading} className="loading-transaction-create">
        <Lottie animationData={loading} loop={true} />
      </Dialog>
    </Paper>
  );
};

export default ReportModal;

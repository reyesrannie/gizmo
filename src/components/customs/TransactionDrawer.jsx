import {
  AppBar,
  Box,
  Button,
  Divider,
  Paper,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import React from "react";

import "../styles/TransactionDrawer.scss";
import { useDispatch, useSelector } from "react-redux";
import { setLogsOpen, setSuccessLog } from "../../services/slice/logSlice";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SwapHorizontalCircleOutlinedIcon from "@mui/icons-material/SwapHorizontalCircleOutlined";
import RecommendOutlinedIcon from "@mui/icons-material/RecommendOutlined";
import {
  useStatusLogsQuery,
  useUsersQuery,
} from "../../services/store/request";
import moment from "moment";
import { useRef } from "react";
import { useEffect } from "react";

const CustomIndicator = ({ props, item }) => {
  const { completed, active } = props;

  return (
    <Box>
      {completed && item?.status === "pending" && (
        <CheckCircleOutlinedIcon color="secondary" />
      )}
      {completed && item?.status === "received" && (
        <CheckCircleOutlinedIcon color="success" />
      )}
      {completed && item?.status === "For Computation" && (
        <CheckCircleOutlinedIcon color="info" />
      )}
      {completed && item?.status === "archived" && (
        <CancelOutlinedIcon color="error" />
      )}
      {completed && item?.status === "returned" && (
        <SwapHorizontalCircleOutlinedIcon color="error" />
      )}
      {completed && item?.status === "checked" && (
        <CheckCircleOutlinedIcon color="warning" />
      )}
      {completed && item?.status === "For Approval" && (
        <CheckCircleOutlinedIcon color="warning" />
      )}
      {completed && item?.status === "approved" && (
        <RecommendOutlinedIcon color="success" />
      )}
      {!completed && <CircleOutlinedIcon color="warning" />}
    </Box>
  );
};

const TransactionDrawer = ({ transactionData }) => {
  const { data: logs } = useStatusLogsQuery(
    {
      transaction_id: transactionData?.id,
      sorts: "created_at",
      pagination: "none",
    },
    { skip: transactionData === null }
  );

  const paperRef = useRef(null);
  const { data: user } = useUsersQuery({
    status: "active",
    pagination: "none",
  });

  const dispatch = useDispatch();

  const logsOpen = useSelector((state) => state.log.logsOpen);

  const handleClickOutside = (event) => {
    if (paperRef.current && !paperRef.current.contains(event.target)) {
      dispatch(setLogsOpen(false));
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Paper
      ref={paperRef}
      className={`transaction-logs-container ${logsOpen ? "open" : ""}`}
      elevation={0}
      onClick={() => {
        dispatch(setLogsOpen(true));
      }}
    >
      <Button
        color="secondary"
        className="add-transaction-button"
        onClick={(event) => {
          event.stopPropagation();
          dispatch(setLogsOpen(!logsOpen));
        }}
      >
        {logsOpen ? "Hide logs" : "Show logs"}
      </Button>

      <Box className="form-title-transaction">
        <Divider orientation="horizontal" className="transaction-devider" />
      </Box>
      <Box
        className={`logs-transaction-item-container ${logsOpen ? "open" : ""}`}
      >
        <Stepper activeStep={logs?.result.length} orientation="vertical">
          {logs?.result?.map((item, index) => {
            const createdBy = user?.result?.find(
              (items) => item?.created_by_id === items.id
            );
            const updatedBy = user?.result?.find(
              (items) => item?.updated_by_id === items.id
            );

            return (
              <Step key={index}>
                <StepLabel
                  StepIconComponent={(props) => (
                    <CustomIndicator props={props} item={item} />
                  )}
                >
                  <Box className="logs-transaction-container">
                    {item?.created_by_id !== null && (
                      <>
                        <Typography className="logs-title-transaction">
                          Transaction Created
                        </Typography>
                        <Box className={"logs-details-transaction"}>
                          <Typography className="logs-indicator-transaction">
                            Created By:
                          </Typography>
                          <Typography className="logs-details-text-transaction">
                            {`${createdBy?.first_name}  ${createdBy?.last_name}`}
                          </Typography>
                        </Box>
                      </>
                    )}

                    {item?.created_by_id === null && (
                      <>
                        <Typography className="logs-title-transaction">
                          Transaction Updated
                        </Typography>
                        <Box className={"logs-details-transaction"}>
                          <Typography className="logs-indicator-transaction">
                            Updated By:
                          </Typography>
                          <Typography className="logs-details-text-transaction">
                            {`${updatedBy?.first_name}  ${updatedBy?.last_name}`}
                          </Typography>
                        </Box>
                      </>
                    )}
                    <Box className={"logs-details-transaction"}>
                      <Typography className="logs-indicator-transaction">
                        Status:
                      </Typography>
                      {item?.status === "pending" && (
                        <Typography
                          color="secondary"
                          className="logs-indicator-transaction"
                        >
                          {item?.status?.toUpperCase()}
                        </Typography>
                      )}
                      {item?.status === "For Computation" && (
                        <Typography
                          color="blueviolet"
                          className="logs-indicator-transaction"
                        >
                          {item?.status?.toUpperCase()}
                        </Typography>
                      )}
                      {item?.status === "archived" && (
                        <Typography
                          color="error"
                          className="logs-indicator-transaction"
                        >
                          {item?.status?.toUpperCase()}
                        </Typography>
                      )}
                      {item?.status === "received" && (
                        <Typography
                          color="green"
                          className="logs-indicator-transaction"
                        >
                          {item?.status?.toUpperCase()} by AP
                        </Typography>
                      )}
                      {item?.status === "returned" && (
                        <Typography
                          color="error"
                          className="logs-indicator-transaction"
                        >
                          {item?.status?.toUpperCase()}
                        </Typography>
                      )}
                      {item?.status === "checked" && (
                        <Typography
                          color="#B6622d"
                          className="logs-indicator-transaction"
                        >
                          {item?.status?.toUpperCase()}
                        </Typography>
                      )}
                      {item?.status === "For Approval" && (
                        <Typography
                          color="#B6622d"
                          className="logs-indicator-transaction"
                        >
                          {item?.status?.toUpperCase()}
                        </Typography>
                      )}
                      {item?.status === "approved" && (
                        <Typography
                          color="green"
                          className="logs-indicator-transaction"
                        >
                          {item?.status?.toUpperCase()}
                        </Typography>
                      )}
                    </Box>
                    {item?.voucher_type !== null && (
                      <Box className={"logs-details-transaction"}>
                        <Typography className="logs-indicator-transaction">
                          Entry:
                        </Typography>
                        <Typography className="logs-details-text-transaction">
                          {item?.voucher_type}
                        </Typography>
                      </Box>
                    )}

                    {item?.amount !== null && (
                      <Box className={"logs-details-transaction"}>
                        <Typography className="logs-indicator-transaction">
                          Amount:
                        </Typography>
                        <Typography
                          color="green"
                          className="logs-details-text-transaction"
                        >
                          <span>&#8369;</span>
                          {item?.amount
                            ?.toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Typography>
                      </Box>
                    )}
                    {item?.edited_amount_from !== item?.edited_amount_to &&
                      item?.edited_amount_from !== null && (
                        <Box className={"logs-details-transaction"}>
                          <Typography className="logs-indicator-transaction">
                            Prev. Amount:
                          </Typography>
                          <Typography
                            color="red"
                            className="logs-details-text-transaction"
                          >
                            <span>&#8369;</span>
                            {item?.edited_amount_from
                              ?.toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </Typography>
                        </Box>
                      )}
                    {item?.edited_amount_from !== item?.edited_amount_to &&
                      item?.edited_amount_to !== null && (
                        <Box className={"logs-details-transaction"}>
                          <Typography className="logs-indicator-transaction">
                            New Amount:
                          </Typography>
                          <Typography
                            color="green"
                            className="logs-details-text-transaction"
                          >
                            <span>&#8369;</span>
                            {item?.edited_amount_to
                              ?.toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </Typography>
                        </Box>
                      )}
                    {item?.status === "archived" && (
                      <Box className={"logs-details-transaction"}>
                        <Typography className="logs-indicator-transaction">
                          Reason:
                        </Typography>
                        <Typography className="logs-details-text-transaction">
                          {item?.reason}
                        </Typography>
                      </Box>
                    )}
                    {item?.status === "returned" && (
                      <Box className={"logs-details-transaction"}>
                        <Typography className="logs-indicator-transaction">
                          Reason:
                        </Typography>
                        <Typography className="logs-details-text-transaction">
                          {item?.reason}
                        </Typography>
                      </Box>
                    )}
                    <Box className={"logs-details-transaction"}>
                      <Typography className="logs-indicator-transaction">
                        Date:
                      </Typography>
                      <Typography className="logs-details-text-transaction">
                        {moment(item?.updated_at).format(
                          "MMM DD, YYYY, hh:mm A"
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
    </Paper>
  );
};

export default TransactionDrawer;

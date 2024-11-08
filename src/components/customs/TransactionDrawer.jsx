import {
  Box,
  Button,
  Divider,
  Paper,
  Step,
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
  useCutOffLogsQuery,
  useSchedTransactionQuery,
  useStatusLogsQuery,
  useStatusScheduleLogsQuery,
  useUsersQuery,
} from "../../services/store/request";
import moment from "moment";
import { useRef } from "react";
import { useEffect } from "react";
import { useGjStatusLogsQuery } from "../../services/store/seconAPIRequest";

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
      {completed && item?.state === "For Computation" && (
        <CheckCircleOutlinedIcon color="info" />
      )}
      {completed && item?.status === "archived" && (
        <CancelOutlinedIcon color="error" />
      )}
      {completed && item?.status === "returned" && (
        <SwapHorizontalCircleOutlinedIcon color="error" />
      )}
      {completed && item?.state === "returned" && (
        <SwapHorizontalCircleOutlinedIcon color="error" />
      )}
      {completed && item?.status === "checked" && (
        <CheckCircleOutlinedIcon color="warning" />
      )}
      {completed && item?.status === "For Approval" && (
        <CheckCircleOutlinedIcon color="warning" />
      )}
      {completed && item?.state === "For Approval" && (
        <CheckCircleOutlinedIcon color="warning" />
      )}
      {completed && item?.status === "approved" && (
        <RecommendOutlinedIcon color="success" />
      )}
      {completed && item?.status === "For Voiding" && (
        <CheckCircleOutlinedIcon color="secondary" />
      )}
      {completed && item?.status === "voided" && (
        <CheckCircleOutlinedIcon color="error" />
      )}
      {completed && item?.state === "approved" && (
        <RecommendOutlinedIcon color="success" />
      )}
      {completed && item?.state === "completed" && (
        <RecommendOutlinedIcon color="success" />
      )}
      {completed && item?.status === "For Preparation" && (
        <CheckCircleOutlinedIcon color="warning" />
      )}
      {completed && item?.status === "For Releasing" && (
        <CheckCircleOutlinedIcon color="warning" />
      )}

      {completed && item?.status === "Released" && (
        <CheckCircleOutlinedIcon color="success" />
      )}
      {completed && item?.state === "pending" && (
        <CheckCircleOutlinedIcon color="secondary" />
      )}
      {completed && item?.state === "closed" && item?.requested_at === null && (
        <CheckCircleOutlinedIcon color="success" />
      )}
      {completed && item?.state === "closed" && item?.requested_at !== null && (
        <CheckCircleOutlinedIcon color="secondary" />
      )}

      {!completed && <CircleOutlinedIcon color="warning" />}
    </Box>
  );
};

const TransactionDrawer = ({
  transactionData,
  cutOff = false,
  schedule = false,
}) => {
  const menuData = useSelector((state) => state.menu.menuData);
  const voucher = useSelector((state) => state.options.voucher);

  const { data: logs } = useStatusLogsQuery(
    {
      transaction_id: transactionData?.id,
      pagination: "none",
    },
    {
      skip:
        transactionData === null ||
        transactionData === undefined ||
        voucher === "gj",
    }
  );

  const { data: cutOffLogs } = useCutOffLogsQuery(
    {
      cutoff_id: menuData?.id,
      sorts: "created_at",
      pagination: "none",
    },
    { skip: !cutOff }
  );

  const { data: schedLogs } = useStatusScheduleLogsQuery(
    {
      schedule_id: menuData?.id,
      pagination: "none",
    },
    { skip: !schedule }
  );

  const { data: gjLogs } = useGjStatusLogsQuery(
    {
      gj_id: menuData?.id,
      pagination: "none",
    },
    {
      skip:
        transactionData === null ||
        transactionData === undefined ||
        voucher !== "gj",
    }
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
        {!schedule && !cutOff && (
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

                        {item?.status === "For Preparation" && (
                          <Typography
                            color="#B6622d"
                            className="logs-indicator-transaction"
                          >
                            {item?.status?.toUpperCase()}
                          </Typography>
                        )}

                        {item?.status === "For Releasing" && (
                          <Typography
                            color="#B6622d"
                            className="logs-indicator-transaction"
                          >
                            {item?.status?.toUpperCase()}
                          </Typography>
                        )}

                        {item?.status === "Released" && (
                          <Typography
                            color="green"
                            className="logs-indicator-transaction"
                          >
                            {item?.status?.toUpperCase()}
                          </Typography>
                        )}

                        {item?.status === "For Clearing" && (
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
                        {item?.status === "For Voiding" && (
                          <Typography
                            color="secondary"
                            className="logs-indicator-transaction"
                          >
                            {item?.status?.toUpperCase()}
                          </Typography>
                        )}
                        {item?.status === "voided" && (
                          <Typography
                            color="error"
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

                      {item?.status === "For Voiding" && (
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
        )}

        {voucher === "gj" && (
          <Stepper activeStep={gjLogs?.result.length} orientation="vertical">
            {gjLogs?.result?.map((item, index) => {
              return (
                <Step key={index}>
                  <StepLabel
                    StepIconComponent={(props) => (
                      <CustomIndicator props={props} item={item} />
                    )}
                  >
                    <Box className="logs-transaction-container">
                      {item?.createdBy !== null && (
                        <>
                          <Typography className="logs-title-transaction">
                            Transaction Created
                          </Typography>
                          <Box className={"logs-details-transaction"}>
                            <Typography className="logs-indicator-transaction">
                              Created By:
                            </Typography>
                            <Typography className="logs-details-text-transaction">
                              {`${item?.createdBy?.first_name}  ${item?.createdBy?.last_name}`}
                            </Typography>
                          </Box>
                        </>
                      )}

                      {item?.createdBy === null && (
                        <>
                          <Typography className="logs-title-transaction">
                            Transaction Updated
                          </Typography>
                          <Box className={"logs-details-transaction"}>
                            <Typography className="logs-indicator-transaction">
                              Updated By:
                            </Typography>
                            <Typography className="logs-details-text-transaction">
                              {`${item?.updatedBy?.first_name}  ${item?.updatedBy?.last_name}`}
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

                        {item?.status === "For Preparation" && (
                          <Typography
                            color="#B6622d"
                            className="logs-indicator-transaction"
                          >
                            {item?.status?.toUpperCase()}
                          </Typography>
                        )}

                        {item?.status === "For Releasing" && (
                          <Typography
                            color="#B6622d"
                            className="logs-indicator-transaction"
                          >
                            {item?.status?.toUpperCase()}
                          </Typography>
                        )}

                        {item?.status === "Released" && (
                          <Typography
                            color="green"
                            className="logs-indicator-transaction"
                          >
                            {item?.status?.toUpperCase()}
                          </Typography>
                        )}

                        {item?.status === "For Clearing" && (
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
                        {item?.status === "For Voiding" && (
                          <Typography
                            color="secondary"
                            className="logs-indicator-transaction"
                          >
                            {item?.status?.toUpperCase()}
                          </Typography>
                        )}
                        {item?.status === "voided" && (
                          <Typography
                            color="error"
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

                      {item?.reason !== null && (
                        <Box className={"logs-details-transaction"}>
                          <Typography className="logs-indicator-transaction">
                            Reason:
                          </Typography>
                          <Typography className="logs-details-text-transaction">
                            {item?.reason}
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
        )}

        {!schedule && cutOff && (
          <Stepper
            activeStep={cutOffLogs?.result.length}
            orientation="vertical"
          >
            {cutOffLogs?.result?.map((item, index) => {
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
                            Cutoff Created
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
                            Cutoff Updated
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
                        {item?.state === "pending" && (
                          <Typography
                            color="secondary"
                            className="logs-indicator-transaction"
                          >
                            {item?.state?.toUpperCase()}
                          </Typography>
                        )}

                        {item?.state === "closed" &&
                          item?.requested_at === null && (
                            <Typography
                              color="green"
                              className="logs-indicator-transaction"
                            >
                              {item?.state?.toUpperCase()}
                            </Typography>
                          )}

                        {item?.state === "closed" &&
                          item?.requested_at !== null && (
                            <Typography
                              color="secondary"
                              className="logs-indicator-transaction"
                            >
                              RE-OPEN REQUESTED
                            </Typography>
                          )}
                      </Box>

                      {item?.state === "closed" &&
                        item?.requested_at !== null && (
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
        )}

        {schedule && !cutOff && (
          <Stepper activeStep={schedLogs?.result.length} orientation="vertical">
            {schedLogs?.result?.map((item, index) => {
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
                            Schedule Created
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
                            Schedule Updated
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
                        {item?.state === "pending" && (
                          <Typography
                            color="secondary"
                            className="logs-indicator-transaction"
                          >
                            {item?.state?.toUpperCase()}
                          </Typography>
                        )}

                        {item?.state === "For Computation" && (
                          <Typography
                            color="secondary"
                            className="logs-indicator-transaction"
                          >
                            {item?.state?.toUpperCase()}
                          </Typography>
                        )}

                        {item?.state === "For Approval" && (
                          <Typography
                            color="secondary"
                            className="logs-indicator-transaction"
                          >
                            {item?.state?.toUpperCase()}
                          </Typography>
                        )}

                        {item?.state === "approved" && (
                          <Typography
                            color="green"
                            className="logs-indicator-transaction"
                          >
                            {item?.state?.toUpperCase()}
                          </Typography>
                        )}
                        {item?.state === "returned" && (
                          <Typography
                            color="error"
                            className="logs-indicator-transaction"
                          >
                            {item?.state?.toUpperCase()}
                          </Typography>
                        )}
                        {item?.state === "completed" && (
                          <Typography
                            color="green"
                            className="logs-indicator-transaction"
                          >
                            {item?.state?.toUpperCase()}
                          </Typography>
                        )}
                      </Box>

                      {item?.state === "returned" &&
                        item?.requested_at !== null && (
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
        )}
      </Box>
    </Paper>
  );
};

export default TransactionDrawer;

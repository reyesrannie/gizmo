import { SpeedDial, SpeedDialAction } from "@mui/material";
import ScheduleSendOutlinedIcon from "@mui/icons-material/ScheduleSendOutlined";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import React from "react";
import { useNavigate } from "react-router";

import "../styles/NotificationSchedule.scss";
import { useDispatch } from "react-redux";
import { setHeader } from "../../services/slice/headerSlice";

const NotificationSchedule = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const actions = [
    {
      icon: <ScheduleSendOutlinedIcon color="secondary" />,
      name: "A scheduled transaction is pending and requires processing.",
    },
  ];

  return (
    <SpeedDial
      ariaLabel="Notif"
      className="notification-baloon"
      icon={<PriorityHighOutlinedIcon color="secondary" />}
      onClick={() => {
        dispatch(setHeader("Approved"));
        navigate("/sched_transact/ap");
      }}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
          onClick={() => {
            dispatch(setHeader("Approved"));
            navigate("/sched_transact/ap");
          }}
        />
      ))}
    </SpeedDial>
  );
};

export default NotificationSchedule;

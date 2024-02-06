import { Chip } from "@mui/material";
import React from "react";
import "../styles/StatusIndicator.scss";
const StatusIndicator = ({ status, className }) => {
  return <Chip label={status} size="small" className={className} />;
};

export default StatusIndicator;

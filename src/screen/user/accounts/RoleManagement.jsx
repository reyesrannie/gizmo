import { Box, Typography } from "@mui/material";
import React from "react";

import "../../../components/styles/RoleManagement.scss";
const RoleManagement = () => {
  return (
    <Box>
      <Box>
        <Typography className="page-text-indicator-role">
          Role Management
        </Typography>
      </Box>
      <Box className="role-body-container">1</Box>
    </Box>
  );
};

export default RoleManagement;

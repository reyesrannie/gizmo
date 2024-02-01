import { Box, Typography } from "@mui/material";
import React from "react";

import "../../components/styles/UserManagement.scss";

const UserManagement = () => {
  return (
    <Box>
      <Box>
        <Typography className="page-text-indicator-user">
          User Management
        </Typography>
      </Box>
    </Box>
  );
};

export default UserManagement;

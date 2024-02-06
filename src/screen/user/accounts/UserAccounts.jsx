import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import Breadcrums from "../../../components/customs/Breadcrums";

const UserAccounts = () => {
  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box>
        <Typography className="page-text-indicator-user">
          User Accounts
        </Typography>
      </Box>
    </Box>
  );
};

export default UserAccounts;

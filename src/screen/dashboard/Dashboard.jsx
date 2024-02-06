import React from "react";
import { Box, Typography } from "@mui/material";

import "../../components/styles/Dashboard.scss";
import welcomeImage from "../../assets/svg/undraw_hello_re_3evm.svg";
import { decodeUser } from "../../services/functions/saveUser";
import Breadcrums from "../../components/customs/Breadcrums";

const Dashboard = () => {
  const userData = decodeUser();

  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box>
        <Typography className="page-text-indicator">Dashboard</Typography>
      </Box>
      <Box className="welcome-message">
        <Box className="welcome-details">
          <Typography className="welcome-text">Welcome back!</Typography>
          <Typography className="welcome-username">
            {userData?.username?.toUpperCase()}!
          </Typography>
        </Box>
        <Box>
          <img
            src={welcomeImage}
            alt="Welcome"
            className="dashboard-welcome-image"
            draggable="false"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

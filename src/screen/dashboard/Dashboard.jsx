import React from "react";
import { Box, Typography } from "@mui/material";

import "../../components/styles/Dashboard.scss";
import welcomeImage from "../../assets/svg/undraw_interior_design_re_7mvn.svg";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const openDrawer = useSelector((state) => state.menu.drawer);

  return (
    <Box>
      <Box>
        <Typography className="page-text-indicator">Dashboard</Typography>
      </Box>
      <Box className="welcome-message">
        <Box className="welcome-details">
          <Typography className="welcome-text">Welcome back!</Typography>
          <Typography className="welcome-username">RREYES!</Typography>
        </Box>
        <Box>
          <img
            src={welcomeImage}
            alt="logo"
            className="dashboard-welcome-image"
            draggable="false"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

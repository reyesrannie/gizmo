import { Box, Typography } from "@mui/material";
import React from "react";

import "../../components/styles/UserManagement.scss";

import Breadcrums from "../../components/customs/Breadcrums";
import CardNavigation from "../../components/customs/CardNavigation";
import items from "../../services/constants/items";

const UserManagement = () => {
  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box>
        <Typography className="page-text-indicator-user">
          User Management
        </Typography>
      </Box>
      <Box className="user-management-body">
        {items?.map((card, index) => (
          <CardNavigation
            key={index}
            path={card.path}
            name={card.name}
            firstIcon={card.firstIcon}
            lastIcon={card.lastIcon}
            desc={card.desc}
          />
        ))}
      </Box>
    </Box>
  );
};

export default UserManagement;

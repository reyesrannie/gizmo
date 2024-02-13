import { Box, Typography } from "@mui/material";
import React from "react";

import "../../components/styles/UserManagement.scss";

import Breadcrums from "../../components/customs/Breadcrums";
import CardNavigation from "../../components/customs/CardNavigation";
import { user } from "../../services/constants/items";
import { hasAccess } from "../../services/functions/access";

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
        {user?.map(
          (card, index) =>
            hasAccess(card?.permission) && (
              <CardNavigation
                key={index}
                path={card.path}
                name={card.name}
                firstIcon={card.firstIcon}
                lastIcon={card.lastIcon}
                desc={card.desc}
              />
            )
        )}
      </Box>
    </Box>
  );
};

export default UserManagement;

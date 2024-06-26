import { Box, Typography } from "@mui/material";
import React from "react";
import Breadcrums from "../../components/customs/Breadcrums";
import { masterlist } from "../../services/constants/items";
import CardNavigation from "../../components/customs/CardNavigation";
import { hasAccess } from "../../services/functions/access";

import "../../components/styles/UserManagement.scss";

const Masterlist = () => {
  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box>
        <Typography className="page-text-indicator-user">Masterlist</Typography>
      </Box>
      <Box className="user-management-body">
        {masterlist?.map(
          (card, index) =>
            hasAccess(card?.permission) && (
              <CardNavigation
                key={index}
                path={card.path}
                name={card.name}
                firstIcon={card.firstIcon}
                desc={card.desc}
              />
            )
        )}
      </Box>
    </Box>
  );
};

export default Masterlist;

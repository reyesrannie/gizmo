import { Box, Typography } from "@mui/material";
import React from "react";

import "../../components/styles/AccountPayable.scss";

import Breadcrums from "../../components/customs/Breadcrums";
import CardNavigation from "../../components/customs/CardNavigation";
import { hasAccess } from "../../services/functions/access";
import { apTransaction } from "../../services/constants/items";

const AccountPayable = () => {
  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box>
        <Typography className="page-text-indicator-tagging">
          Accounts Payable
        </Typography>
      </Box>
      <Box className="tagging-management-body">
        {apTransaction?.map(
          (card, index) =>
            hasAccess(card?.permission) && (
              <CardNavigation
                key={index}
                path={card.path}
                name={card.name}
                firstIcon={card.firstIcon}
                // lastIcon={card.lastIcon}
                desc={card.desc}
              />
            )
        )}
      </Box>
    </Box>
  );
};

export default AccountPayable;

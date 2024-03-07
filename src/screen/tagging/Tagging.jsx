import { Box, Typography } from "@mui/material";
import React from "react";

import "../../components/styles/Tagging.scss";

import Breadcrums from "../../components/customs/Breadcrums";
import CardNavigation from "../../components/customs/CardNavigation";
import { tagging } from "../../services/constants/items";
import { hasAccess } from "../../services/functions/access";

const Tagging = () => {
  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box>
        <Typography className="page-text-indicator-tagging">Tagging</Typography>
      </Box>
      <Box className="tagging-management-body">
        {tagging?.map(
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

export default Tagging;

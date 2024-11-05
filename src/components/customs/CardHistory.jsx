import React from "react";
import Card from "@mui/material/Card";
import { Box, CardContent, Stack, Typography } from "@mui/material";

import "../styles/CardNavigation.scss";

import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { AdditionalFunction } from "../../services/functions/AdditionalFunction";

const CardHistory = ({
  name,
  lastIcon,
  onClick,
  description,
  badge,
  balance,
}) => {
  const { convertToPeso } = AdditionalFunction();

  return (
    <Card
      variant="outlined"
      className="card-navigation-container history"
      onClick={onClick}
    >
      <CardContent className="card-content history">
        <Stack gap={0}>
          <Typography className="card-title history">{name}</Typography>
          <Typography className="card-details history">
            {description}
          </Typography>
          {balance && (
            <Typography className="card-details-number">
              &#8369;{convertToPeso(parseFloat(balance).toFixed(2))}
            </Typography>
          )}
        </Stack>
        <Box className="card-count">
          {badge && (
            <Typography className="card-details-number">{badge}</Typography>
          )}
        </Box>
      </CardContent>
      <Box className="card-last-icon"> {lastIcon}</Box>
    </Card>
  );
};

export default CardHistory;

import React from "react";
import Card from "@mui/material/Card";
import { Box, CardContent, Typography } from "@mui/material";

import "../styles/CardNavigation.scss";

import FolderOpenIcon from "@mui/icons-material/FolderOpen";

const CardHistory = ({ name, lastIcon, onClick }) => {
  return (
    <Card
      variant="outlined"
      className="card-navigation-container history"
      onClick={onClick}
    >
      <CardContent className="card-content history">
        <FolderOpenIcon
          color="secondary"
          className="icon-card-details history"
        />
        <Typography className="card-title history">{name}</Typography>
      </CardContent>
      <Box className="card-last-icon"> {lastIcon}</Box>
    </Card>
  );
};

export default CardHistory;

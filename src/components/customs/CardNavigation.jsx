import React from "react";
import Card from "@mui/material/Card";
import { Badge, Box, CardContent, Typography } from "@mui/material";

import "../styles/CardNavigation.scss";

import { useNavigate } from "react-router-dom";
import CountDistribute from "../../services/functions/CountDistribute";

const CardNavigation = ({ path, name, firstIcon, desc, lastIcon }) => {
  const navigate = useNavigate();
  const { childMenuCount } = CountDistribute();
  return (
    <Card
      variant="outlined"
      className="card-navigation-container"
      onClick={() => navigate(path)}
    >
      <CardContent className="card-content">
        <Badge badgeContent={name ? childMenuCount(name) : 0} color="error">
          {firstIcon}
        </Badge>
        <Typography className="card-title">{name}</Typography>
        <Typography className="card-details">{desc}</Typography>
      </CardContent>
      <Box className="card-last-icon"> {lastIcon}</Box>
    </Card>
  );
};

export default CardNavigation;

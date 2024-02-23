import React from "react";
import Lottie from "lottie-react";
import notFound from "../assets/lottie/NotFound.json";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "../components/styles/PageNotFound.scss";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <Box className="page-not-found-container">
      <Lottie animationData={notFound} className="page-not-found" loop={true} />
      <Typography className="page-not-found-404">404</Typography>
      <Typography className="page-not-found-desc">Page not found</Typography>
      <Button
        variant="contained"
        className="page-not-found-button"
        onClick={() => navigate("/")}
      >
        Go back
      </Button>
    </Box>
  );
};

export default PageNotFound;

import React from "react";
import { Box, Skeleton } from "@mui/material";

const FolderSkeleton = () => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      {[...Array(12)].map((_, index) => (
        <Box
          key={index}
          display="flex"
          flexDirection="column"
          alignItems="center"
          width={120}
        >
          <Skeleton
            variant="rectangular"
            width={100}
            height={90}
            sx={{ borderRadius: "4px", marginBottom: "8px" }}
          />
          <Skeleton variant="text" width={80} height={20} />
        </Box>
      ))}
    </Box>
  );
};

export default FolderSkeleton;

import {
  Box,
  Button,
  Dialog,
  Divider,
  TextField as MuiTextField,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { useHistoryContext } from "../../services/context/HistoryContext";

import "../../components/styles/TagTransaction.scss";
import "../../components/styles/TransactionModal.scss";

import historySchema from "../../schemas/historySchema";
import folderClosed from "../../assets/svg/folder-closed.svg";
import folderOpen from "../../assets/svg/folder-open.svg";
import noData from "../../assets/lottie/NoData.json";
import { useGetHistoryQuery } from "../../services/api/historyApi";
import FolderSkeleton from "../../components/customs/FolderSkeleton";
import Lottie from "lottie-react";
import { useLocation } from "react-router";
import HistoryTable from "./HistoryTable";

const Voucher = () => {
  const isShownTable = useSelector((state) => state.sync.isShownTable);
  const menuData = useSelector((state) => state.menu.menuData);
  const isDisplayed = useSelector((state) => state.sync.isDisplayed);
  const location = useLocation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(historySchema),
    defaultValues: {
      year: null,
      type: null,
      date: null,
    },
  });
  const dispatch = useDispatch();
  const {
    params,
    onStateChange,
    loadingHistory,
    historyData,
    onYearChange,
    fetchingHistory,
    onMonthChange,
    errorHistory,
  } = useHistoryContext();

  const validateAccess = [
    { loc: "/tagging/history", prop: "tagging" },
    { loc: "/ap/history", prop: "ap" },
    { loc: "/approver/history", prop: "approver" },
  ];

  const validateState = () => {
    const access = validateAccess?.find(
      (item) => location?.pathname === item?.loc
    );

    return historyData?.result[access?.prop];
  };

  const handleChangeState = (item) => {
    const obj = {
      state: item,
      access: validateAccess?.find((item) => location?.pathname === item?.loc)
        ?.prop,
    };

    onStateChange(obj);
  };

  return (
    <Box className="folder-structure-history">
      <Stack gap={3} flexDirection={"row"}>
        {loadingHistory || fetchingHistory ? (
          <FolderSkeleton />
        ) : errorHistory ? (
          <Box className="error-no-data-history">
            <Lottie animationData={noData} />
          </Box>
        ) : (
          (params?.month === "" ? historyData?.result : validateState())?.map(
            (item, index) => {
              return (
                <Stack
                  key={index}
                  alignItems={"center"}
                  className="folder-container"
                  onClick={() => {
                    params?.year === "" && onYearChange(item);
                    params?.year !== "" &&
                      params?.month === "" &&
                      onMonthChange(item);

                    params?.year !== "" &&
                      params?.month !== "" &&
                      params?.state === "" &&
                      handleChangeState(item);
                  }}
                >
                  <img
                    src={folderClosed}
                    alt="folder"
                    className="folder-icons"
                    onMouseOver={(e) => (e.currentTarget.src = folderOpen)}
                    onMouseOut={(e) => (e.currentTarget.src = folderClosed)}
                  />
                  <Typography className="folder-name-history">
                    {item}
                  </Typography>
                </Stack>
              );
            }
          )
        )}
      </Stack>
      {params?.state !== "" &&
        !loadingHistory &&
        !fetchingHistory &&
        !errorHistory && <HistoryTable />}
    </Box>
  );
};

export default Voucher;

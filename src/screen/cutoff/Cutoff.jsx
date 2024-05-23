import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import "../../components/styles/Dashboard.scss";

import Breadcrums from "../../components/customs/Breadcrums";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import useParamsHook from "../../services/hooks/useParamsHook";
import SearchText from "../../components/customs/SearchText";

import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";

import {
  setCreateMenu,
  setMenuData,
  setUpdateMenu,
} from "../../services/slice/menuSlice";
import { generateExcel } from "../../services/functions/exportFile";

import "../../components/styles/AccountsPayable.scss";
import CutoffModal from "../../components/customs/modal/CutoffModal";
import { useCutOffQuery } from "../../services/store/request";
import loading from "../../assets/lottie/Loading-2.json";
import noData from "../../assets/lottie/NoData.json";
import StatusIndicator from "../../components/customs/StatusIndicator";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import Lottie from "lottie-react";
import moment from "moment";
import { hasAccess } from "../../services/functions/access";
import TransactionDrawer from "../../components/customs/TransactionDrawer";

const Cutoff = () => {
  const excelItems = ["ID", "CODE", "NAME", "CREATED AT", "DATE MODIFIED"];

  const [anchorE1, setAnchorE1] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const createMenu = useSelector((state) => state.menu.createMenu);
  const updateMenu = useSelector((state) => state.menu.updateMenu);

  const {
    params,
    onStatusChange,
    onPageChange,
    onRowChange,
    onSearchData,
    onSortTable,
  } = useParamsHook();

  const {
    data: cutOff,
    isLoading,
    status,
    isError,
    isFetching,
  } = useCutOffQuery({ ...params });

  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box className="ap-head-container">
        <Typography className="page-text-indicator-ap">Cut Off</Typography>
        <Box className="ap-button-container">
          <SearchText onSearchData={onSearchData} />
          {hasAccess(["cutOff_requestor"]) && (
            <Button
              variant="contained"
              color="secondary"
              className="button-add-ap"
              startIcon={<AddToPhotosOutlinedIcon />}
              onClick={() => dispatch(setCreateMenu(true))}
            >
              Add
            </Button>
          )}
        </Box>
      </Box>
      <Box className="ap-body-container">
        <TableContainer className="ap-table-container">
          <Table stickyHeader>
            <TableHead>
              <TableRow className="table-header1-ap">
                <TableCell colSpan={7}>
                  <Stack flexDirection={"row"} justifyContent="space-between">
                    <Box></Box>
                    <Box>
                      <Button
                        variant="contained"
                        className="button-export-ap"
                        startIcon={<FileUploadOutlinedIcon />}
                        onClick={() =>
                          generateExcel(
                            "Accounts Payable",
                            // cutOff?.result?.data,
                            excelItems,
                            "AP"
                          )
                        }
                      >
                        Export
                      </Button>
                    </Box>
                  </Stack>
                </TableCell>
              </TableRow>
              <TableRow className="table-header-ap">
                <TableCell>
                  <TableSortLabel
                    active={params.sorts === "id" || params.sorts === "-id"}
                    onClick={() =>
                      onSortTable(params.sorts === "id" ? "-id" : "id")
                    }
                    direction={params.sorts === "id" ? "asc" : "desc"}
                  >
                    ID No.
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={params.sorts === "date" || params.sorts === "-date"}
                    onClick={() =>
                      onSortTable(params.sorts === "date" ? "-date" : "date")
                    }
                    direction={params.sorts === "date" ? "asc" : "desc"}
                  >
                    Cut off Date
                  </TableSortLabel>
                </TableCell>

                <TableCell align="center">Date Modified</TableCell>
                <TableCell align="center">Date Created</TableCell>
                <TableCell align="center"> Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading || status === "pending" ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Lottie animationData={loading} className="loading-ap" />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Lottie animationData={noData} className="no-data-ap" />
                  </TableCell>
                </TableRow>
              ) : (
                cutOff?.result?.data?.map((cut) => (
                  <TableRow
                    className="table-body-ap"
                    key={cut?.id}
                    onClick={() => {
                      dispatch(setMenuData(cut));
                      dispatch(setUpdateMenu(true));
                    }}
                  >
                    <TableCell>{cut?.id}</TableCell>
                    <TableCell align="center">
                      {moment(cut?.date).format("MMMM YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      {moment(cut?.updated_at).format("MMM DD YYYY")}
                    </TableCell>

                    <TableCell align="center">
                      {moment(cut?.created_at).format("MMM DD YYYY")}
                    </TableCell>

                    <TableCell align="center">
                      {cut.state === "pending" && (
                        <StatusIndicator
                          status="For closing"
                          className="pending-indicator"
                        />
                      )}

                      {cut.state === "closed" && cut.requested_at === null && (
                        <StatusIndicator
                          status="Closed"
                          className="inActive-indicator"
                        />
                      )}
                      {cut.state === "closed" && cut.requested_at !== null && (
                        <StatusIndicator
                          status="Re-open Request"
                          className="pending-indicator"
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        disabled={
                          cut?.requested_at === null &&
                          hasAccess(["cutOff_approver"])
                        }
                        onClick={(e) => {
                          dispatch(setMenuData(cut));
                          setAnchorE1(e.currentTarget);
                        }}
                      >
                        <MoreVertOutlinedIcon className="ap-icon-actions" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

            {!isFetching && !isError && (
              <TableFooter style={{ position: "sticky", bottom: 0 }}>
                <TableRow className="table-footer-ap">
                  <TableCell colSpan={7}>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        {
                          label: "All",
                          value:
                            cutOff?.result?.total > 100
                              ? cutOff?.result?.total
                              : 100,
                        },
                      ]}
                      count={cutOff?.result?.total || 0}
                      rowsPerPage={cutOff?.result?.per_page || 10}
                      page={cutOff?.result?.current_page - 1 || 0}
                      onPageChange={onPageChange}
                      onRowsPerPageChange={onRowChange}
                      component="div"
                    />
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </TableContainer>
      </Box>

      <Menu
        anchorEl={anchorE1}
        open={Boolean(anchorE1)}
        onClose={() => {
          setAnchorE1(null);
        }}
      >
        {hasAccess(["cutOff_requestor"]) && (
          <MenuItem
            onClick={() => {
              dispatch(setUpdateMenu(true));
              setAnchorE1(null);
            }}
          >
            <ListItemIcon>
              <ModeEditOutlineOutlinedIcon className="ap-menu-icons" />
            </ListItemIcon>
            <Typography className="ap-menu-text">Update Cutoff</Typography>
          </MenuItem>
        )}
        {hasAccess(["cutOff_approver"]) && menuData?.requested_at !== null && (
          <MenuItem
            onClick={() => {
              setAnchorE1(null);
              dispatch(setUpdateMenu(true));
            }}
          >
            <ListItemIcon>
              <CheckCircleOutlineOutlinedIcon className="ap-menu-icons" />
            </ListItemIcon>
            <Typography className="ap-menu-text">Approve</Typography>
          </MenuItem>
        )}
      </Menu>

      <Dialog open={createMenu}>
        <CutoffModal />
      </Dialog>

      <Dialog open={updateMenu}>
        <CutoffModal update />
      </Dialog>
    </Box>
  );
};

export default Cutoff;

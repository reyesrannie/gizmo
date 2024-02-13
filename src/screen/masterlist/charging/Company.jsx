import React from "react";

import Breadcrums from "../../../components/customs/Breadcrums";
import SearchText from "../../../components/customs/SearchText";
import useParamsHook from "../../../services/hooks/useParamsHook";

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

import moment from "moment";
import Lottie from "lottie-react";

import { useDispatch, useSelector } from "react-redux";
import {
  useArchiveCompanyMutation,
  useCompanyQuery,
} from "../../../services/store/request";

import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import GetAppOutlinedIcon from "@mui/icons-material/GetAppOutlined";

import loading from "../../../assets/lottie/Loading-2.json";
import loadingLight from "../../../assets/lottie/Loading.json";
import noData from "../../../assets/lottie/NoData.json";
import StatusIndicator from "../../../components/customs/StatusIndicator";
import warning from "../../../assets/svg/warning.svg";
import "../../../components/styles/Company.scss";

import { useState } from "react";
import { resetPrompt, setWarning } from "../../../services/slice/promptSlice";
import AppPrompt from "../../../components/customs/AppPrompt";
import {
  resetMenu,
  setCreateMenu,
  setMenuData,
  setUpdateMenu,
} from "../../../services/slice/menuSlice";
import CompanyModal from "../../../components/customs/CompanyModal";
import { useSnackbar } from "notistack";
import { singleError } from "../../../services/functions/errorResponse";

const Company = () => {
  const [anchorE1, setAnchorE1] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const openWarning = useSelector((state) => state.prompt.warning);
  const createMenu = useSelector((state) => state.menu.createMenu);
  const updateMenu = useSelector((state) => state.menu.updateMenu);

  const { params, onStatusChange, onPageChange, onRowChange, onSearchData } =
    useParamsHook();

  const [archiveCompany, { isLoading: archiveLoading }] =
    useArchiveCompanyMutation();

  const {
    data: company,
    isLoading,
    isError,
    isFetching,
    status,
  } = useCompanyQuery(params);

  const handleArchive = async () => {
    try {
      const res = await archiveCompany(menuData).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box className="company-head-container">
        <Typography className="page-text-indicator-company">Company</Typography>
        <Box className="company-button-container">
          <SearchText onSearchData={onSearchData} />
          <Button
            variant="contained"
            color="secondary"
            className="button-add-company"
            startIcon={<AddToPhotosOutlinedIcon />}
            onClick={() => dispatch(setCreateMenu(true))}
          >
            Add
          </Button>
        </Box>
      </Box>
      <Box className="company-body-container">
        <TableContainer className="company-table-container">
          <Table stickyHeader>
            <TableHead>
              <TableRow className="table-header1-company">
                <TableCell colSpan={5}>
                  <FormControlLabel
                    className="check-box-archive-company"
                    control={<Checkbox color="secondary" />}
                    label="Archive"
                    checked={params?.status === "inactive"}
                    onChange={() =>
                      onStatusChange(
                        params?.status === "active" ? "inactive" : "active"
                      )
                    }
                  />
                </TableCell>
              </TableRow>
              <TableRow className="table-header-company">
                <TableCell>ID No.</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="center"> Status</TableCell>
                <TableCell align="center">Date Modified</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading || status === "pending" ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Lottie
                      animationData={loading}
                      className="loading-company"
                    />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Lottie
                      animationData={noData}
                      className="no-data-company"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                company?.result?.data?.map((comp) => (
                  <TableRow className="table-body-company" key={comp?.id}>
                    <TableCell>{comp?.id}</TableCell>
                    <TableCell>{comp?.code}</TableCell>

                    <TableCell>{comp?.name}</TableCell>
                    <TableCell align="center">
                      {params.status === "active" && (
                        <StatusIndicator
                          status="Active"
                          className="active-indicator"
                        />
                      )}
                      {params.status === "inactive" && (
                        <StatusIndicator
                          status="Inactive"
                          className="inActive-indicator"
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {moment(comp?.updated_at).format("MMM DD YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={(e) => {
                          dispatch(setMenuData(comp));
                          setAnchorE1(e.currentTarget);
                        }}
                      >
                        <MoreVertOutlinedIcon className="company-icon-actions" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {!isFetching && !isError && (
              <TableFooter style={{ position: "sticky", bottom: 0 }}>
                <TableRow className="table-footer-company">
                  <TableCell colSpan={2}>
                    <Button
                      variant="contained"
                      color="warning"
                      className="button-export-company"
                      startIcon={<GetAppOutlinedIcon />}
                      // onClick={() => dispatch(setCreateMenu(true))}
                    >
                      Export
                    </Button>
                  </TableCell>
                  <TableCell colSpan={5}>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 100]}
                      count={company?.result?.total || 0}
                      rowsPerPage={company?.result?.per_page || 10}
                      page={company?.result?.current_page - 1 || 0}
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
        {params?.status === "active" && (
          <MenuItem
            onClick={() => {
              dispatch(setUpdateMenu(true));
              setAnchorE1(null);
            }}
          >
            <ListItemIcon>
              <ModeEditOutlineOutlinedIcon className="company-menu-icons" />
            </ListItemIcon>
            <Typography className="company-menu-text">
              Update Company
            </Typography>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setAnchorE1(null);
            dispatch(setWarning(true));
          }}
        >
          <ListItemIcon>
            {params.status === "inactive" ? (
              <SettingsBackupRestoreOutlinedIcon className="company-menu-icons" />
            ) : (
              <DeleteForeverOutlinedIcon className="company-menu-icons" />
            )}
          </ListItemIcon>
          <Typography className="company-menu-text">
            {params.status === "inactive" ? "Restore" : "Archive"}
          </Typography>
        </MenuItem>
      </Menu>

      <Dialog open={archiveLoading} className="loading-role-create">
        <Lottie animationData={loadingLight} loop={archiveLoading} />
      </Dialog>

      <Dialog open={createMenu}>
        <CompanyModal />
      </Dialog>

      <Dialog open={updateMenu}>
        <CompanyModal companyData={menuData} update />
      </Dialog>

      <Dialog open={openWarning}>
        <AppPrompt
          image={warning}
          title={
            params.status === "active"
              ? "Archive the company?"
              : "Restore the company?"
          }
          message={
            params.status === "active"
              ? "You are about to archive this company"
              : "You are about to restore this company"
          }
          nextLineMessage={"Please confirm to continue"}
          confirmButton={
            params.status === "active" ? "Yes, Archive it!" : "Yes, Restore it!"
          }
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
            dispatch(resetMenu());
          }}
          confirmOnClick={() => handleArchive()}
        />
      </Dialog>
    </Box>
  );
};

export default Company;

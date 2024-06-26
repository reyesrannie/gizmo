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
  TableSortLabel,
  Typography,
} from "@mui/material";
import React from "react";
import moment from "moment";

import "../../../components/styles/RoleManagement.scss";
import Breadcrums from "../../../components/customs/Breadcrums";
import SearchText from "../../../components/customs/SearchText";
import useParamsHook from "../../../services/hooks/useParamsHook";
import Lottie from "lottie-react";
import loading from "../../../assets/lottie/Loading-2.json";
import loadingLight from "../../../assets/lottie/Loading.json";

import noData from "../../../assets/lottie/NoData.json";

import RolesModal from "../../../components/customs/modal/RolesModal";
import warning from "../../../assets/svg/warning.svg";

import {
  useArchiveRoleMutation,
  useRoleQuery,
} from "../../../services/store/request";
import { useDispatch, useSelector } from "react-redux";
import {
  setRolesData,
  setRolesMenu,
  setRolesUpdate,
  setRolesView,
} from "../../../services/slice/menuSlice";

import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import StatusIndicator from "../../../components/customs/StatusIndicator";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";

import { useState } from "react";
import AppPrompt from "../../../components/customs/AppPrompt";
import { resetPrompt, setWarning } from "../../../services/slice/promptSlice";
import { enqueueSnackbar } from "notistack";
import { singleError } from "../../../services/functions/errorResponse";

const RoleManagement = () => {
  const roleOpen = useSelector((state) => state.menu.roles);
  const roleOpenView = useSelector((state) => state.menu.rolesView);
  const roleOpenUpdate = useSelector((state) => state.menu.rolesUpdate);
  const openWarning = useSelector((state) => state.prompt.warning);

  const rolesData = useSelector((state) => state.menu.rolesData);

  const dispatch = useDispatch();
  const {
    params,
    onStatusChange,
    onPageChange,
    onRowChange,
    onSearchData,
    onSortTable,
  } = useParamsHook();
  const {
    data: roles,
    isLoading,
    isError,
    status,
    isFetching,
  } = useRoleQuery(params);

  const [anchorE1, setAnchorE1] = useState(null);

  const [archiveRole, { isLoading: isLoadingArchive }] =
    useArchiveRoleMutation();

  const handleArchive = async () => {
    try {
      const res = await archiveRole(rolesData).unwrap();
      enqueueSnackbar(res.message, { variant: "success" });
      dispatch(resetPrompt());
      dispatch(setRolesData(null));
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };
  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box className="role-head-container">
        <Typography className="page-text-indicator-role">
          Role Management
        </Typography>
        <Box className="role-button-container">
          <SearchText onSearchData={onSearchData} />
          <Button
            variant="contained"
            color="secondary"
            className="button-add-role"
            startIcon={<AddToPhotosOutlinedIcon />}
            onClick={() => dispatch(setRolesMenu(true))}
          >
            Add
          </Button>
        </Box>
      </Box>
      <Box className="role-body-container">
        <TableContainer className="role-table-container">
          <Table stickyHeader>
            <TableHead>
              <TableRow className="table-header1-cell">
                <TableCell colSpan={5}>
                  <FormControlLabel
                    className="check-box-archive-role"
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
              <TableRow className="table-header-cell">
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
                <TableCell>
                  <TableSortLabel
                    active={params.sorts === "name" || params.sorts === "-name"}
                    onClick={() =>
                      onSortTable(params.sorts === "name" ? "-name" : "name")
                    }
                    direction={params.sorts === "name" ? "asc" : "desc"}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Access Permission</TableCell>
                <TableCell align="center"> Status</TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={
                      params.sorts === "updated_at" ||
                      params.sorts === "-updated_at"
                    }
                    onClick={() =>
                      onSortTable(
                        params.sorts === "updated_at"
                          ? "-updated_at"
                          : "updated_at"
                      )
                    }
                    direction={params.sorts === "updated_at" ? "asc" : "desc"}
                  >
                    Date Modified
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading || status === "pending" ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Lottie animationData={loading} className="loading-roles" />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Lottie animationData={noData} className="no-data-roles" />
                  </TableCell>
                </TableRow>
              ) : (
                roles?.result?.data?.map((role) => (
                  <TableRow className="table-body-role" key={role?.id}>
                    <TableCell>{role?.id}</TableCell>
                    <TableCell>{role?.name}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        color="info"
                        className="button-add-role"
                        onClick={() => {
                          dispatch(setRolesView(true));
                          dispatch(setRolesData(role));
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
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
                      {moment(role?.updated_at).format("MMM DD YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={(e) => {
                          dispatch(setRolesData(role));
                          setAnchorE1(e.currentTarget);
                        }}
                      >
                        <MoreVertOutlinedIcon className="role-icon-actions" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {!isFetching && !isError && (
              <TableFooter style={{ position: "sticky", bottom: 0 }}>
                <TableRow className="table-footer-cell">
                  <TableCell colSpan={6}>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        {
                          label: "All",
                          value:
                            roles?.result?.total > 100
                              ? roles?.result?.total
                              : 100,
                        },
                      ]}
                      count={roles?.result?.total || 0}
                      rowsPerPage={roles?.result?.per_page || 10}
                      page={roles?.result?.current_page - 1 || 0}
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
        onClose={() => setAnchorE1(null)}
      >
        <MenuItem
          onClick={() => {
            dispatch(setRolesUpdate(true));
            setAnchorE1(null);
          }}
        >
          <ListItemIcon>
            <ModeEditOutlineOutlinedIcon className="role-menu-icons" />
          </ListItemIcon>
          <Typography className="role-menu-text">Update Role</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorE1(null);
            dispatch(setWarning(true));
          }}
        >
          <ListItemIcon>
            {params.status === "inactive" ? (
              <SettingsBackupRestoreOutlinedIcon className="role-menu-icons" />
            ) : (
              <DeleteForeverOutlinedIcon className="role-menu-icons" />
            )}
          </ListItemIcon>
          <Typography className="role-menu-text">
            {params.status === "inactive" ? "Restore" : "Archive"}
          </Typography>
        </MenuItem>
      </Menu>

      <Dialog open={isLoadingArchive} className="loading-role-create">
        <Lottie animationData={loadingLight} loop={isLoadingArchive} />
      </Dialog>

      <Dialog open={roleOpen}>
        <RolesModal />
      </Dialog>
      <Dialog open={roleOpenView}>
        <RolesModal roleData={rolesData} view />
      </Dialog>

      <Dialog open={roleOpenUpdate}>
        <RolesModal roleData={rolesData} update />
      </Dialog>

      <Dialog open={openWarning}>
        <AppPrompt
          image={warning}
          title={
            params.status === "active"
              ? "Archive the role?"
              : "Restore the role?"
          }
          message={
            params.status === "active"
              ? "You are about to archive this role"
              : "You are about to restore this role"
          }
          nextLineMessage={"Please confirm to continue"}
          confirmButton={
            params.status === "active" ? "Yes, Archive it!" : "Yes, Restore it!"
          }
          cancelButton={"Cancel"}
          cancelOnClick={() => dispatch(resetPrompt())}
          confirmOnClick={() => handleArchive()}
        />
      </Dialog>
    </Box>
  );
};

export default RoleManagement;

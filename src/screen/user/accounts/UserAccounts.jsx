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

import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import StatusIndicator from "../../../components/customs/StatusIndicator";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";

import Lottie from "lottie-react";
import React from "react";
import moment from "moment";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";

import Breadcrums from "../../../components/customs/Breadcrums";
import SearchText from "../../../components/customs/SearchText";
import useParamsHook from "../../../services/hooks/useParamsHook";
import loading from "../../../assets/lottie/Loading-2.json";
import loadingLight from "../../../assets/lottie/Loading.json";
import noData from "../../../assets/lottie/NoData.json";
import warning from "../../../assets/svg/warning.svg";
import AppPrompt from "../../../components/customs/AppPrompt";
import UserModal from "../../../components/customs/modal/UserModal";

import { singleError } from "../../../services/functions/errorResponse";

import {
  useArchiveUserMutation,
  usePasswordResetMutation,
  useUsersQuery,
} from "../../../services/store/request";
import {
  resetMenu,
  setCreateMenu,
  setMenuData,
  setUpdateMenu,
} from "../../../services/slice/menuSlice";
import {
  resetPrompt,
  setResetPassword,
  setWarning,
} from "../../../services/slice/promptSlice";

import "../../../components/styles/UserAccounts.scss";

const UserAccounts = () => {
  const createMenuOpen = useSelector((state) => state.menu.createMenu);
  const resetPassword = useSelector((state) => state.prompt.resetPassword);

  const openWarning = useSelector((state) => state.prompt.warning);
  const menuData = useSelector((state) => state.menu.menuData);
  const updateMenu = useSelector((state) => state.menu.updateMenu);

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
    data: users,
    isLoading,
    isError,
    status,
    isFetching,
  } = useUsersQuery(params);

  const [passwordReset] = usePasswordResetMutation();

  const [anchorE1, setAnchorE1] = useState(null);

  const [archiveUser, { isLoading: isLoadingArchive }] =
    useArchiveUserMutation();

  const handleArchive = async () => {
    try {
      const res = await archiveUser(menuData).unwrap();
      enqueueSnackbar(res.message, { variant: "success" });
      dispatch(resetPrompt());
      dispatch(resetMenu());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleReset = async () => {
    try {
      const res = await passwordReset(menuData).unwrap();
      enqueueSnackbar(res.message, { variant: "success" });
      dispatch(resetPrompt());
      dispatch(resetMenu());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box className="user-head-container">
        <Typography className="page-text-indicator-user-accounts">
          User Accounts
        </Typography>
        <Box className="user-button-container">
          <SearchText onSearchData={onSearchData} />
          <Button
            variant="contained"
            color="secondary"
            className="button-add-user"
            startIcon={<AddToPhotosOutlinedIcon />}
            onClick={() => dispatch(setCreateMenu(true))}
          >
            Add
          </Button>
        </Box>
      </Box>
      <Box className="user-body-container">
        <TableContainer className="user-table-container">
          <Table stickyHeader>
            <TableHead>
              <TableRow className="table-header1-user">
                <TableCell colSpan={5}>
                  <FormControlLabel
                    className="check-box-archive-user"
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
              <TableRow className="table-header-user">
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
                    active={
                      params.sorts === "username" ||
                      params.sorts === "-username"
                    }
                    onClick={() =>
                      onSortTable(
                        params.sorts === "username" ? "-username" : "username"
                      )
                    }
                    direction={params.sorts === "username" ? "asc" : "desc"}
                  >
                    Username
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={
                      params.sorts === "first_name" ||
                      params.sorts === "-first_name"
                    }
                    onClick={() =>
                      onSortTable(
                        params.sorts === "first_name"
                          ? "-first_name"
                          : "first_name"
                      )
                    }
                    direction={params.sorts === "first_name" ? "asc" : "desc"}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>Role</TableCell>
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
                  <TableCell colSpan={7} align="center">
                    <Lottie animationData={loading} className="loading-users" />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Lottie animationData={noData} className="no-data-users" />
                  </TableCell>
                </TableRow>
              ) : (
                users?.result?.data?.map((user) => (
                  <TableRow className="table-body-user" key={user?.id}>
                    <TableCell>{user?.id}</TableCell>
                    <TableCell>{user?.username}</TableCell>
                    <TableCell>{`${user?.account?.first_name} ${user?.account?.last_name}`}</TableCell>

                    <TableCell>{user?.role?.name}</TableCell>
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
                      {moment(user?.updated_at).format("MMM DD, YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={(e) => {
                          dispatch(setMenuData(user));
                          setAnchorE1(e.currentTarget);
                        }}
                      >
                        <MoreVertOutlinedIcon className="user-icon-actions" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {!isFetching && !isError && (
              <TableFooter style={{ position: "sticky", bottom: 0 }}>
                <TableRow className="table-footer-user">
                  <TableCell colSpan={7}>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        {
                          label: "All",
                          value:
                            users?.result?.total > 100
                              ? users?.result?.total
                              : 100,
                        },
                      ]}
                      count={users?.result?.total || 0}
                      rowsPerPage={users?.result?.per_page || 10}
                      page={users?.result?.current_page - 1 || 0}
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
        {params.status === "active" && (
          <MenuItem
            onClick={() => {
              setAnchorE1(null);
              dispatch(setResetPassword(true));
            }}
          >
            <ListItemIcon>
              <SettingsBackupRestoreOutlinedIcon className="user-menu-icons" />
            </ListItemIcon>
            <Typography className="user-menu-text">Reset Password</Typography>
          </MenuItem>
        )}
        {params.status === "active" && (
          <MenuItem
            onClick={() => {
              dispatch(setUpdateMenu(true));
              setAnchorE1(null);
            }}
          >
            <ListItemIcon>
              <ModeEditOutlineOutlinedIcon className="user-menu-icons" />
            </ListItemIcon>
            <Typography className="user-menu-text">Update Account</Typography>
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
              <SettingsBackupRestoreOutlinedIcon className="user-menu-icons" />
            ) : (
              <DeleteForeverOutlinedIcon className="user-menu-icons" />
            )}
          </ListItemIcon>
          <Typography className="user-menu-text">
            {params.status === "inactive" ? "Restore" : "Archive"}
          </Typography>
        </MenuItem>
      </Menu>

      <Dialog open={isLoadingArchive} className="loading-user-create">
        <Lottie animationData={loadingLight} loop={isLoadingArchive} />
      </Dialog>

      <Dialog open={createMenuOpen} className="user-modal-dialog">
        <UserModal />
      </Dialog>

      <Dialog open={updateMenu} className="user-modal-dialog">
        <UserModal menuData={menuData} update />
      </Dialog>

      <Dialog open={openWarning}>
        <AppPrompt
          image={warning}
          title={
            params.status === "active"
              ? "Archive the account?"
              : "Restore the account?"
          }
          message={
            params.status === "active"
              ? "You are about to archive this account"
              : "You are about to restore this account"
          }
          nextLineMessage={"Please confirm to continue"}
          confirmButton={
            params.status === "active" ? "Yes, Archive it!" : "Yes, Restore it!"
          }
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetMenu());
            dispatch(resetPrompt());
          }}
          confirmOnClick={() => handleArchive()}
        />
      </Dialog>

      <Dialog open={resetPassword}>
        <AppPrompt
          image={warning}
          title="Password Reset?"
          message={"You are about to reset the password"}
          nextLineMessage={"Please confirm to continue"}
          confirmButton={"Yes, Reset it!"}
          cancelButton={"Cancel"}
          cancelOnClick={() => dispatch(resetPrompt())}
          confirmOnClick={() => handleReset()}
        />
      </Dialog>
    </Box>
  );
};

export default UserAccounts;

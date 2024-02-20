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
import { useDispatch, useSelector } from "react-redux";
import {
  resetMenu,
  setCreateMenu,
  setMenuData,
  setUpdateMenu,
  setViewMenu,
} from "../../../services/slice/menuSlice";

import React from "react";
import Breadcrums from "../../../components/customs/Breadcrums";
import SearchText from "../../../components/customs/SearchText";
import useParamsHook from "../../../services/hooks/useParamsHook";
import loading from "../../../assets/lottie/Loading-2.json";
import loadingLight from "../../../assets/lottie/Loading.json";
import noData from "../../../assets/lottie/NoData.json";
import StatusIndicator from "../../../components/customs/StatusIndicator";
import warning from "../../../assets/svg/warning.svg";

import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import GetAppOutlinedIcon from "@mui/icons-material/GetAppOutlined";

import "../../../components/styles/Department.scss";
import {
  useArchiveDepartmentMutation,
  useDepartmentQuery,
} from "../../../services/store/request";
import Lottie from "lottie-react";
import moment from "moment";
import { useState } from "react";
import { resetPrompt, setWarning } from "../../../services/slice/promptSlice";
import AppPrompt from "../../../components/customs/AppPrompt";
import DepartmentModal from "../../../components/customs/modal/DepartmentModal";
import { useSnackbar } from "notistack";
import { singleError } from "../../../services/functions/errorResponse";

const Department = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorE1, setAnchorE1] = useState(null);

  const menuData = useSelector((state) => state.menu.menuData);
  const openWarning = useSelector((state) => state.prompt.warning);
  const createMenu = useSelector((state) => state.menu.createMenu);
  const updateMenu = useSelector((state) => state.menu.updateMenu);
  const viewMenu = useSelector((state) => state.menu.viewMenu);

  const {
    params,
    onStatusChange,
    onPageChange,
    onRowChange,
    onSearchData,
    onSortTable,
  } = useParamsHook();

  const {
    data: department,
    isLoading,
    isError,
    isFetching,
    status,
  } = useDepartmentQuery(params);

  const [archiveDepartment, { isLoading: archiveLoading }] =
    useArchiveDepartmentMutation();

  const handleArchive = async () => {
    try {
      const res = await archiveDepartment(menuData).unwrap();
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
      <Box className="department-head-container">
        <Typography className="page-text-indicator-department">
          Department
        </Typography>
        <Box className="department-button-container">
          <SearchText onSearchData={onSearchData} />
          <Button
            variant="contained"
            color="secondary"
            className="button-add-department"
            startIcon={<AddToPhotosOutlinedIcon />}
            onClick={() => dispatch(setCreateMenu(true))}
          >
            Add
          </Button>
        </Box>
      </Box>
      <Box className="department-body-container">
        <TableContainer className="department-table-container">
          <Table stickyHeader>
            <TableHead>
              <TableRow className="table-header1-department">
                <TableCell colSpan={5}>
                  <FormControlLabel
                    className="check-box-archive-department"
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
              <TableRow className="table-header-department">
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
                    active={params.sorts === "code" || params.sorts === "-code"}
                    onClick={() =>
                      onSortTable(params.sorts === "code" ? "-code" : "code")
                    }
                    direction={params.sorts === "code" ? "asc" : "desc"}
                  >
                    Code
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
                <TableCell align="center">Location</TableCell>
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
                    <Lottie
                      animationData={loading}
                      className="loading-department"
                    />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Lottie
                      animationData={noData}
                      className="no-data-department"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                department?.result?.data?.map((dept) => (
                  <TableRow className="table-body-department" key={dept?.id}>
                    <TableCell>{dept?.id}</TableCell>
                    <TableCell>{dept?.code}</TableCell>

                    <TableCell>{dept?.name}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        color="info"
                        className="button-add-department"
                        onClick={() => {
                          dispatch(setViewMenu(true));
                          dispatch(setMenuData(dept));
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
                      {moment(dept?.updated_at).format("MMM DD YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={(e) => {
                          dispatch(setMenuData(dept));
                          setAnchorE1(e.currentTarget);
                        }}
                      >
                        <MoreVertOutlinedIcon className="department-icon-actions" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {!isFetching && !isError && (
              <TableFooter style={{ position: "sticky", bottom: 0 }}>
                <TableRow className="table-footer-department">
                  <TableCell colSpan={2}>
                    <Button
                      variant="contained"
                      color="warning"
                      className="button-export-department"
                      startIcon={<GetAppOutlinedIcon />}
                      // onClick={() => dispatch(setCreateMenu(true))}
                    >
                      Export
                    </Button>
                  </TableCell>
                  <TableCell colSpan={5}>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 100]}
                      count={department?.result?.total || 0}
                      rowsPerPage={department?.result?.per_page || 10}
                      page={department?.result?.current_page - 1 || 0}
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
              <ModeEditOutlineOutlinedIcon className="department-menu-icons" />
            </ListItemIcon>
            <Typography className="department-menu-text">
              Update Department
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
              <SettingsBackupRestoreOutlinedIcon className="department-menu-icons" />
            ) : (
              <DeleteForeverOutlinedIcon className="department-menu-icons" />
            )}
          </ListItemIcon>
          <Typography className="department-menu-text">
            {params.status === "inactive" ? "Restore" : "Archive"}
          </Typography>
        </MenuItem>
      </Menu>

      <Dialog open={archiveLoading} className="loading-role-create">
        <Lottie animationData={loadingLight} loop={archiveLoading} />
      </Dialog>

      <Dialog open={createMenu}>
        <DepartmentModal />
      </Dialog>

      <Dialog open={updateMenu}>
        <DepartmentModal departmentData={menuData} update />
      </Dialog>

      <Dialog open={viewMenu}>
        <DepartmentModal departmentData={menuData} view />
      </Dialog>

      <Dialog open={openWarning}>
        <AppPrompt
          image={warning}
          title={
            params.status === "active"
              ? "Archive the department?"
              : "Restore the department?"
          }
          message={
            params.status === "active"
              ? "You are about to archive this department"
              : "You are about to restore this department"
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

export default Department;

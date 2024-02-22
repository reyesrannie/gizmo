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

import React from "react";
import Breadcrums from "../../../components/customs/Breadcrums";
import SearchText from "../../../components/customs/SearchText";
import useParamsHook from "../../../services/hooks/useParamsHook";
import loading from "../../../assets/lottie/Loading-2.json";
import loadingLight from "../../../assets/lottie/Loading.json";
import noData from "../../../assets/lottie/NoData.json";
import StatusIndicator from "../../../components/customs/StatusIndicator";
import warning from "../../../assets/svg/warning.svg";
import AppPrompt from "../../../components/customs/AppPrompt";
import "../../../components/styles/Location.scss";

import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import Lottie from "lottie-react";
import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { resetPrompt, setWarning } from "../../../services/slice/promptSlice";
import {
  resetMenu,
  setCreateMenu,
  setImportError,
  setImportMenu,
  setMenuData,
  setUpdateMenu,
} from "../../../services/slice/menuSlice";
import {
  useArchiveLocationMutation,
  useImportLocationMutation,
  useLocationQuery,
} from "../../../services/store/request";
import LocationModal from "../../../components/customs/modal/LocationModal";
import { singleError } from "../../../services/functions/errorResponse";
import { generateExcel } from "../../../services/functions/exportFile";
import ImportModal from "../../../components/customs/modal/ImportModal";

const Location = () => {
  const excelItems = ["ID", "CODE", "NAME", "CREATED AT", "DATE MODIFIED"];
  const [anchorE1, setAnchorE1] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const openWarning = useSelector((state) => state.prompt.warning);
  const createMenu = useSelector((state) => state.menu.createMenu);
  const updateMenu = useSelector((state) => state.menu.updateMenu);
  const importMenu = useSelector((state) => state.menu.importMenu);

  const [archiveLocation, { isLoading: archiveLoading }] =
    useArchiveLocationMutation();

  const [importLocation, { isLoading: loadingImport }] =
    useImportLocationMutation();

  const {
    params,
    onStatusChange,
    onPageChange,
    onRowChange,
    onSearchData,
    onSortTable,
  } = useParamsHook();

  const {
    data: location,
    isLoading,
    isError,
    isFetching,
    status,
  } = useLocationQuery(params);

  const handleArchive = async () => {
    try {
      const res = await archiveLocation(menuData).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const importCompanyHandler = async (submitData) => {
    try {
      const res = await importLocation(submitData).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      dispatch(setImportError(error?.data?.errors));
      singleError(error, enqueueSnackbar);
    }
  };

  return (
    <Box>
      <Box>
        <Breadcrums />
      </Box>
      <Box className="location-head-container">
        <Typography className="page-text-indicator-location">
          Location
        </Typography>
        <Box className="location-button-container">
          <SearchText onSearchData={onSearchData} />
          <Button
            variant="contained"
            color="secondary"
            className="button-add-location"
            startIcon={<AddToPhotosOutlinedIcon />}
            onClick={() => dispatch(setCreateMenu(true))}
          >
            Add
          </Button>
        </Box>
      </Box>
      <Box className="location-body-container">
        <TableContainer className="location-table-container">
          <Table stickyHeader>
            <TableHead>
              <TableRow className="table-header1-location">
                <TableCell colSpan={6}>
                  <Stack flexDirection={"row"} justifyContent="space-between">
                    <FormControlLabel
                      className="check-box-archive-location"
                      control={<Checkbox color="secondary" />}
                      label="Archive"
                      checked={params?.status === "inactive"}
                      onChange={() =>
                        onStatusChange(
                          params?.status === "active" ? "inactive" : "active"
                        )
                      }
                    />
                    <Box>
                      <Button
                        variant="contained"
                        className="button-export-location"
                        startIcon={<FileUploadOutlinedIcon />}
                        onClick={() =>
                          generateExcel(
                            "Location",
                            location?.result?.data,
                            excelItems
                          )
                        }
                      >
                        Export
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        className="button-export-location"
                        startIcon={<FileDownloadOutlinedIcon />}
                        onClick={() => dispatch(setImportMenu(true))}
                      >
                        Import
                      </Button>
                    </Box>
                  </Stack>
                </TableCell>
              </TableRow>
              <TableRow className="table-header-location">
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
                    <Lottie
                      animationData={loading}
                      className="loading-location"
                    />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Lottie
                      animationData={noData}
                      className="no-data-location"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                location?.result?.data?.map((loc) => (
                  <TableRow className="table-body-location" key={loc?.id}>
                    <TableCell>{loc?.id}</TableCell>
                    <TableCell>{loc?.code}</TableCell>

                    <TableCell>{loc?.name}</TableCell>
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
                      {moment(loc?.updated_at).format("MMM DD YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={(e) => {
                          dispatch(setMenuData(loc));
                          setAnchorE1(e.currentTarget);
                        }}
                      >
                        <MoreVertOutlinedIcon className="location-icon-actions" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

            {!isFetching && !isError && (
              <TableFooter style={{ position: "sticky", bottom: 0 }}>
                <TableRow className="table-footer-location">
                  <TableCell colSpan={6}>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 100]}
                      count={location?.result?.total || 0}
                      rowsPerPage={location?.result?.per_page || 10}
                      page={location?.result?.current_page - 1 || 0}
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
              <ModeEditOutlineOutlinedIcon className="location-menu-icons" />
            </ListItemIcon>
            <Typography className="location-menu-text">
              Update location
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
              <SettingsBackupRestoreOutlinedIcon className="location-menu-icons" />
            ) : (
              <DeleteForeverOutlinedIcon className="location-menu-icons" />
            )}
          </ListItemIcon>
          <Typography className="location-menu-text">
            {params.status === "inactive" ? "Restore" : "Archive"}
          </Typography>
        </MenuItem>
      </Menu>

      <Dialog open={archiveLoading} className="loading-location-create">
        <Lottie animationData={loadingLight} loop={archiveLoading} />
      </Dialog>

      <Dialog open={createMenu}>
        <LocationModal />
      </Dialog>

      <Dialog open={updateMenu}>
        <LocationModal locationData={menuData} update />
      </Dialog>

      <Dialog open={importMenu}>
        <ImportModal
          title="Location"
          importData={importCompanyHandler}
          isLoading={loadingImport}
        />
      </Dialog>

      <Dialog open={openWarning}>
        <AppPrompt
          image={warning}
          title={
            params.status === "active"
              ? "Archive the location?"
              : "Restore the location?"
          }
          message={
            params.status === "active"
              ? "You are about to archive this location"
              : "You are about to restore this location"
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

export default Location;

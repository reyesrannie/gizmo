import React from "react";

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

import moment from "moment";
import Lottie from "lottie-react";

import { useDispatch, useSelector } from "react-redux";
import {
  useArchiveAccountTitlesMutation,
  useArchivecTitlesMutation,
  useArchivegcTitlesMutation,
  useArchiveggpTitlesMutation,
  useArchivegpTitlesMutation,
  useArchivepTitlesMutation,
  useImportAccountTitlesMutation,
  useImportcTitlesMutation,
  useImportgcTitlesMutation,
  useImportggpTitlesMutation,
  useImportgpTitlesMutation,
  useImportpTitlesMutation,
} from "../../../services/store/request";

import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import loading from "../../../assets/lottie/Loading-2.json";
import loadingLight from "../../../assets/lottie/Loading.json";
import noData from "../../../assets/lottie/NoData.json";
import StatusIndicator from "../../../components/customs/StatusIndicator";
import warning from "../../../assets/svg/warning.svg";
import "../../../components/styles/AccountTitles.scss";
import "../../../components/styles/TagTransaction.scss";
import "../../../components/styles/RolesModal.scss";

import { useState } from "react";
import { resetPrompt, setWarning } from "../../../services/slice/promptSlice";
import { useSnackbar } from "notistack";
import { singleError } from "../../../services/functions/errorResponse";
import AppPrompt from "../../../components/customs/AppPrompt";
import {
  resetMenu,
  setImportError,
  setImportMenu,
  setMenuData,
  setUpdateMenu,
} from "../../../services/slice/menuSlice";
import { generateExcel } from "../../../services/functions/exportFile";
import ImportModal from "../../../components/customs/modal/ImportModal";
import AccountTitlesModal from "../../../components/customs/modal/AccountTitlesModal";

const TitleTable = ({
  params,
  data,
  excelItems,
  onSortTable,
  isLoading,
  status,
  isError,
  isFetching,
  onPageChange,
  onRowChange,
  onStatusChange,
}) => {
  const [anchorE1, setAnchorE1] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const createMenu = useSelector((state) => state.menu.createMenu);
  const updateMenu = useSelector((state) => state.menu.updateMenu);
  const importMenu = useSelector((state) => state.menu.importMenu);
  const openWarning = useSelector((state) => state.prompt.warning);

  const header =
    useSelector((state) => state.transaction.header) || "Account Titles";

  const [archiveTitle, { isLoading: archiveLoading }] =
    useArchiveAccountTitlesMutation();
  const [importTitle, { isLoading: loadingImport }] =
    useImportAccountTitlesMutation();

  const [archiveGGP, { isLoading: ggpLoading }] = useArchiveggpTitlesMutation();
  const [importGGPTitle, { isLoading: loadingGGP }] =
    useImportggpTitlesMutation();

  const [archiveGP, { isLoading: gpLoading }] = useArchivegpTitlesMutation();
  const [importGPTitle, { isLoading: loadingGP }] = useImportgpTitlesMutation();

  const [archiveP, { isLoading: pLoading }] = useArchivepTitlesMutation();
  const [importPTitle, { isLoading: loadingP }] = useImportpTitlesMutation();

  const [archiveC, { isLoading: cLoading }] = useArchivecTitlesMutation();
  const [importCTitle, { isLoading: loadingC }] = useImportcTitlesMutation();

  const [archiveGC, { isLoading: gcLoading }] = useArchivegcTitlesMutation();
  const [importGCTitle, { isLoading: loadingGC }] = useImportgcTitlesMutation();

  const handleArchive = async (importFunction) => {
    try {
      const res = await importFunction(menuData).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const importHandler = async (submitData, importFunction) => {
    try {
      const res = await importFunction(submitData).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      dispatch(setImportError(error?.data?.errors));
      singleError(error, enqueueSnackbar);
    }
  };

  const archiveAccountTitleHandler = async () => {
    switch (header) {
      case "Account Titles":
        return handleArchive(archiveTitle);
      case "Great Grandparent":
        return handleArchive(archiveGGP);
      case "Grandparent":
        return handleArchive(archiveGP);
      case "Parent":
        return handleArchive(archiveP);
      case "Child":
        return handleArchive(archiveC);
      case "Grandchild":
        return handleArchive(archiveGC);
      default:
        return;
    }
  };

  const importCompanyHandler = async (submitData) => {
    switch (header) {
      case "Account Titles":
        return importHandler(submitData, importTitle);
      case "Great Grandparent":
        return importHandler(submitData, importGGPTitle);
      case "Grandparent":
        return importHandler(submitData, importGPTitle);
      case "Parent":
        return importHandler(submitData, importPTitle);
      case "Child":
        return importHandler(submitData, importCTitle);
      case "Grandchild":
        return importHandler(submitData, importGCTitle);
      default:
        return;
    }
  };

  return (
    <Box className="accountTitle-body-container">
      <TableContainer className="accountTitle-table-container">
        <Table stickyHeader>
          <TableHead>
            <TableRow className="table-header1-accountTitle">
              <TableCell colSpan={header === "Account Titles" ? 7 : 6}>
                <Stack flexDirection={"row"} justifyContent="space-between">
                  <FormControlLabel
                    className="check-box-archive-accountTitle"
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
                      className="button-export-accountTitle"
                      startIcon={<FileUploadOutlinedIcon />}
                      onClick={() =>
                        generateExcel(
                          "AccountTitles",
                          data?.result?.data,
                          excelItems
                        )
                      }
                    >
                      Export
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      className="button-export-accountTitle"
                      startIcon={<FileDownloadOutlinedIcon />}
                      onClick={() => dispatch(setImportMenu(true))}
                    >
                      Import
                    </Button>
                  </Box>
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow className="table-header-accountTitle">
              <TableCell>
                <TableSortLabel
                  active={params?.sorts === "id" || params?.sorts === "-id"}
                  onClick={() =>
                    onSortTable(params?.sorts === "id" ? "-id" : "id")
                  }
                  direction={params?.sorts === "id" ? "asc" : "desc"}
                >
                  ID No.
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={params?.sorts === "code" || params?.sorts === "-code"}
                  onClick={() =>
                    onSortTable(params?.sorts === "code" ? "-code" : "code")
                  }
                  direction={params?.sorts === "code" ? "asc" : "desc"}
                >
                  Code
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={params?.sorts === "name" || params?.sorts === "-name"}
                  onClick={() =>
                    onSortTable(params?.sorts === "name" ? "-name" : "name")
                  }
                  direction={params?.sorts === "name" ? "asc" : "desc"}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              {header === "Account Titles" && (
                <TableCell>
                  <TableSortLabel
                    active={
                      params?.sorts === "type" || params?.sorts === "-type"
                    }
                    onClick={() =>
                      onSortTable(params?.sorts === "type" ? "-type" : "type")
                    }
                    direction={params?.sorts === "type" ? "asc" : "desc"}
                  >
                    Level
                  </TableSortLabel>
                </TableCell>
              )}
              <TableCell align="center"> Status</TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={
                    params?.sorts === "updated_at" ||
                    params?.sorts === "-updated_at"
                  }
                  onClick={() =>
                    onSortTable(
                      params?.sorts === "updated_at"
                        ? "-updated_at"
                        : "updated_at"
                    )
                  }
                  direction={params?.sorts === "updated_at" ? "asc" : "desc"}
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
                <TableCell
                  colSpan={header === "Account Titles" ? 7 : 6}
                  align="center"
                >
                  <Lottie
                    animationData={loading}
                    className="loading-accountTitle"
                  />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={header === "Account Titles" ? 7 : 6}
                  align="center"
                >
                  <Lottie
                    animationData={noData}
                    className="no-data-accountTitle"
                  />
                </TableCell>
              </TableRow>
            ) : (
              data?.result?.data?.map((comp) => (
                <TableRow className="table-body-accountTitle" key={comp?.id}>
                  <TableCell>{comp?.id}</TableCell>
                  <TableCell>{comp?.code}</TableCell>

                  <TableCell>{comp?.name}</TableCell>
                  {header === "Account Titles" && (
                    <TableCell>{comp?.type}</TableCell>
                  )}
                  <TableCell align="center">
                    {params?.status === "active" && (
                      <StatusIndicator
                        status="Active"
                        className="active-indicator"
                      />
                    )}
                    {params?.status === "inactive" && (
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
                      <MoreVertOutlinedIcon className="accountTitle-icon-actions" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {!isFetching && !isError && (
            <TableFooter style={{ position: "sticky", bottom: 0 }}>
              <TableRow className="table-footer-accountTitle">
                <TableCell colSpan={header === "Account Titles" ? 7 : 6}>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      {
                        label: "All",
                        value:
                          data?.result?.total > 100 ? data?.result?.total : 100,
                      },
                    ]}
                    count={data?.result?.total || 0}
                    rowsPerPage={data?.result?.per_page || 10}
                    page={data?.result?.current_page - 1 || 0}
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
              <ModeEditOutlineOutlinedIcon className="accountTitle-menu-icons" />
            </ListItemIcon>
            <Typography className="accountTitle-menu-text">Update</Typography>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setAnchorE1(null);
            dispatch(setWarning(true));
          }}
        >
          <ListItemIcon>
            {params?.status === "inactive" ? (
              <SettingsBackupRestoreOutlinedIcon className="accountTitle-menu-icons" />
            ) : (
              <DeleteForeverOutlinedIcon className="accountTitle-menu-icons" />
            )}
          </ListItemIcon>
          <Typography className="accountTitle-menu-text">
            {params?.status === "inactive" ? "Restore" : "Archive"}
          </Typography>
        </MenuItem>
      </Menu>

      <Dialog
        open={
          archiveLoading ||
          ggpLoading ||
          gpLoading ||
          pLoading ||
          cLoading ||
          gcLoading
        }
        className="loading-role-create"
      >
        <Lottie animationData={loadingLight} loop />
      </Dialog>

      <Dialog open={createMenu}>
        <AccountTitlesModal />
      </Dialog>

      <Dialog open={updateMenu}>
        <AccountTitlesModal accountTitlesData={menuData} update />
      </Dialog>

      <Dialog open={importMenu}>
        <ImportModal
          title={header}
          importData={importCompanyHandler}
          isLoading={
            loadingImport ||
            loadingImport ||
            loadingGGP ||
            loadingGP ||
            loadingP ||
            loadingC ||
            loadingGC
          }
        />
      </Dialog>

      <Dialog open={openWarning}>
        <AppPrompt
          image={warning}
          title={
            params?.status === "active"
              ? "Archive the Title?"
              : "Restore the Title?"
          }
          message={
            params?.status === "active"
              ? "You are about to archive this Account Title"
              : "You are about to restore this Account Title"
          }
          nextLineMessage={"Please confirm to continue"}
          confirmButton={
            params?.status === "active"
              ? "Yes, Archive it!"
              : "Yes, Restore it!"
          }
          cancelButton={"Cancel"}
          cancelOnClick={() => {
            dispatch(resetPrompt());
            dispatch(resetMenu());
          }}
          confirmOnClick={() => archiveAccountTitleHandler()}
        />
      </Dialog>
    </Box>
  );
};

export default TitleTable;

import React from "react";

import Breadcrums from "../../components/customs/Breadcrums";
import SearchText from "../../components/customs/SearchText";
import useParamsHook from "../../services/hooks/useParamsHook";

import {
  Box,
  Button,
  Dialog,
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

import moment from "moment";
import Lottie from "lottie-react";

import { useDispatch, useSelector } from "react-redux";
import {
  useArchiveCompanyMutation,
  useCompanyQuery,
  useImportCompanyMutation,
} from "../../services/store/request";

import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";

import loading from "../../assets/lottie/Loading-2.json";
import loadingLight from "../../assets/lottie/Loading.json";
import noData from "../../assets/lottie/NoData.json";
import StatusIndicator from "../../components/customs/StatusIndicator";
import warning from "../../assets/svg/warning.svg";
import "../../components/styles/TagTransaction.scss";

import { useState } from "react";
import { resetPrompt, setWarning } from "../../services/slice/promptSlice";
import { useSnackbar } from "notistack";
import { singleError } from "../../services/functions/errorResponse";
import AppPrompt from "../../components/customs/AppPrompt";
import {
  resetMenu,
  setCreateMenu,
  setImportError,
  setMenuData,
  setUpdateMenu,
} from "../../services/slice/menuSlice";
import CompanyModal from "../../components/customs/modal/CompanyModal";
import ImportModal from "../../components/customs/modal/ImportModal";
import { setDate } from "../../services/slice/syncSlice";
import DateRange from "../../components/customs/modal/DateRange";
import TransactionModal from "../../components/customs/modal/TransactionModal";

const TagTransaction = () => {
  const date = useSelector((state) => state.sync.date);
  const [anchorE1, setAnchorE1] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const openWarning = useSelector((state) => state.prompt.warning);
  const createMenu = useSelector((state) => state.menu.createMenu);
  const updateMenu = useSelector((state) => state.menu.updateMenu);

  const { params, onPageChange, onRowChange, onSearchData, onSortTable } =
    useParamsHook();

  const [archiveCompany, { isLoading: archiveLoading }] =
    useArchiveCompanyMutation();

  const [importCompany, { isLoading: loadingImport }] =
    useImportCompanyMutation();

  const {
    data: tagTransaction,
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

  const importCompanyHandler = async (submitData) => {
    try {
      const res = await importCompany(submitData).unwrap();
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
      <Box className="tag-transaction-head-container">
        <Typography className="page-text-indicator-tag-transaction">
          Tag Transaction
        </Typography>
        <Box className="tag-transaction-button-container">
          <SearchText onSearchData={onSearchData} />
          {/* <Button
            variant="contained"
            color="secondary"
            className="button-add-tag-transaction"
            startIcon={<SyncOutlinedIcon />}
            onClick={() => dispatch(setDate(true))}
          >
            Sync
          </Button> */}

          <Button
            variant="contained"
            color="secondary"
            className="button-add-tag-transaction"
            startIcon={<AddToPhotosOutlinedIcon />}
            onClick={() => dispatch(setCreateMenu(true))}
          >
            Add
          </Button>
        </Box>
      </Box>
      <Box className="tag-transaction-body-container">
        <TableContainer className="tag-transaction-table-container">
          <Table stickyHeader>
            <TableHead>
              <TableRow className="table-header1-import-tag-transaction">
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
                      className="loading-tag-transaction"
                    />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Lottie
                      animationData={noData}
                      className="no-data-tag-transaction"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                tagTransaction?.result?.data?.map((comp) => (
                  <TableRow
                    className="table-body-tag-transaction"
                    key={comp?.id}
                  >
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
                        <MoreVertOutlinedIcon className="tag-transaction-icon-actions" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {!isFetching && !isError && (
              <TableFooter style={{ position: "sticky", bottom: 0 }}>
                <TableRow className="table-footer-tag-transaction">
                  <TableCell colSpan={6}>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 100]}
                      count={tagTransaction?.result?.total || 0}
                      rowsPerPage={tagTransaction?.result?.per_page || 10}
                      page={tagTransaction?.result?.current_page - 1 || 0}
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
              <ModeEditOutlineOutlinedIcon className="tag-transaction-menu-icons" />
            </ListItemIcon>
            <Typography className="tag-transaction-menu-text">
              Update TagTransaction
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
              <SettingsBackupRestoreOutlinedIcon className="tag-transaction-menu-icons" />
            ) : (
              <DeleteForeverOutlinedIcon className="tag-transaction-menu-icons" />
            )}
          </ListItemIcon>
          <Typography className="tag-transaction-menu-text">
            {params.status === "inactive" ? "Restore" : "Archive"}
          </Typography>
        </MenuItem>
      </Menu>

      <Dialog open={archiveLoading} className="loading-role-create">
        <Lottie animationData={loadingLight} loop={archiveLoading} />
      </Dialog>

      <Dialog open={createMenu} className="transaction-modal-dialog">
        <TransactionModal />
      </Dialog>

      <Dialog open={updateMenu}>
        <CompanyModal companyData={menuData} update />
      </Dialog>

      <Dialog open={date}>
        <DateRange />
      </Dialog>

      <Dialog open={openWarning}>
        <AppPrompt
          image={warning}
          title={
            params.status === "active"
              ? "Archive the tag-transaction?"
              : "Restore the tag-transaction?"
          }
          message={
            params.status === "active"
              ? "You are about to archive this tag-transaction"
              : "You are about to restore this tag-transaction"
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

export default TagTransaction;

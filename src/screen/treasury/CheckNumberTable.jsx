import React from "react";

import {
  Badge,
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Menu,
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
  TextField,
  Typography,
} from "@mui/material";

import moment from "moment";
import Lottie from "lottie-react";

import { useDispatch, useSelector } from "react-redux";

import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

import loading from "../../assets/lottie/Loading-2.json";
import noData from "../../assets/lottie/NoData.json";
import StatusIndicator from "../../components/customs/StatusIndicator";
import "../../components/styles/TagTransaction.scss";
import "../../components/styles/UserModal.scss";
import "../../components/styles/AccountsPayable.scss";

import { useState } from "react";

import {
  resetMenu,
  setCheckMenu,
  setCreateMenu,
  setImportError,
  setImportMenu,
  setMenuData,
  setUpdateMenu,
  setViewAccountingEntries,
  setViewMenu,
  setVoidMenu,
} from "../../services/slice/menuSlice";

import {
  useAccountTitlesQuery,
  useApQuery,
  useDocumentTypeQuery,
  useImportChecksMutation,
  useReadTransactionCheckMutation,
} from "../../services/store/request";
import TransactionModalAp from "../../components/customs/modal/TransactionModalAp";
import { setVoucher } from "../../services/slice/optionsSlice";
import TransactionModalApprover from "../../components/customs/modal/TransactionModalApprover";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import orderBySchema from "../../schemas/orderBySchema";
import Autocomplete from "../../components/customs/AutoComplete";
import ClearIcon from "@mui/icons-material/Clear";
import { AdditionalFunction } from "../../services/functions/AdditionalFunction";
import { hasAccess } from "../../services/functions/access";
import TreasuryModal from "../../components/customs/modal/TreasuryModal";
import CheckNumberModal from "../../components/customs/modal/CheckNumberModal";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import {
  generateChecks,
  generateExcel,
} from "../../services/functions/exportFile";
import ImportModal from "../../components/customs/modal/ImportModal";
import { enqueueSnackbar } from "notistack";
import { resetPrompt } from "../../services/slice/promptSlice";
import { singleError } from "../../services/functions/errorResponse";

const CheckNumberTable = ({
  isLoading,
  isError,
  tagTransaction,
  isFetching,
  onPageChange,
  onRowChange,
  onOrderBy,
}) => {
  const excelItems = [
    "Check Number",
    "Bank",
    "Amount",
    "Status",
    "Date Modified",
  ];
  const [anchorE1, setAnchorE1] = useState(null);
  const dispatch = useDispatch();
  const updateMenu = useSelector((state) => state.menu.updateMenu);
  const createMenu = useSelector((state) => state.menu.createMenu);
  const importMenu = useSelector((state) => state.menu.importMenu);

  const { convertToPeso } = AdditionalFunction();

  const {
    data: accountTitles,
    isLoading: loadingTitles,
    isSuccess: successTitles,
  } = useAccountTitlesQuery({
    status: "active",
    pagination: "none",
  });

  const { data: ap } = useApQuery({
    status: "active",
    pagination: "none",
  });

  const [importChecks, { isLoading: loadingImport }] =
    useImportChecksMutation();

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(orderBySchema),
    defaultValues: {
      orderBy: null,
    },
  });

  const importCompanyHandler = async (submitData) => {
    const obj = submitData?.map((items) => ({
      check_no: items?.[`Check Number`],
      coa_id: accountTitles?.result?.find(
        (coa) => coa.code.toString() === items?.Code.toString()
      )?.id,
    }));

    try {
      const res = await importChecks(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      dispatch(setImportError(error?.data?.errors));
      singleError(error, enqueueSnackbar);
    }
  };

  return (
    <Box className="tag-transaction-body-container">
      <TableContainer className="tag-transaction-table-container">
        <Table stickyHeader>
          <TableHead>
            <TableRow className="table-header1-supplier">
              <TableCell colSpan={7}>
                <Stack flexDirection={"row"} justifyContent="space-between">
                  .
                  <Box>
                    <Button
                      variant="contained"
                      className="button-export-supplier"
                      startIcon={<FileUploadOutlinedIcon />}
                      onClick={() =>
                        generateChecks(
                          "Check Numbers",
                          tagTransaction?.result?.data,
                          excelItems
                        )
                      }
                    >
                      Export
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      className="button-export-supplier"
                      startIcon={<FileDownloadOutlinedIcon />}
                      onClick={() => dispatch(setImportMenu(true))}
                    >
                      Import
                    </Button>
                  </Box>
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow className="table-header1-import-tag-transaction">
              <TableCell>Check No.</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell align="center">Bank</TableCell>
              <TableCell align="center">Check Date</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">View</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Lottie
                    animationData={loading}
                    className="loading-tag-transaction"
                  />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Lottie
                    animationData={noData}
                    className="no-data-tag-transaction"
                  />
                </TableCell>
              </TableRow>
            ) : (
              tagTransaction?.result?.data?.map((tag) => {
                return (
                  <TableRow
                    className="table-body-tag-transaction"
                    key={tag?.id}
                    onClick={() => {
                      dispatch(setMenuData(tag));
                      dispatch(setUpdateMenu(true));
                    }}
                  >
                    <TableCell>{tag?.check_no}</TableCell>
                    <TableCell>
                      <Typography className="tag-transaction-company-name">
                        {tag?.supplier?.name ? tag.supplier.name : <>&mdash;</>}
                      </Typography>
                      <Typography className="tag-transaction-company-tin">
                        {tag?.supplier?.name ? tag.supplier.tin : <>&mdash;</>}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography className="tag-transaction-company-name">
                        {tag?.amount ? (
                          convertToPeso(parseFloat(tag?.amount).toFixed(2))
                        ) : (
                          <>&mdash;</>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography className="tag-transaction-company-name">
                        {tag?.coa?.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {tag?.check_date ? (
                        moment(tag?.check_date).format("MMM DD YYYY")
                      ) : (
                        <>&mdash;</>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <StatusIndicator
                        status={tag?.state}
                        className="computation-indicator"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <IconButton>
                        <RemoveRedEyeOutlinedIcon className="tag-transaction-icon-actions" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
          {isFetching && (
            <TableFooter style={{ position: "sticky", bottom: 0 }}>
              <TableRow className="table-footer-tag-transaction">
                <TableCell colSpan={7}>
                  <LinearProgress color="secondary" />
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
          {!isFetching && !isError && (
            <TableFooter style={{ position: "sticky", bottom: 0 }}>
              <TableRow className="table-footer-tag-transaction">
                <TableCell colSpan={7}>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      {
                        label: "All",
                        value:
                          tagTransaction?.result?.total > 100
                            ? tagTransaction?.result?.total
                            : 100,
                      },
                    ]}
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

      <Menu
        anchorEl={anchorE1}
        open={Boolean(anchorE1)}
        onClose={() => {
          setAnchorE1(null);
        }}
        className="table-sort-tag-transaction"
      >
        <Autocomplete
          control={control}
          name={"orderBy"}
          options={ap?.result || []}
          getOptionLabel={(option) =>
            `${option.company_code} - ${option.description}`
          }
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          onClose={() => {
            watch("orderBy") !== null && onOrderBy(watch("orderBy")?.id);
            setAnchorE1(null);
          }}
          renderInput={(params) => (
            <TextField
              name="orderBy"
              {...params}
              label="AP "
              size="small"
              variant="outlined"
              error={Boolean(errors.orderBy)}
              helperText={errors.orderBy?.message}
              className="table-sort-select-tag-transaction"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    {watch("orderBy") && (
                      <IconButton
                        onClick={() => {
                          setValue("orderBy", null);

                          onOrderBy("");
                        }}
                        className="icon-clear-user"
                      >
                        <ClearIcon />
                      </IconButton>
                    )}
                  </>
                ),
              }}
            />
          )}
          disableClearable
        />
      </Menu>

      <Dialog
        open={createMenu || updateMenu}
        onClose={() => dispatch(resetMenu())}
        className="transaction-modal-dialog"
      >
        <CheckNumberModal />
      </Dialog>

      <Dialog open={importMenu}>
        <ImportModal
          title="Check Numbers"
          importData={importCompanyHandler}
          isLoading={loadingImport}
        />
      </Dialog>
    </Box>
  );
};

export default CheckNumberTable;

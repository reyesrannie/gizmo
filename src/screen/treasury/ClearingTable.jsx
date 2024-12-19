import React, { useEffect } from "react";

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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";

import moment from "moment";
import Lottie from "lottie-react";

import { useDispatch, useSelector } from "react-redux";

import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

import loading from "../../assets/lottie/Loading-2.json";
import noData from "../../assets/lottie/NoData.json";
import StatusIndicator from "../../components/customs/StatusIndicator";
import "../../components/styles/TagTransaction.scss";
import "../../components/styles/UserModal.scss";
import "../../components/styles/AccountsPayable.scss";

import { useState } from "react";

import {
  resetMenu,
  setMenuDataMultiple,
  setViewMenu,
} from "../../services/slice/menuSlice";

import { setVoucher } from "../../services/slice/optionsSlice";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import orderBySchema from "../../schemas/orderBySchema";
import Autocomplete from "../../components/customs/AutoComplete";
import ClearIcon from "@mui/icons-material/Clear";
import { AdditionalFunction } from "../../services/functions/AdditionalFunction";
import TreasuryModal from "../../components/customs/modal/TreasuryModal";
import { enqueueSnackbar } from "notistack";
import { resetPrompt } from "../../services/slice/promptSlice";
import { singleError } from "../../services/functions/errorResponse";
import { setClearChecks } from "../../services/slice/syncSlice";
import { useApQuery } from "../../services/api/apApi";
import { useDocumentTypeQuery } from "../../services/api/documentTypeApi";
import {
  useReleaseCVoucherMutation,
  useReleasedCVoucherMutation,
} from "../../services/api/checkVoucherApi";
import ClearCheck from "../../components/customs/ClearCheck";

const CheckTable = ({
  params,
  isLoading,
  isError,
  tagTransaction,
  isFetching,
  onPageChange,
  onRowChange,
  onOrderBy,
}) => {
  const [anchorE1, setAnchorE1] = useState(null);
  const dispatch = useDispatch();

  const viewMenu = useSelector((state) => state.menu.viewMenu);
  const clearChecks = useSelector((state) => state.sync.clearChecks);

  const { convertToPeso } = AdditionalFunction();

  const { data: documentType, isLoading: loadingDocument } =
    useDocumentTypeQuery({
      status: "active",
      pagination: "none",
    });

  const [releasedVoucher, { isLoading: releasedLoading }] =
    useReleasedCVoucherMutation();

  const [forApprovalVoucher, { isLoading: forApprovalLoading }] =
    useReleaseCVoucherMutation();

  const { data: ap } = useApQuery({
    status: "active",
    pagination: "none",
  });

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(orderBySchema),
    defaultValues: {
      orderBy: null,
      check_ids: [],
    },
  });

  useEffect(() => {
    if (clearChecks) {
      setValue("check_ids", []);
    }
  }, [clearChecks]);

  const handleReleaseVoucher = async () => {
    const obj = { check_ids: watch("check_ids") };
    try {
      const res = await releasedVoucher(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
      setValue("check_ids", []);
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleApproveVoucher = async () => {
    const obj = { check_ids: watch("check_ids") };
    try {
      const res = await forApprovalVoucher(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
      setValue("check_ids", []);
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  return (
    <Box className="tag-transaction-body-container">
      <TableContainer className="tag-transaction-table-container">
        <form>
          <Table stickyHeader>
            <TableHead>
              <TableRow className="table-header1-import-tag-transaction">
                <TableCell align="center">
                  <FormControlLabel
                    className="check-box-archive-ap"
                    control={
                      <Checkbox
                        color="primary"
                        className="check-box-filing"
                        indeterminate={
                          watch("check_ids")?.length !==
                            tagTransaction?.result?.total &&
                          watch("check_ids")?.length !== 0
                        }
                        checked={
                          watch("check_ids")?.length ===
                          tagTransaction?.result?.total
                        }
                        onChange={(e) => {
                          dispatch(setClearChecks(false));
                          e?.target?.checked
                            ? setValue(
                                "check_ids",
                                tagTransaction?.result?.data
                              )
                            : setValue("check_ids", []);
                        }}
                      />
                    }
                  />
                </TableCell>
                <TableCell>Check #</TableCell>
                <TableCell>Bank</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell align="center"> Status</TableCell>
                <TableCell align="center">Check Date</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {forApprovalLoading ||
              releasedLoading ||
              loadingDocument ||
              isLoading ? (
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
                    >
                      <TableCell align="center">
                        <FormControlLabel
                          className="check-box-archive-ap"
                          control={
                            <Controller
                              name="check_ids"
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  color="secondary"
                                  sx={{ zIndex: 0 }}
                                  checked={Boolean(
                                    watch("check_ids")?.find(
                                      (item) => item?.id === tag?.id
                                    )
                                  )}
                                  onClick={(event) => event.stopPropagation()}
                                  onChange={(event) => {
                                    const checked = event.target.checked;
                                    const currentValue =
                                      watch("check_ids") || [];
                                    const newValue = checked
                                      ? [...currentValue, tag]
                                      : currentValue.filter(
                                          (id) => id?.id !== tag?.id
                                        );
                                    field.onChange(newValue);
                                  }}
                                />
                              )}
                            />
                          }
                        />
                      </TableCell>

                      <TableCell>{tag?.check_no}</TableCell>
                      <TableCell>
                        {tag?.bank_title?.bank_account?.bank?.name}
                      </TableCell>
                      <TableCell>
                        {convertToPeso(parseFloat(tag?.amount).toFixed(2))}
                      </TableCell>
                      <TableCell align="center">
                        {tag?.state === "Paid" && (
                          <StatusIndicator
                            status="For Clearing"
                            className="computation-indicator"
                          />
                        )}

                        {tag?.state === "Cleared" && (
                          <StatusIndicator
                            status="Cleared"
                            className="approved-indicator"
                          />
                        )}

                        {tag?.state === "Clearing" && (
                          <StatusIndicator
                            status="For Clearing"
                            className="computation-indicator"
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {moment(tag?.check_date).format("MMM DD YYYY")}
                      </TableCell>
                      <TableCell align="center">
                        {watch("check_ids")?.length === 0 && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            className="add-transaction-button clearing"
                            onClick={() => {
                              dispatch(setMenuDataMultiple([tag]));
                              dispatch(setViewMenu(true));
                            }}
                          >
                            Clear
                          </Button>
                        )}
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
                  {watch("check_ids")?.length !== 0 && (
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        className="add-transaction-button clearing"
                        onClick={() => {
                          dispatch(setMenuDataMultiple(watch("check_ids")));
                          dispatch(setViewMenu(true));
                        }}
                      >
                        Clear
                      </Button>
                    </TableCell>
                  )}
                  {watch("check_ids").length !== 0 &&
                    params?.state === "For Releasing" && (
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="success"
                          className="add-transaction-button treasury"
                          onClick={() => {
                            handleReleaseVoucher();
                          }}
                        >
                          Release
                        </Button>
                      </TableCell>
                    )}

                  {watch("check_ids").length !== 0 &&
                    params?.state === "Check Approval" && (
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="success"
                          className="add-transaction-button treasury"
                          onClick={() => {
                            handleApproveVoucher();
                          }}
                        >
                          Approve
                        </Button>
                      </TableCell>
                    )}
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
        </form>
      </TableContainer>

      <Dialog open={viewMenu} className="transaction-modal-dialog">
        <ClearCheck />
      </Dialog>
    </Box>
  );
};

export default CheckTable;

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
  setMenuData,
  setMenuDataMultiple,
  setUpdateMenu,
  setViewMenu,
} from "../../services/slice/menuSlice";

import {
  useApQuery,
  useDocumentTypeQuery,
  useReadTransactionCheckMutation,
  useReleaseCVoucherMutation,
  useReleasedCVoucherMutation,
} from "../../services/store/request";
import { setVoucher } from "../../services/slice/optionsSlice";
import socket from "../../services/functions/serverSocket";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import orderBySchema from "../../schemas/orderBySchema";
import Autocomplete from "../../components/customs/AutoComplete";
import ClearIcon from "@mui/icons-material/Clear";
import { AdditionalFunction } from "../../services/functions/AdditionalFunction";
import { hasAccess } from "../../services/functions/access";
import TreasuryModal from "../../components/customs/modal/TreasuryModal";
import { enqueueSnackbar } from "notistack";
import { resetPrompt } from "../../services/slice/promptSlice";
import { singleError } from "../../services/functions/errorResponse";
import TreasuryMultiple from "../../components/customs/modal/TreasuryMultiple";

const CheckTable = ({
  params,
  onSortTable,
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
  const updateMenu = useSelector((state) => state.menu.updateMenu);

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

  const [readTransaction] = useReadTransactionCheckMutation();

  const handleRead = async (data) => {
    const obj = {
      id: data?.id,
    };
    try {
      const res = await readTransaction(obj).unwrap();
      socket.emit("transaction_read");
    } catch (error) {}
  };

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

  const handleReleaseVoucher = async () => {
    const obj = { check_ids: watch("check_ids") };
    try {
      const res = await releasedVoucher(obj).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      socket.emit("transaction_preparation", {
        ...obj,
      });
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
      socket.emit("transaction_preparation", {
        ...obj,
      });
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
                {(hasAccess("check_approval") ||
                  params?.state === "For Releasing" ||
                  params?.state === "For Preparation") && (
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
                            const ids = tagTransaction?.result?.data?.map(
                              (items) => items.id
                            );
                            (params.state === "For Releasing" ||
                              params.state === "Check Approval") &&
                            e?.target?.checked
                              ? setValue("check_ids", ids)
                              : setValue("check_ids", []);
                          }}
                        />
                      }
                    />
                  </TableCell>
                )}
                <TableCell>Tag #.</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={params.allocation !== ""}
                    onClick={(e) => setAnchorE1(e.currentTarget)}
                    direction={"desc"}
                    IconComponent={FilterAltOutlinedIcon}
                  >
                    Allocation
                  </TableSortLabel>

                  {params.allocation !== "" && (
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
                    />
                  )}
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
                <TableCell align="center">View</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {forApprovalLoading ||
              releasedLoading ||
              loadingDocument ||
              isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      hasAccess("check_approval") ||
                      params?.state === "For Releasing" ||
                      params?.state === "For Preparation"
                        ? 7
                        : 6
                    }
                    align="center"
                  >
                    <Lottie
                      animationData={loading}
                      className="loading-tag-transaction"
                    />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      hasAccess("check_approval") ||
                      params?.state === "For Releasing" ||
                      params?.state === "For Preparation"
                        ? 7
                        : 6
                    }
                    align="center"
                  >
                    <Lottie
                      animationData={noData}
                      className="no-data-tag-transaction"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                tagTransaction?.result?.data?.map((tag) => {
                  const document = documentType?.result?.find(
                    (doc) =>
                      tag?.transactions?.document_type_id === doc?.id || null
                  );

                  const isPreparedBy =
                    tag?.state === "Check Approval" &&
                    hasAccess("check_approval");

                  return (
                    <TableRow
                      className="table-body-tag-transaction"
                      key={tag?.id}
                      onClick={() => {
                        dispatch(setMenuData(tag));

                        dispatch(setVoucher("check"));
                        params?.state !== "Check Approval" &&
                          watch("check_ids")?.length === 0 &&
                          tag?.is_read === 0 &&
                          handleRead(tag);

                        isPreparedBy && handleRead(tag);

                        params?.state === "For Preparation" &&
                          watch("check_ids")?.length === 0 &&
                          dispatch(setViewMenu(true));

                        params?.state !== "For Preparation" &&
                          watch("check_ids")?.length === 0 &&
                          dispatch(setUpdateMenu(true));
                      }}
                    >
                      {(hasAccess("check_approval") ||
                        params?.state === "For Releasing" ||
                        params?.state === "For Preparation") && (
                        <TableCell align="center">
                          <FormControlLabel
                            className="check-box-archive-ap"
                            control={
                              <Controller
                                name="check_ids"
                                control={control}
                                render={({ field }) => (
                                  <Checkbox
                                    disabled={
                                      params.state === "For Releasing" ||
                                      params.state === "Check Approval" ||
                                      hasAccess("check_approval")
                                        ? false
                                        : watch("check_ids")?.length === 0
                                        ? false
                                        : watch("check_ids")[0]?.transactions
                                            ?.supplier?.id ===
                                          tag?.transactions?.supplier?.id
                                        ? false
                                        : true
                                    }
                                    color="secondary"
                                    sx={{ zIndex: 0 }}
                                    checked={
                                      params.state === "For Releasing" ||
                                      params.state === "Check Approval" ||
                                      hasAccess("check_approval")
                                        ? watch("check_ids")?.includes(tag?.id)
                                        : watch("check_ids")?.includes(tag)
                                    }
                                    onClick={(event) => event.stopPropagation()}
                                    onChange={(event) => {
                                      const checked = event.target.checked;
                                      const currentValue =
                                        watch("check_ids") || [];
                                      const newValue = checked
                                        ? [
                                            ...currentValue,
                                            params.state === "For Releasing" ||
                                            params.state === "Check Approval" ||
                                            hasAccess("check_approval")
                                              ? tag?.id
                                              : tag,
                                          ]
                                        : currentValue.filter((id) =>
                                            params.state === "For Releasing" ||
                                            params.state === "Check Approval" ||
                                            hasAccess("check_approval")
                                              ? id !== tag?.id
                                              : id?.id !== tag?.id
                                          );
                                      field.onChange(newValue);
                                    }}
                                  />
                                )}
                              />
                            }
                          />
                        </TableCell>
                      )}

                      <TableCell>
                        {`${tag?.transactions?.tag_year} - ${tag?.transactions?.tag_no}`}
                      </TableCell>
                      <TableCell>
                        <Typography className="tag-transaction-company-name">
                          {tag?.transactions?.supplier?.name === null ? (
                            <>&mdash;</>
                          ) : (
                            tag?.transactions?.supplier?.name
                          )}
                        </Typography>
                        <Typography className="tag-transaction-company-tin">
                          {tag?.transactions?.supplier === null ? (
                            <>&mdash;</>
                          ) : (
                            tag?.transactions?.supplier?.tin
                          )}
                        </Typography>
                        <Typography className="tag-transaction-company-name">
                          {tag?.amount === null ? (
                            <>&mdash;</>
                          ) : (
                            convertToPeso(tag?.amount)
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {tag?.voucher_number ? (
                          <Typography className="tag-transaction-company-name">
                            {tag?.voucher_number}
                          </Typography>
                        ) : (
                          <Typography className="tag-transaction-company-name">
                            {`${tag?.transactions?.ap_tagging} - ${tag?.transactions?.tag_year} - ${tag?.transactions?.gtag_no} `}
                          </Typography>
                        )}

                        <Typography className="tag-transaction-company-type">
                          {document === null ? <>&mdash;</> : document?.name}
                        </Typography>
                        <Typography className="tag-transaction-company-name">
                          {`${tag?.transactions?.invoice_no || ""}`}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {tag?.state === "For Computation" && (
                          <StatusIndicator
                            status="For Computation"
                            className="computation-indicator"
                          />
                        )}

                        {tag?.state === "Check Approval" && (
                          <StatusIndicator
                            status="For Approval"
                            className="approval-indicator"
                          />
                        )}

                        {tag?.state === "approved" && (
                          <StatusIndicator
                            status="Approved"
                            className="approved-indicator"
                          />
                        )}

                        {tag?.state === "returned" && (
                          <StatusIndicator
                            status="Returned"
                            className="return-indicator"
                          />
                        )}

                        {tag?.state === "For Voiding" && (
                          <StatusIndicator
                            status="For Voiding"
                            className="voiding-indicator"
                          />
                        )}

                        {tag?.state === "voided" && (
                          <StatusIndicator
                            status="Void"
                            className="void-indicator"
                          />
                        )}

                        {tag?.state === "For Preparation" && (
                          <StatusIndicator
                            status="Awaiting Prep"
                            className="preparation-indicator"
                          />
                        )}

                        {tag?.state === "For Releasing" && (
                          <StatusIndicator
                            status="Awaiting Release"
                            className="release-indicator"
                          />
                        )}

                        {tag?.state === "Released" && (
                          <StatusIndicator
                            status="Released"
                            className="approved-indicator"
                          />
                        )}

                        {tag?.state === "For Filing" && (
                          <StatusIndicator
                            status="Awaiting File"
                            className="filing-indicator"
                          />
                        )}

                        {tag?.state === "For Clearing" && (
                          <StatusIndicator
                            status="For Clearing"
                            className="clearing-indicator"
                          />
                        )}

                        {tag?.state === "Filed" && (
                          <StatusIndicator
                            status="Filed"
                            className="filed-indicator"
                          />
                        )}

                        {tag?.state === "Cancelled" && (
                          <StatusIndicator
                            status="Cancelled"
                            className="inActive-indicator"
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {moment(tag?.updated_at).format("MMM DD YYYY")}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton>
                          <Badge
                            variant="dot"
                            invisible={tag?.is_read !== 0}
                            color="error"
                            className="tag-transaction-badge"
                          >
                            <RemoveRedEyeOutlinedIcon className="tag-transaction-icon-actions" />
                          </Badge>
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
                  <TableCell
                    colSpan={
                      hasAccess("check_approval") ||
                      params?.state === "For Releasing" ||
                      params?.state === "For Preparation"
                        ? 7
                        : 6
                    }
                  >
                    <LinearProgress color="secondary" />
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
            {!isFetching && !isError && (
              <TableFooter style={{ position: "sticky", bottom: 0 }}>
                <TableRow className="table-footer-tag-transaction">
                  {watch("check_ids").length !== 0 &&
                    params?.state === "For Preparation" && (
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="success"
                          className="add-transaction-button treasury"
                          onClick={() => {
                            dispatch(setMenuDataMultiple(watch("check_ids")));
                            dispatch(setVoucher("check"));
                            dispatch(setViewMenu(true));
                          }}
                        >
                          Prepare
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
                  <TableCell
                    colSpan={
                      hasAccess("check_approval") ||
                      params?.state === "For Releasing" ||
                      params?.state === "For Preparation"
                        ? 7
                        : 6
                    }
                  >
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

      <Dialog open={viewMenu} className="transaction-modal-dialog">
        <TreasuryModal />
      </Dialog>

      <Dialog
        open={updateMenu}
        className="transaction-modal-dialog"
        onClose={() => dispatch(resetMenu())}
      >
        <TreasuryMultiple />
      </Dialog>
    </Box>
  );
};

export default CheckTable;

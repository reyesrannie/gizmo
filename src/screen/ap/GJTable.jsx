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
import ClearIcon from "@mui/icons-material/Clear";

import loading from "../../assets/lottie/Loading-2.json";
import noData from "../../assets/lottie/NoData.json";
import StatusIndicator from "../../components/customs/StatusIndicator";
import "../../components/styles/TagTransaction.scss";
import "../../components/styles/TransactionModal.scss";

import { useState } from "react";

import {
  resetMenu,
  setMenuData,
  setPreparation,
  setUpdateMenu,
  setViewAccountingEntries,
  setViewMenu,
} from "../../services/slice/menuSlice";

import TransactionModalAp from "../../components/customs/modal/TransactionModalAp";
import { resetOption, setVoucher } from "../../services/slice/optionsSlice";
import TransactionModalApprover from "../../components/customs/modal/TransactionModalApprover";
import { AdditionalFunction } from "../../services/functions/AdditionalFunction";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import Autocomplete from "../../components/customs/AutoComplete";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import orderBySchema from "../../schemas/orderBySchema";
import { enqueueSnackbar } from "notistack";
import { resetPrompt } from "../../services/slice/promptSlice";
import { singleError } from "../../services/functions/errorResponse";
import dayjs from "dayjs";
import GeneralJournalModal from "../../components/customs/modal/GeneralJournalModal";
import { useDocumentTypeQuery } from "../../services/api/documentTypeApi";
import {
  useFileCVoucherMutation,
  usePrepareCVoucherMutation,
} from "../../services/api/checkVoucherApi";
import { useReadTransactionGJMutation } from "../../services/api/generalJournalApi";

const GJTable = ({
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
  const menuData = useSelector((state) => state.menu.menuData);
  const updateMenu = useSelector((state) => state.menu.updateMenu);
  const viewMenu = useSelector((state) => state.menu.viewMenu);
  const preparation = useSelector((state) => state.menu.preparation);

  const userData = useSelector((state) => state.auth.userData);

  const { convertToPeso } = AdditionalFunction();

  const viewAccountingEntries = useSelector(
    (state) => state.menu.viewAccountingEntries
  );

  const { data: documentType, isLoading: loadingDocument } =
    useDocumentTypeQuery({
      status: "active",
      pagination: "none",
    });

  const [readTransaction] = useReadTransactionGJMutation();

  const [prepareCheck, { isLoading: loadingPrep }] =
    usePrepareCVoucherMutation();

  const [fileCheck, { isLoading: loadingFile }] = useFileCVoucherMutation();

  const handleRead = async (data) => {
    const obj = {
      id: data?.id,
    };
    try {
      const res = await readTransaction(obj).unwrap();
    } catch (error) {}
  };

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(orderBySchema),
    defaultValues: {
      orderBy: null,
      check_ids: [],
    },
  });

  const changeBox = (e) => {
    const ids = tagTransaction?.result?.data?.map((items) => items.id);
    if (e?.target?.checked) {
      setValue("check_ids", ids);
    } else {
      setValue("check_ids", []);
    }
  };

  const submitHandler = async (submitData) => {
    try {
      const res =
        params?.state !== "For Filing"
          ? await prepareCheck(submitData).unwrap()
          : await fileCheck(submitData).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetMenu());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  return (
    <Box className="tag-transaction-body-container">
      <TableContainer className="tag-transaction-table-container">
        <form onSubmit={handleSubmit(submitHandler)}>
          <Table stickyHeader>
            <TableHead>
              <TableRow className="table-header1-import-tag-transaction">
                {(params?.state === "approved" ||
                  params?.state === "For Filing") && (
                  <TableCell align="center">
                    <FormControlLabel
                      className="check-box-archive-ap"
                      control={
                        <Checkbox
                          color="secondary"
                          className="check-box-filing"
                          indeterminate={
                            watch("check_ids")?.length !==
                              tagTransaction?.result?.per_page &&
                            watch("check_ids")?.length !== 0
                          }
                          checked={
                            watch("check_ids")?.length ===
                            tagTransaction?.result?.per_page
                          }
                          onChange={(e) => {
                            changeBox(e);
                          }}
                        />
                      }
                    />
                  </TableCell>
                )}

                <TableCell>Reference #.</TableCell>

                <TableCell>
                  <TableSortLabel
                    active={params.allocation !== ""}
                    onClick={(e) => setAnchorE1(e.currentTarget)}
                    direction={"desc"}
                    IconComponent={FilterAltOutlinedIcon}
                  >
                    Charging of Accounts
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
              {loadingPrep || loadingDocument || isLoading || loadingFile ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      params?.state === "approved" ||
                      params?.state === "For Filing"
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
                      params?.state === "approved" ||
                      params?.state === "For Filing"
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

                  const tagMonthYear = dayjs(tag?.tag_year, "YYMM").toDate();
                  return (
                    <TableRow
                      className="table-body-tag-transaction"
                      key={tag?.id}
                      onClick={() => {
                        dispatch(setMenuData(tag));
                        // dispatch(setVoucher("gj"));
                        tag?.is_read === 0 &&
                          tag?.state !== "For Approval" &&
                          tag?.state !== "For Preparation" &&
                          tag?.state !== "Check Approval" &&
                          tag?.state !== "Released" &&
                          handleRead(tag);

                        dispatch(setUpdateMenu(true));
                      }}
                    >
                      {(params?.state === "approved" ||
                        params?.state === "For Filing") && (
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
                                    checked={watch("check_ids")?.includes(
                                      tag?.id
                                    )}
                                    onClick={(event) => event.stopPropagation()}
                                    onChange={(event) => {
                                      const checked = event.target.checked;
                                      const currentValue =
                                        watch("check_ids") || [];
                                      const newValue = checked
                                        ? [...currentValue, tag.id]
                                        : currentValue.filter(
                                            (id) => id !== tag.id
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
                      <TableCell>{tag?.reference_no}</TableCell>

                      <TableCell>
                        {tag?.gj_items[0]?.voucher_no ? (
                          <Typography className="tag-transaction-company-name">
                            {tag?.gj_items[0]?.voucher_no}
                          </Typography>
                        ) : (
                          <Typography className="tag-transaction-company-name">
                            {`${tag?.apTagging?.code} - ${
                              tag?.gj_series
                            } - ${moment(tagMonthYear).get("year")}`}
                          </Typography>
                        )}

                        <Typography className="tag-transaction-company-name">
                          {`${tag?.gj_items[0]?.invoice_no || ""}`}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {tag?.state === "Saved" && (
                          <StatusIndicator
                            status="Saved"
                            className="computation-indicator"
                          />
                        )}

                        {tag?.state === "Approved" && (
                          <StatusIndicator
                            status="Approved"
                            className="approved-indicator"
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
                            invisible={
                              tag?.is_read !== 0 ||
                              tag?.state === "For Approval"
                            }
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
                      params?.state === "approved" ||
                      params?.state === "For Filing"
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
                  {watch("check_ids").length !== 0 && (
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="success"
                        className="add-transaction-button treasury"
                        type="submit"
                      >
                        {params?.state === "approved" ? "Prepare" : "File"}
                      </Button>
                    </TableCell>
                  )}
                  <TableCell colSpan={params?.state === "approved" ? 7 : 6}>
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
          options={userData?.scope_tagging || []}
          getOptionLabel={(option) => `${option?.ap_code}`}
          isOptionEqualToValue={(option, value) =>
            option?.ap_id === value?.ap_id
          }
          onClose={() => {
            watch("orderBy") !== null && onOrderBy(watch("orderBy")?.ap_id);
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
        open={updateMenu}
        className="transaction-modal-dialog"
        onClose={() => {
          dispatch(resetMenu());
          dispatch(resetOption());
        }}
      >
        <GeneralJournalModal />
      </Dialog>
    </Box>
  );
};

export default GJTable;

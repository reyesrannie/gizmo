import {
  Box,
  Button,
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

import "../../styles/ImportModal.scss";
import image from "../../../assets/svg/image.svg";
import excel from "../../../assets/svg/excel.svg";
import fileError from "../../../assets/svg/file-error.svg";
import loading from "../../../assets/lottie/Loading.json";

import { useDispatch, useSelector } from "react-redux";
import {
  resetMenu,
  setImportError,
  setImportHasData,
  setImportLoading,
  setImportTitle,
  setMenuData,
} from "../../../services/slice/menuSlice";
import {
  readExcelFile,
  readExcelFileDocumentType,
  readExcelFileSupplier,
  readExcelFilewTag,
} from "../../../services/functions/excelRead";
import { useRef } from "react";
import Lottie from "lottie-react";
import { useSnackbar } from "notistack";

const ImportModal = ({
  title,
  importData,
  isLoading,
  withTag = false,
  documentType = false,
  supplier = false,
}) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const hasDataImport = useSelector((state) => state.menu.importHasData);
  const importTitle = useSelector((state) => state.menu.importTitle);
  const menuData = useSelector((state) => state.menu.menuData);
  const importLoading = useSelector((state) => state.menu.importLoading);
  const importError = useSelector((state) => state.menu.importError);

  const fileInputRef = useRef(null);

  const dropCheck = async (e) => {
    dispatch(setImportError(null));
    e.preventDefault();
    const files = e?.dataTransfer?.files;
    dispatch(setImportLoading(true));
    try {
      const read = await readExcelFile(files);
      dispatch(setImportHasData(true));
      dispatch(setImportTitle(files[0]?.name));
      dispatch(setMenuData(read));
    } catch (error) {
      enqueueSnackbar("This file is not supported", { variant: "error" });
      dispatch(setImportHasData("error"));
      dispatch(setImportTitle("This file is not supported"));
    }
    dispatch(setImportLoading(false));
  };

  const handleInputFile = async (e) => {
    dispatch(setImportError(null));

    const filesArray = Array.from(e.target.files);
    try {
      dispatch(setImportLoading(true));
      const read = await readExcelFile(filesArray);
      dispatch(setImportHasData(true));
      dispatch(setImportTitle(filesArray[0]?.name));
      dispatch(setMenuData(read));
      fileInputRef.current.value = null;
    } catch (error) {
      enqueueSnackbar("This file is not supported", { variant: "error" });
      dispatch(setImportHasData("error"));
      dispatch(setImportTitle("This file is not supported"));
    }
    dispatch(setImportLoading(false));
  };

  const dropCheckwTag = async (e) => {
    dispatch(setImportError(null));
    e.preventDefault();
    const files = e?.dataTransfer?.files;
    dispatch(setImportLoading(true));
    if (supplier) {
      try {
        const read = await readExcelFileSupplier(files);
        dispatch(setImportHasData(true));
        dispatch(setImportTitle(files[0]?.name));
        dispatch(setMenuData(read));
      } catch (error) {
        enqueueSnackbar("This file is not supported", { variant: "error" });
        dispatch(setImportHasData("error"));
        dispatch(setImportTitle("This file is not supported"));
      }
      dispatch(setImportLoading(false));
    } else if (documentType) {
      try {
        const read = await readExcelFileDocumentType(files);
        dispatch(setImportHasData(true));
        dispatch(setImportTitle(files[0]?.name));
        dispatch(setMenuData(read));
      } catch (error) {
        enqueueSnackbar("This file is not supported", { variant: "error" });
        dispatch(setImportHasData("error"));
        dispatch(setImportTitle("This file is not supported"));
      }
      dispatch(setImportLoading(false));
    } else {
      try {
        const read = await readExcelFilewTag(files);
        dispatch(setImportHasData(true));
        dispatch(setImportTitle(files[0]?.name));
        dispatch(setMenuData(read));
      } catch (error) {
        enqueueSnackbar("This file is not supported", { variant: "error" });
        dispatch(setImportHasData("error"));
        dispatch(setImportTitle("This file is not supported"));
      }
      dispatch(setImportLoading(false));
    }
  };

  const handleInputFilewTag = async (e) => {
    dispatch(setImportError(null));
    const filesArray = Array.from(e.target.files);
    if (supplier) {
      try {
        dispatch(setImportLoading(true));
        const read = await readExcelFileSupplier(filesArray);
        dispatch(setImportHasData(true));
        dispatch(setImportTitle(filesArray[0]?.name));
        dispatch(setMenuData(read));
        fileInputRef.current.value = null;
      } catch (error) {
        dispatch(setImportHasData("error"));
        dispatch(setImportTitle("error"));
      }
      dispatch(setImportLoading(false));
    } else if (documentType) {
      try {
        const read = await readExcelFileDocumentType(filesArray);
        dispatch(setImportHasData(true));
        dispatch(setImportTitle(filesArray[0]?.name));
        dispatch(setMenuData(read));
      } catch (error) {
        enqueueSnackbar("This file is not supported", { variant: "error" });
        dispatch(setImportHasData("error"));
        dispatch(setImportTitle("This file is not supported"));
      }
      dispatch(setImportLoading(false));
    } else {
      try {
        dispatch(setImportLoading(true));
        const read = await readExcelFilewTag(filesArray);
        dispatch(setImportHasData(true));
        dispatch(setImportTitle(filesArray[0]?.name));
        dispatch(setMenuData(read));
        fileInputRef.current.value = null;
      } catch (error) {
        dispatch(setImportHasData("error"));
        dispatch(setImportTitle("error"));
      }
      dispatch(setImportLoading(false));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    importData(menuData);
  };
  return (
    <Paper className="import-container">
      <Box>
        <Typography className="import-title">Import {title}</Typography>
        <Typography className="import-desc">
          Upload a CSV to import {title?.toLowerCase()} data to database
        </Typography>
        <Box
          className="import-drop-or-load"
          onDrop={withTag ? dropCheckwTag : dropCheck}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef?.current?.click()}
        >
          <img
            src={
              hasDataImport !== "error"
                ? excel
                : hasDataImport === "error"
                ? fileError
                : image
            }
            alt="import"
            className="import-list"
            draggable="false"
          />
          {hasDataImport ? (
            <Typography className="import-drag-drop">{importTitle}</Typography>
          ) : (
            <>
              <Typography className="import-drag-drop">Drag & Drop</Typography>
              <Typography className="import-drag-drop">or Browse</Typography>
              <Typography className="import-support">
                only supports .xlsx
              </Typography>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={withTag ? handleInputFilewTag : handleInputFile}
          />
        </Box>
      </Box>
      {importError !== undefined && importError !== null && (
        <Box className="import-box-container">
          <TableContainer className="import-table-container">
            <Table stickyHeader>
              <TableHead>
                <TableRow className="table-header1-import">
                  <TableCell align="center">Line</TableCell>
                  <TableCell align="center">Column</TableCell>
                  <TableCell align="center">Error</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object?.keys(importError)?.map((row, index) => {
                  const response = importError[row][0];
                  const line = row.split(".");
                  return (
                    <TableRow key={index}>
                      <TableCell align="center">
                        {Number(line[0]) + 2}
                      </TableCell>
                      <TableCell align="center">{line[1]}</TableCell>
                      <TableCell align="center">{response}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      <Box className="import-button-container">
        <Button
          variant="contained"
          color="warning"
          className="button-import-modal"
          disabled={
            !hasDataImport ||
            !importTitle ||
            Boolean(importError) ||
            hasDataImport === "error"
          }
          onClick={handleSubmit}
        >
          Upload
        </Button>
        <Button
          variant="contained"
          className="button-import-modal"
          onClick={() => dispatch(resetMenu())}
        >
          Cancel
        </Button>
      </Box>

      <Dialog open={importLoading || isLoading} className="loading-import">
        <Lottie animationData={loading} loop={importLoading || isLoading} />
      </Dialog>
    </Paper>
  );
};

export default ImportModal;

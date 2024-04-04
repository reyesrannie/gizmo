import React from "react";
import "../../styles/TransactionModal.scss";
import {
  Paper,
  Typography,
  TextField as MuiTextField,
  Box,
  Button,
} from "@mui/material";
import Autocomplete from "../AutoComplete";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import fromSchema from "../../../schemas/fromSchema";
import AppTextBox from "../AppTextBox";
import { setFromBIR } from "../../../services/slice/transactionSlice";
import { useDispatch, useSelector } from "react-redux";
import { printPDF } from "../../../services/functions/pdfProcess";
import {
  useAtcQuery,
  useSupplierQuery,
  useTaxComputationQuery,
} from "../../../services/store/request";

const Form2307 = () => {
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.menuData);
  const voucher = useSelector((state) => state.options.voucher);

  const { data: tin } = useSupplierQuery({
    status: "active",
    pagination: "none",
  });

  const { data: atc } = useAtcQuery({
    status: "active",
    pagination: "none",
  });

  const { data: taxComputation } = useTaxComputationQuery(
    {
      status: "active",
      transaction_id: menuData?.transactions?.id,
      voucher: voucher,
      pagination: "none",
    },
    { skip: menuData === null }
  );

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(fromSchema),
    defaultValues: {
      coverage: null,
      month: null,
      code: "",
    },
  });

  const submitHandler = async (submitData) => {
    const supplier = tin?.result?.find(
      (item) => menuData?.transactions?.supplier_id === item?.id
    );

    const atc_name = atc?.result?.find((item) => menuData?.atc === item.id);

    const obj = {
      ...submitData,
      supplier,
      atc: atc_name?.code,
      tax: taxComputation?.result,
    };

    printPDF(obj);
  };

  return (
    <Paper className="transaction-modal-container">
      <Typography className="transaction-text">Form 2307</Typography>

      <form onSubmit={handleSubmit(submitHandler)}>
        <Autocomplete
          control={control}
          name={"coverage"}
          options={
            ["1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter"] || []
          }
          getOptionLabel={(option) => option}
          isOptionEqualToValue={(option, value) => option === value}
          renderInput={(params) => (
            <MuiTextField
              name="coverage"
              {...params}
              label="Coverage *"
              size="small"
              variant="outlined"
              error={Boolean(errors.coverage)}
              helperText={errors.coverage?.message}
              className="transaction-form-textBox"
            />
          )}
          disableClearable
        />
        <Autocomplete
          control={control}
          name={"month"}
          options={["1st", "2nd", "3rd"] || []}
          getOptionLabel={(option) => option}
          isOptionEqualToValue={(option, value) => option === value}
          renderInput={(params) => (
            <MuiTextField
              name="month"
              {...params}
              label="Month of the quarter *"
              size="small"
              variant="outlined"
              error={Boolean(errors.month)}
              helperText={errors.month?.message}
              className="transaction-form-textBox"
            />
          )}
          disableClearable
        />
        <AppTextBox
          control={control}
          name={"code"}
          label={"Supplier Zip Code *"}
          color="primary"
          className="transaction-form-textBox"
          error={Boolean(errors?.code)}
          helperText={errors?.code?.message}
        />
        <Box className="tax-computation-button-container">
          <Button
            variant="contained"
            color="warning"
            type="submit"
            className="add-transaction-button"
          >
            Print
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              dispatch(setFromBIR(false));
            }}
            className="add-transaction-button"
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default Form2307;

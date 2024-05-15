import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fieldsRequired: [],
  header: "",
  isExpanded: false,
  filterBy: "",
  filter: false,
  voucherData: null,
  formBIR: false,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setFieldsRequired: (state, action) => {
      state.fieldsRequired = action.payload;
    },
    setHeader: (state, action) => {
      state.header = action.payload;
    },
    setIsExpanded: (state, action) => {
      state.isExpanded = action.payload;
    },
    setFilterBy: (state, action) => {
      state.filterBy = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setVoucherData: (state, action) => {
      state.voucherData = action.payload;
    },
    setFromBIR: (state, action) => {
      state.formBIR = action.payload;
    },

    resetTransaction: () => {
      return initialState;
    },
  },
});

export const {
  setFieldsRequired,
  resetTransaction,
  setHeader,
  setIsExpanded,
  setFilterBy,
  setFilter,
  setFromBIR,
  setVoucherData,
} = transactionSlice.actions;

export default transactionSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fieldsRequired: [],
  header: "Tag Transaction",
  transactionHeader: "Received",
  approvedHeader: "For Approval",
  isExpanded: false,
  filterBy: "",
  filter: false,
  voucherData: [],
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
    setTransactionHeader: (state, action) => {
      state.transactionHeader = action.payload;
    },
    setApprovedHeader: (state, action) => {
      state.approvedHeader = action.payload;
    },
    setVoucherData: (state, action) => {
      state.voucherData = action.payload;
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
  setTransactionHeader,
  setApprovedHeader,
  setVoucherData,
} = transactionSlice.actions;

export default transactionSlice.reducer;

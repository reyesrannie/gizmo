import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fieldsRequired: [],
  isExpanded: false,
  filterBy: "",
  filter: false,
  voucherData: null,
  formBIR: false,
  addDocuments: false,
  documents: [],
  clearSearch: false,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setFieldsRequired: (state, action) => {
      state.fieldsRequired = action.payload;
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
    setDocuments: (state, action) => {
      state.documents = action.payload;
    },
    setAddDocuments: (state, action) => {
      state.addDocuments = action.payload;
    },
    setClearSearch: (state, action) => {
      state.clearSearch = action.payload;
    },
    resetTransaction: () => {
      return initialState;
    },
  },
});

export const {
  setFieldsRequired,
  resetTransaction,
  setIsExpanded,
  setFilterBy,
  setFilter,
  setFromBIR,
  setVoucherData,
  setDocuments,
  setAddDocuments,
  setClearSearch,
} = transactionSlice.actions;

export default transactionSlice.reducer;

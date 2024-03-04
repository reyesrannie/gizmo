import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fieldsRequired: [],
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setFieldsRequired: (state, action) => {
      state.fieldsRequired = action.payload;
    },

    resetTransaction: () => {
      return initialState;
    },
  },
});

export const { setFieldsRequired, resetTransaction } = transactionSlice.actions;

export default transactionSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  supplyType: [],
  mode: "debit",
  disableButton: false,
  disableCreate: true,
  disableCheck: false,
};

const optionsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    setSupplyType: (state, action) => {
      state.supplyType = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setDisableButton: (state, action) => {
      state.disableButton = action.payload;
    },
    setDisableCreate: (state, action) => {
      state.disableCreate = action.payload;
    },
    setDisableCheck: (state, action) => {
      state.disableCheck = action.payload;
    },
    resetOption: () => {
      return initialState;
    },
  },
});

export const {
  setSupplyType,
  setMode,
  setDisableButton,
  setDisableCreate,
  resetOption,
  setDisableCheck,
} = optionsSlice.actions;

export default optionsSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  supplyType: [],
  mode: "debit",
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

    resetOption: () => {
      return initialState;
    },
  },
});

export const { setSupplyType, setMode, resetOption } = optionsSlice.actions;

export default optionsSlice.reducer;

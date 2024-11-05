import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  date: false,
  isSyncing: true,
  clearChecks: false,
  isDisplayed: false,
  isShownTable: false,
};

const syncSlice = createSlice({
  name: "sync",
  initialState,
  reducers: {
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setIsSyncing: (state, action) => {
      state.isSyncing = action.payload;
    },
    setClearChecks: (state, action) => {
      state.clearChecks = action.payload;
    },
    setDisplayed: (state, action) => {
      state.isDisplayed = action.payload;
    },
    setShownTable: (state, action) => {
      state.isShownTable = action.payload;
    },

    resetSync: () => {
      return initialState;
    },
  },
});

export const {
  setDate,
  setIsSyncing,
  setClearChecks,
  setDisplayed,
  setShownTable,
  resetSync,
} = syncSlice.actions;

export default syncSlice.reducer;

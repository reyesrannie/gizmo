import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  date: false,
  isSyncing: true,
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

    resetSync: () => {
      return initialState;
    },
  },
});

export const { setDate, setIsSyncing, resetSync } = syncSlice.actions;

export default syncSlice.reducer;

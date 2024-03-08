import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  logsOpen: false,
  successLog: false,
};

const logSlice = createSlice({
  name: "log",
  initialState,
  reducers: {
    setLogsOpen: (state, action) => {
      state.logsOpen = action.payload;
    },
    setSuccessLog: (state, action) => {
      state.successLog = action.payload;
    },

    resetLogs: () => {
      return initialState;
    },
  },
});

export const {
  setLogsOpen,

  setSuccessLog,
  resetLogs,
} = logSlice.actions;

export default logSlice.reducer;

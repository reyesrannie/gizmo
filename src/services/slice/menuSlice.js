import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawer: false,
};

const menutSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setDrawer: (state, action) => {
      state.drawer = action.payload;
    },
    resetMenu: () => {
      return initialState;
    },
  },
});

export const { setDrawer, resetMenu } = menutSlice.actions;

export default menutSlice.reducer;

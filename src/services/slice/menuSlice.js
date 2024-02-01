import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawer: false,
  accountMenu: false,
};

const menutSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setDrawer: (state, action) => {
      state.drawer = action.payload;
    },
    setAccountMenu: (state, action) => {
      state.accountMenu = action.payload;
    },
    resetMenu: () => {
      return initialState;
    },
  },
});

export const { setDrawer, setAccountMenu, resetMenu } = menutSlice.actions;

export default menutSlice.reducer;

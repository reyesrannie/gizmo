import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawer: false,
  accountMenu: false,
  roles: false,
  rolesView: false,
  rolesUpdate: false,
  rolesData: null,
  createMenu: false,
  checkMenu: false,
  computationMenu: false,
  updateMenu: false,
  updateData: false,
  checkID: "",
  receiveMenu: false,
  importMenu: false,
  importHasData: false,
  importTitle: "",
  importLoading: false,
  importError: null,
  viewMenu: false,
  menuData: null,
  menuDataMultiple: [],
  createTax: false,
  updateTax: false,
  taxData: null,
  printable: false,
  updateCount: 0,
  viewAccountingEntries: false,
  voidMenu: false,
  schedComputation: false,
  isSched: false,
  approveMenu: false,
  preparation: false,
  hasError: false,
};

const initialStateWithoutDrawer = {
  drawer: true,
  accountMenu: false,
  roles: false,
  rolesView: false,
  rolesUpdate: false,
  rolesData: null,
  createMenu: false,
  checkMenu: false,
  computationMenu: false,
  updateMenu: false,
  receiveMenu: false,
  importMenu: false,
  importHasData: false,
  importTitle: "",
  importLoading: false,
  importError: null,
  viewMenu: false,
  menuData: null,
  menuDataMultiple: [],
  createTax: false,
  updateTax: false,
  taxData: null,
  printable: false,
  updateCount: 0,
  viewAccountingEntries: false,
  voidMenu: false,
  schedComputation: false,
  approveMenu: false,
  preparation: false,
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
    setRolesMenu: (state, action) => {
      state.roles = action.payload;
    },
    setRolesView: (state, action) => {
      state.rolesView = action.payload;
    },
    setRolesUpdate: (state, action) => {
      state.rolesUpdate = action.payload;
    },
    setRolesData: (state, action) => {
      state.rolesData = action.payload;
    },
    setCreateMenu: (state, action) => {
      state.createMenu = action.payload;
    },
    setUpdateMenu: (state, action) => {
      state.updateMenu = action.payload;
    },
    setUpdateData: (state, action) => {
      state.updateData = action.payload;
    },
    setCheckID: (state, action) => {
      state.checkID = action.payload;
    },
    setViewMenu: (state, action) => {
      state.viewMenu = action.payload;
    },
    setImportMenu: (state, action) => {
      state.importMenu = action.payload;
    },
    setImportHasData: (state, action) => {
      state.importHasData = action.payload;
    },
    setImportTitle: (state, action) => {
      state.importTitle = action.payload;
    },
    setImportLoading: (state, action) => {
      state.importLoading = action.payload;
    },
    setImportError: (state, action) => {
      state.importError = action.payload;
    },
    setMenuData: (state, action) => {
      state.menuData = action.payload;
    },

    setMenuDataMultiple: (state, action) => {
      state.menuDataMultiple = action.payload;
    },
    setReceiveMenu: (state, action) => {
      state.receiveMenu = action.payload;
    },
    setCreateTax: (state, action) => {
      state.createTax = action.payload;
    },
    setUpdateTax: (state, action) => {
      state.updateTax = action.payload;
    },
    setTaxData: (state, action) => {
      state.taxData = action.payload;
    },
    setCheckMenu: (state, action) => {
      state.checkMenu = action.payload;
    },
    setComputationMenu: (state, action) => {
      state.computationMenu = action.payload;
    },
    setPrintable: (state, action) => {
      state.printable = action.payload;
    },
    setUpdateCount: (state, action) => {
      state.updateCount = action.payload;
    },
    setViewAccountingEntries: (state, action) => {
      state.viewAccountingEntries = action.payload;
    },
    setVoidMenu: (state, action) => {
      state.voidMenu = action.payload;
    },

    setSchedComputation: (state, action) => {
      state.schedComputation = action.payload;
    },
    setApproveMenu: (state, action) => {
      state.approveMenu = action.payload;
    },
    setPreparation: (state, action) => {
      state.preparation = action.payload;
    },
    setHasError: (state, action) => {
      state.hasError = action.payload;
    },
    setSched: (state, action) => {
      state.isSched = action.payload;
    },

    resetMenu: () => {
      return initialState;
    },
    resetMenuWithoutDrawer: () => {
      return initialStateWithoutDrawer;
    },
  },
});

export const {
  setDrawer,
  setAccountMenu,
  setRolesMenu,
  setRolesView,
  setRolesUpdate,
  setRolesData,
  setCreateMenu,
  setUpdateMenu,
  setUpdateData,
  setCheckID,
  setViewMenu,
  setImportMenu,
  setImportHasData,
  setImportTitle,
  setImportLoading,
  setImportError,
  resetMenu,
  setMenuData,
  setReceiveMenu,
  setCreateTax,
  setUpdateTax,
  setTaxData,
  setCheckMenu,
  setPrintable,
  setComputationMenu,
  setUpdateCount,
  setVoidMenu,
  setSchedComputation,
  setViewAccountingEntries,
  setPreparation,
  resetMenuWithoutDrawer,
  setApproveMenu,
  setMenuDataMultiple,
  setHasError,
  setSched,
} = menutSlice.actions;

export default menutSlice.reducer;

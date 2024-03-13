import { configureStore } from "@reduxjs/toolkit";
import { jsonServerAPI } from "./request";
import authSlice from "../slice/authSlice";
import promptSlice from "../slice/promptSlice";
import menuSlice from "../slice/menuSlice";
import { jsonSedarAPI } from "./sedarRequest";
import { jsonFistoApi } from "./fistoRequest";
import syncSlice from "../slice/syncSlice";
import transactionSlice from "../slice/transactionSlice";
import logSlice from "../slice/logSlice";
import optionsSlice from "../slice/optionsSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    prompt: promptSlice,
    menu: menuSlice,
    sync: syncSlice,
    transaction: transactionSlice,
    log: logSlice,
    options: optionsSlice,

    [jsonServerAPI.reducerPath]: jsonServerAPI.reducer,
    [jsonSedarAPI.reducerPath]: jsonSedarAPI.reducer,
    [jsonFistoApi.reducerPath]: jsonFistoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      jsonSedarAPI.middleware,
      jsonServerAPI.middleware,
      jsonFistoApi.middleware
    ),
});

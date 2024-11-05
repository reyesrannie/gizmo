import React, { createContext, useContext } from "react";

export const HistoryContext = createContext();

export const useHistoryContext = () => useContext(HistoryContext);

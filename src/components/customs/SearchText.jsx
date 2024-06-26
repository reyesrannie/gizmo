import { Divider, IconButton, InputBase, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";

import "../styles/SearchText.scss";

import SearchIcon from "@mui/icons-material/Search";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { useSelector } from "react-redux";

const SearchText = ({ onSearchData }) => {
  const clearSearch = useSelector((state) => state.transaction.clearSearch);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (clearSearch) {
      setSearch("");
      onSearchData("");
    }
  }, [clearSearch]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearchData(e.target.value);
    }
    if (e.key === "Backspace" && e.target.value.length <= 1) {
      setSearch("");
      onSearchData("");
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value === "") {
      onSearchData("");
    }
  };

  return (
    <Paper className="search-container">
      <InputBase
        className="input-base"
        placeholder="Search"
        value={search}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      <Divider orientation="vertical" className="search-divider" />
      <IconButton
        onClick={() => {
          if (search) {
            setSearch("");
            onSearchData("");
          }
        }}
      >
        {search ? (
          <HighlightOffOutlinedIcon className="icon-search" />
        ) : (
          <SearchIcon className="icon-search" />
        )}
      </IconButton>
    </Paper>
  );
};

export default SearchText;

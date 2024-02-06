import { Divider, IconButton, InputBase, Paper } from "@mui/material";
import React, { useState } from "react";

import "../styles/SearchText.scss";

import SearchIcon from "@mui/icons-material/Search";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

const SearchText = ({ onSearchData }) => {
  const [search, setSearch] = useState("");

  return (
    <Paper className="search-container">
      <InputBase
        className="input-base"
        placeholder="Search"
        value={search}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearchData(e.target.value);
          }
        }}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Divider orientation="vertical" className="search-devider" />
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

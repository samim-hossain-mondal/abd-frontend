import React from 'react';

import PropTypes from 'prop-types';
import { TextField, IconButton } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";

function SearchBar({ setSearchQuery }) {
  return (
    <form>
      <TextField
        id="search-bar"
        className="text"
        onInput={(e) => { setSearchQuery(e.target.value); }}
        label="Search"
        variant="outlined"
        placeholder="Search..."
        size="small"
      />
      <IconButton type="submit" aria-label="search" sx={{ color: "#2258F5" }}>
        <SearchIcon />
      </IconButton>
    </form>
  );
}

SearchBar.propTypes = {
  setSearchQuery: PropTypes.func.isRequired
};

export default SearchBar;
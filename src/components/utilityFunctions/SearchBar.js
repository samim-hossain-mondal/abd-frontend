import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, IconButton } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ query, setQuery }) {

  const [searchInput, setSearchInput] = useState(query.search);

  return (
    <form>
      <TextField
        id="search-bar"
        className="text"
        onInput={(e) => { setSearchInput(e.target.value); }}
        label="Search"
        variant="outlined" placeholder="Search..." size="small"
        InputProps={{
          endAdornment: (
            <IconButton type="submit" sx={{ color: "primary.main" }} onClick={(e) => { e.preventDefault(); setQuery({ ...query, search: searchInput }); }}>
              <SearchIcon />
            </IconButton>
          ),
        }}
      />
    </form>
  );
}
SearchBar.propTypes = {
  query: PropTypes.shape({
    search: PropTypes.string,
    status: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }).isRequired,
  setQuery: PropTypes.func.isRequired
};
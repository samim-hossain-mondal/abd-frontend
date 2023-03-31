import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, useMediaQuery } from '@mui/material';
import { useDebouncedCallback } from 'use-debounce';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar({ query, setQuery }) {

  const [searchInput, setSearchInput] = useState(query.search);
  const breakpoint391 = useMediaQuery('(min-width: 391px)');

  const debounced = useDebouncedCallback(
    (value) => {
      setSearchInput(value);
      setQuery({ ...query, search: value })
    },
    500,
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery({ ...query, search: searchInput })
  }

  return (
    <form onSubmit={(e)=>{handleSubmit(e)}} onChange={(e)=>debounced(e.target.value)} data-testid='search-form'>
      <TextField
        id="search-bar"
        data-testid="search-bar"
        className="text"
        label="Search"
        variant="outlined" placeholder="Search..." size="small"
        InputProps={{
          endAdornment: (
            <SearchIcon sx={{ color: 'primary.main' }} />
          ),
        }}
        sx={{ width: breakpoint391 ? '200px' : "148px" }}
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
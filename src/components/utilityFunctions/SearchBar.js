import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, useMediaQuery } from '@mui/material';
import {useDebouncedCallback} from 'use-debounce';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar({ query, setQuery }) {

  const [searchInput, setSearchInput] = useState(query.search);
  const aboveTablet = useMediaQuery('(min-width: 769px)');

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
    <form onSubmit={(e)=>{handleSubmit(e)}} onChange={(e)=>debounced(e.target.value)}>
      <TextField
        id="search-bar"
        className="text"
        label="Search"
        variant="outlined" placeholder="Search..." size="small"
        InputProps={{
          endAdornment: (
            <SearchIcon sx={{ color: 'primary.main' }}/>
          ),
        }}
        sx={{ width: aboveTablet ? '200px' : '138px' }}
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
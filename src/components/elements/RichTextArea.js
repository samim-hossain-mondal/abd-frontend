/* eslint-disable react/forbid-prop-types */
import { List, ListItem, ListItemButton, Tooltip, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import emoji from '@jukben/emoji-search';
import { Box } from '@mui/system';
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import Proptypes from 'prop-types';
import { getAllMembersData } from '../utilityFunctions/User';
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import { ErrorContext } from '../contexts/ErrorContext';

function Loading() {
  return <Box>Loading...</Box>;
}

function Item({ entity: { name, char } }) {
  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton>
          <Typography>{char}</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '15px' }}>{name}</Typography>
        </ListItemButton>
      </ListItem>
    </List>
  )
}

export default function RichTextArea({ value, placeholder, setContent, sx, disabled, enableTag, totalCharacters }) {

  const [users, setUsers] = useState([]);
  const { projectDetails } = useContext(ProjectUserContext);
  const { setError } = useContext(ErrorContext);
  const [charCount, setCharCount] = useState(value?.length ?? 0);

  useEffect(() => {
    setUsers(getAllMembersData(projectDetails?.projectMembers ?? []));
  }, [projectDetails]);

  const getSimilarUsers = (text) => {
    const similarUsers = users.filter((user) => user.email.toLowerCase().includes(text.toLowerCase()));
    return similarUsers.map((user) => ({ name: user.email, char: '@' }));
  }

  const handleChangeTextArea = (e) => {
    if (e.target.value.length > totalCharacters ?? 300) {
      setError(`You can't write more than ${totalCharacters ?? 300} characters`);
    }
    setCharCount(Math.min(e.target.value.length, totalCharacters));
    setContent(String(e.target.value).slice(0, totalCharacters ?? 300));
  };

  return (
    <Box sx={{
      width: '100%',
      margin: '0px',
      padding: 0,
      position: 'relative'
    }}>
      <ReactTextareaAutocomplete
        className="autocomplete-textarea"
        loadingComponent={Loading}
        sx={{ ...sx }}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        style={{
          fontFamily: 'Poppins',
          color: '#121212',
          width: '100%',
          multiline: true,
          rows: 4,
          fontSize: '16px',
          padding: '15px 20px',
          height: '100px',
          borderRadius: '8px',
          resize: 'none',
          ...sx,
        }}
        containerStyle={{
          margin: '5px auto'
        }}
        minChar={0}
        onChange={(e) => handleChangeTextArea(e)}
        trigger={{
          ':': {
            dataProvider: token => emoji(token)
              .slice(0, 3)
              .map(({ name, char }) => ({ name, char })),
            component: Item,
            output: (item) => item.char
          },
          '@': enableTag ? {
            dataProvider: token => getSimilarUsers(token)
              .slice(0, 3)
              .map(({ name, char }) => ({ name, char })),
            component: Item,
            output: (item) => item.char + item.name,
          } : {}

          // For adding users we can use @ as trigger
        }}
      />
      {!disabled && <Tooltip title="Characters Limit" placement='top'>
        <Typography sx={{
          position: 'absolute',
          left: '16px',
          bottom: '-20px',
          fontSize: '12px',
        }}>
          {charCount}/{totalCharacters ?? 300}
        </Typography>
      </Tooltip>}
    </Box >
  )
}

Item.propTypes = {
  entity: Proptypes.shape({
    name: Proptypes.string.isRequired,
    char: Proptypes.string.isRequired,
  }).isRequired,
};

RichTextArea.propTypes = {
  value: Proptypes.string.isRequired,
  placeholder: Proptypes.string.isRequired,
  setContent: Proptypes.func.isRequired,
  sx: Proptypes.object.isRequired,
  disabled: Proptypes.bool,
  enableTag: Proptypes.bool,
  totalCharacters: Proptypes.number,
};

RichTextArea.defaultProps = {
  disabled: false,
  enableTag: false,
  totalCharacters: 300,
};

/* eslint-disable react/forbid-prop-types */
import { List, ListItem, ListItemButton, Typography } from '@mui/material'
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

export default function RichTextArea({ value, placeholder, setContent, sx, disabled, enableTag }) {

  const [users, setUsers] = useState([]);
  const { projectDetails } = useContext(ProjectUserContext);
  const { setError } = useContext(ErrorContext);

  useEffect(() => {
    setUsers(getAllMembersData(projectDetails?.projectMembers ?? []));
  }, [projectDetails]);

  const getSimilarUsers = (text) => {
    const similarUsers = users.filter((user) => user.email.toLowerCase().includes(text.toLowerCase()));
    return similarUsers.map((user) => ({ name: user.email, char: '@' }));
  }

  const handleChangeTextArea = (e) => {
    if(e.target.value.length > 300)
    {
      setError("You can't write more than 300 characters");
      return;
    }
    setContent(e.target.value);
  };

  return (
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
    />)
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
};

RichTextArea.defaultProps = {
  disabled: false,
  enableTag: false

};

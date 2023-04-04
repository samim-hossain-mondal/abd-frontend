import React, { useContext, useEffect, useState } from 'react';
import { Close as CloseIcon } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box, Button, IconButton, Typography, List, ListItem, ListItemButton, Tooltip, Avatar } from '@mui/material';
import emoji from '@jukben/emoji-search';
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import stc from 'string-to-color';
import stringAvatar from '../../utilityFunctions/getStringColor';
import { getAllMembersData } from '../../utilityFunctions/User';
import { ProjectUserContext } from '../../contexts/ProjectUserContext';
import { ErrorContext } from '../../contexts/ErrorContext';
import DeleteDialog from '../DeleteDialog';

function Item({ entity: { name, char } }) {
  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton>
          <Typography>{char}</Typography>
          <Typography sx={{ fontWeight: 900, fontSize: '15px' }}>{name}</Typography>
        </ListItemButton>
      </ListItem>
    </List>
  )
}

function Loading() {
  return <Box>Loading...</Box>;
}

export default function GenericInputModal({
  onCloseButtonClick,
  title,
  defaultValue,
  children,
  primaryButtonText,
  onPrimaryButtonClick,
  secondaryButtonText,
  onSecondaryButtonClick,
  placeholder,
  isDisabled,
  setIsDisabled,
  deleteRequest,
  authorize,
  totalCharacters,
  authorName,
  authorId,
  date
}) {
  const matchesLargeSize = useMediaQuery('(min-width:400px)');
  const [content, setContent] = useState(defaultValue ?? '');
  const [users, setUsers] = useState([]);
  const { projectDetails } = useContext(ProjectUserContext);
  const { user } = useContext(ProjectUserContext);
  const { setSuccess, setError } = useContext(ErrorContext);
  const [charCount, setCharCount] = useState(content.length ?? 0);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    setUsers(getAllMembersData(projectDetails.projectMembers ?? []));
  }, []);

  const getSimilarUsers = (text) => {
    const similarUsers = users.filter((_user) => _user.email.toLowerCase().includes(text.toLowerCase()));
    return similarUsers.map((_user) => ({ name: _user.email, char: '@' }));
  }

  const handleChangeTextArea = (e) => {
    if (e.target.value.length > 300) {
      setError(`You can't write more than ${totalCharacters ?? 300} characters`);
    }
    setCharCount(Math.min(e.target.value.length, totalCharacters));
    setContent(String(e.target.value).slice(0, totalCharacters ?? 300));
  }

  return (
    <Box
      sx={{
        width: 'max(25vw, 340px)',
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 30px 60px rgba(32, 56, 85, 0.15)',
        borderRadius: '8px',
        padding: '16px 24px 24px 24px',
      }}
    >
      <DeleteDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        handleDelete={deleteRequest}
        description="Are you sure you want to delete this ?"
      />
      {
        (isDisabled !== undefined)
          ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: authorize ? 'space-between' : "flex-end",
              }}
            >
              {authorize &&
                <Tooltip title="Delete Request" placement='top'>
                  <IconButton onClick={() => {
                    setOpenDeleteDialog(true);
                  }}
                    sx={{ padding: 0 }}
                  >
                    <DeleteForeverIcon date-testid='delete-icon' />
                  </IconButton>
                </Tooltip>
              }
              <Box>
                {authorize &&
                  <Tooltip title="Edit Request" placement='top'>
                    <IconButton onClick={() => setIsDisabled(!isDisabled)}>
                      <EditIcon data-testid='edit-icon' color={!isDisabled ? 'primary' : "none"} />
                    </IconButton>
                  </Tooltip>
                }
                <Tooltip title="Close" placement='top'>
                  <IconButton onClick={() => onCloseButtonClick(content)} sx={{ padding: 0 }}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )
          : (
            <Box sx={{ textAlign: 'right' }}>
              <Tooltip title="Close" placement='top'>
                <IconButton onClick={() => onCloseButtonClick(content)} sx={{ padding: 0 }}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )
      }
      <Typography variant="h5" sx={{ mt: 1 }}>
        {title}
      </Typography>
      {
        user.memberId !== authorId &&
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 1 }}>
              <Avatar {...stringAvatar(authorName, stc)}
                sx={{ width: "30px", height: "30px", aspectRatio: "1/1", bgcolor: stc(authorName) }}
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.9rem', lineHeight: 1 }}>{authorName}</Typography>
              <Typography variant="caption" sx={{ color: 'gray', fontSize: '0.7rem' }}>
                {date.toLocaleString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit', hour12: true
                })}
              </Typography>
            </Box>
          </Box>
        </Box>
      }
      <Box sx={{
        width: '100%',
        margin: '8px 0',
        padding: 0,
        position: 'relative'
      }}>
        <ReactTextareaAutocomplete
          className="autocomplete-textarea"
          loadingComponent={Loading}
          style={(matchesLargeSize) ? {
            width: '88%',
            padding: '20px',
            boxShadow: '0px 5px 15px rgba(119, 132, 238, 0.3)',
            multiline: true,
            rows: 4,
            borderRadius: '8px',
            fontSize: '16px',
            lineHeight: '20px',
            height: '130px',
            fontFamily: 'Roboto, sans-serif',
            resize: 'none'
          } : {
            width: '80%',
            padding: '20px',
            boxShadow: '0px 5px 15px rgba(119, 132, 238, 0.3)',
            borderRadius: '8px',
            multiline: true,
            rows: 4,
            fontSize: '16px',
            lineHeight: '20px',
            height: '130px',
            fontFamily: 'Roboto, sans-serif',
            resize: 'none'
          }}
          containerStyle={{
            width: '100%',
            padding: 0,
          }}
          minChar={0}
          trigger={{
            ':': {
              dataProvider: token => emoji(token)
                .slice(0, 3)
                .map(({ name, char }) => ({ name, char })),
              component: Item,
              output: (item) => item.char
            },
            '@': {
              dataProvider: token => getSimilarUsers(token)
                .slice(0, 3)
                .map(({ name, char }) => ({ name, char })),
              component: Item,
              output: (item) => item.char + item.name,
            }
          }}
          value={content}
          rows={4}
          placeholder={placeholder}
          onChange={(e) => handleChangeTextArea(e)}
          disabled={isDisabled}
        />
        <Tooltip title="Copy to clipboard" placement='top'>
          <ContentCopyIcon sx={{
            position: 'absolute',
            right: '16px',
            bottom: '16px',
            cursor: 'pointer',
          }} onClick={async () => {
            try {
              await navigator.clipboard.writeText(content);
              setSuccess('Copied to clipboard')
            } catch (err) {
              setError('Failed to copy to clipboard');
            }
          }} />
        </Tooltip>
        {!isDisabled && <Tooltip title="Characters Limit" placement='top'>
          <Typography sx={{
            position: 'absolute',
            left: '16px',
            bottom: '-24px',
            fontSize: '12px',
          }}>
            {charCount}/{totalCharacters ?? 300}
          </Typography>
        </Tooltip>}
      </Box>

      {children}
      {
        !isDisabled && (
          <Button
            sx={{
              margin: '16px 0',
              padding: '12px 0',
              width: '100%',
              borderRadius: '8px',
              color: 'customButton1.contrastText',
              backgroundColor: 'customButton1.main',
              '&:hover': {
                color: 'customButton1.contrastText',
                backgroundColor: 'customButton1.main',
              },
            }}
            onClick={() => onPrimaryButtonClick(content)}
          >
            {primaryButtonText}
          </Button>
        )
      }
      {secondaryButtonText && (
        <Button
          sx={{
            padding: '12px 0',
            width: '100%',
            borderRadius: '8px',
            color: 'secondaryButton.contrastText',
            backgroundColor: 'secondaryButton.main',
            '&:hover': {
              color: 'secondaryButton.contrastText',
              backgroundColor: 'secondaryButton.main',
            },
          }}
          onClick={() => onSecondaryButtonClick(content)}
        >
          {secondaryButtonText}
        </Button>
      )}
    </Box>
  );
}

Item.propTypes = {
  entity: PropTypes.shape({
    name: PropTypes.string.isRequired,
    char: PropTypes.string.isRequired,
  }).isRequired,
};

GenericInputModal.propTypes = {
  onCloseButtonClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  primaryButtonText: PropTypes.string.isRequired,
  onPrimaryButtonClick: PropTypes.func,
  children: PropTypes.node,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  secondaryButtonText: PropTypes.string,
  onSecondaryButtonClick: PropTypes.func,
  isDisabled: PropTypes.bool,
  setIsDisabled: PropTypes.func,
  deleteRequest: PropTypes.func,
  authorize: PropTypes.bool,
  totalCharacters: PropTypes.number,
  authorName: PropTypes.string.isRequired,
  authorId: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired
};

GenericInputModal.defaultProps = {
  onPrimaryButtonClick: () => { },
  onSecondaryButtonClick: () => { },
  secondaryButtonText: undefined,
  children: undefined,
  placeholder: undefined,
  defaultValue: undefined,
  isDisabled: undefined,
  setIsDisabled: () => { },
  deleteRequest: () => { },
  authorize: false,
  totalCharacters: 300,
};
import React, { useContext, useEffect, useState } from 'react';
import { Close as CloseIcon } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, IconButton, Typography,List, ListItem, ListItemButton } from '@mui/material';
import { Box } from '@mui/system';
import emoji from '@jukben/emoji-search';
import ReactTextareaAutocomplete from '@webscopeio/react-textarea-autocomplete';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getAllMembersData } from '../../utilityFunctions/User';
import { ProjectUserContext } from '../../contexts/ProjectUserContext';
import { ErrorContext } from '../../contexts/ErrorContext';
import DeleteDialog from '../DeleteDialog';
import { MODAL_TITLE, MODAL_CONTENT, DSM_ANNOUNCEMENT_TITLE_PLACEHOLDER, DELETE_CONFIRMATION_TEXT, ERROR_MESSAGES } from '../../constants/dsm/Announcements';

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

export default function AnnouncementInputModal({
  onCloseButtonClick,
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
  title
}) {
  const matchesLargeSize = useMediaQuery('(min-width:400px)');
  const [content, setContent] = useState(defaultValue ?? '');
  const [announcementTitle, setAnnouncementTitle] = useState(title);
  const [users, setUsers] = useState([]);
  const { projectDetails } = useContext(ProjectUserContext);
  const {setSuccess, setError} = useContext(ErrorContext);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    setUsers(getAllMembersData(projectDetails.projectMembers ?? []));
  }, []);

  const getSimilarUsers = (text) => {
    const similarUsers = users.filter((user) => user.email.toLowerCase().includes(text.toLowerCase()));
    return similarUsers.map((user) => ({ name: user.email, char: '@' }));
  }

  const handleChangeTextArea = (e) => {
    if(e.target.value.length > 2000)
    {
      setError(ERROR_MESSAGES.CONTENT_LENGTH_EXCEEDED);
      return;
    }
    setContent(e.target.value);
  }

  const handleChangeTitle = (e) => {
    if(e.target.value.length > 255){
      setError(ERROR_MESSAGES.TITLE_LENGTH_EXCEEDED);
      return;
    }
    setAnnouncementTitle(e.target.value);
  };

  return (
    <Box
      sx={matchesLargeSize ? {
        width: 'max(25vw, 340px)',
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 30px 60px rgba(32, 56, 85, 0.15)',
        borderRadius: '8px',
        padding: '16px 24px 24px 24px',
      } : {
        width: 'max(25vw, 255px)',
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 30px 60px rgba(32, 56, 85, 0.15)',
        borderRadius: '8px',
        padding: '16px 24px 24px 24px',
      }
      }
    >
      <DeleteDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        handleDelete={deleteRequest}
        description={DELETE_CONFIRMATION_TEXT}
      />
      {/* Action Buttons */}
      {
        (isDisabled !== undefined)
          ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: authorize ? 'space-between' : "flex-end",
              }}
            >
              {authorize && <IconButton onClick={() => {
                setOpenDeleteDialog(true);
              }} sx={{ padding: 0 }}>
                <DeleteForeverIcon date-testid='delete-icon' />
              </IconButton>}
              <Box>
                {authorize && <IconButton onClick={() => setIsDisabled(false)}>
                  <EditIcon data-testid='edit-icon' />
                </IconButton>}
                <IconButton onClick={() => onCloseButtonClick(content)} sx={{ padding: 0 }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          )
          : (
            <Box sx={{ textAlign: 'right' }}>
              <IconButton onClick={() => onCloseButtonClick(content)} sx={{ padding: 0 }}>
                <CloseIcon />
              </IconButton>
            </Box>
          )
      }

      {/* Title */}
      <Typography
        sx={{ fontWeight: 700}}
      >{MODAL_TITLE}</Typography>

      {/* Title */}
      <Box sx={{
        width: '100%',
        margin: '16px 0',
        position: 'relative'
      }}>
        <ReactTextareaAutocomplete
          className="autocomplete-textarea"
          loadingComponent={Loading}
          style={(matchesLargeSize) ? {
            width: '88%',
            padding: '20px 20px 50px 20px',
            boxShadow: '0px 5px 15px rgba(119, 132, 238, 0.3)',
            borderRadius: '8px',
            fontSize: '16px',
            lineHeight: '20px',
            height: '20px',
            fontFamily: 'Roboto, sans-serif',
            resize: 'none',
            multiline: true,
          } : {
            width: '80%',
            padding: '20px 20px 50px 20px',
            boxShadow: '0px 5px 15px rgba(119, 132, 238, 0.3)',
            borderRadius: '8px',
            fontSize: '16px',
            lineHeight: '20px',
            height: '20px',
            fontFamily: 'Roboto, sans-serif',
            resize: 'none',
            multiline: true,
          }}
          minChar={0}
          trigger={{
          }}
          containerStyle={{
            width: '100%',
            padding: 0,
          }}
          disabled={isDisabled}
          onChange={handleChangeTitle}
          value={announcementTitle}
          rows={2}
          placeholder={DSM_ANNOUNCEMENT_TITLE_PLACEHOLDER}
        />

      </Box>

      <Typography 
        sx={{ fontWeight: 700}}
      >{MODAL_CONTENT}</Typography>

      {/* TextField */}
      <Box sx={{
        width: '100%',
        margin: '16px 0',
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
            // can add emojis with : trigger if required
          }}
          value={content}
          rows={4}
          placeholder={placeholder}
          onChange={(e) => handleChangeTextArea(e)}
          disabled={isDisabled}
        />

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
      </Box>

      {children}

      {/* Primary Button */}
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
            onClick={() => onPrimaryButtonClick(content, announcementTitle)}
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

AnnouncementInputModal.propTypes = {
  onCloseButtonClick: PropTypes.func.isRequired,
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
  title: PropTypes.string,
};

AnnouncementInputModal.defaultProps = {
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
  title: ''
};
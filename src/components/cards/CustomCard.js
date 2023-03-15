import React, { useState } from 'react'
import { PropTypes } from 'prop-types';
import {
  Box, Card, CardContent, Typography, Button,
  Checkbox, styled, Stack, Avatar, Tooltip, CardActionArea
}
  from '@mui/material';
import stc from 'string-to-color';
import axios from 'axios';
import Status from './Status';
import dateGetter from '../utilityFunctions/DateGetter';
import { STATUS, TYPE } from '../utilityFunctions/Enums';
import { statusCompleted, statusDraft } from '../utilityFunctions/Color';
import { collaborators } from '../constants/PONotes';
import { DOMAIN } from '../../config';
import { ErrorContext } from '../contexts/ErrorContext';
import PONotesDialog from '../poNotesComponents/PONotesDialog';
import PreventParentClick from '../utilityFunctions/PreventParentClick';

const stringToColor = (string) => (stc(string))
function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

const Cards = styled(Card)(() => ({
  width: 'auto',
  height: 'auto',
  borderRadius: 30,
}));
const CardHeader = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between'
}));

export default function CustomCard({ checkBox, data, type }) {
  const [checked, setChecked] = useState(data.status === STATUS.completed);
  const { setError, setSuccess } = React.useContext(ErrorContext);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false ?? !open)
  };

  const isActionItem = () => {
    if (type === TYPE.action_item) {
      return true;
    }
    return false;
  }

  const handleToggle = async (status) => {
    try {
      handleClose();
      const body = { 'status': !status ? STATUS.completed : STATUS.pending }
      await axios.patch(`${DOMAIN}/api/po-notes/${data.noteId}`, body)
      setSuccess(`Suceessfully marked as ${!status ? STATUS.completed : STATUS.pending}`)
      setChecked(!status)
    }
    catch (er) {
      setError(`${er.message}Error in marking as ${!status ? STATUS.completed : STATUS.pending}`)
    }
  }

  const handleLinkButton = () => {
    handleClose();
    console.log("JIRA LINK")
  }

  const isDraft = () => {
    if (data.status === STATUS.draft) return true;
    return false;
  }

  const renderdueDate = () => {
    if (isActionItem()) {
      return <Typography color="primary" fontWeight={500} mt={2} pl={1} >
        <Typography variant="overline" display="inline-flex" gutterBottom pr={1}>
          Needed By
        </Typography>
        {dateGetter(data.dueDate, false)}
      </Typography >
    }
    return <Typography color="primary" fontWeight={500} mt={2} pl={1} sx={{ visibility: 'hidden ' }}> Needed By {dateGetter(data.dueDate, false)} </Typography>
  }
  const renderLink = () => {
    if (isActionItem()) {
      return <Button variant="contained" size='small' sx={{ display: 'inline-flex' }} onClick={PreventParentClick(() => handleLinkButton())}>JIRA LINK</Button>
    }
    return <Button variant="contained" sx={{ display: 'inline-flex', visibility: 'hidden' }} >JIRA LINK</Button>
  }

  const renderCheckBox = () => {
    if (checkBox === true) {
      if (isDraft()) {
        return <Checkbox color='primary' size="large" disabled />
      }
      return <Checkbox color='primary' size="large" checked={checked} onChange={() => handleToggle(checked)} />
    }
    return <Checkbox color='primary' size="large" sx={{ visibility: 'hidden' }} />
  };
  return (
    <Box m={3}>
      <PONotesDialog updateItem open={open} handleClose={handleClose} data={data} />
      <Cards>
        <CardActionArea onClick={handleClickOpen}>
          <CardContent >
            <CardHeader>{renderCheckBox()}
              {isDraft() ?
                (<Status colour={statusDraft} status={STATUS.draft} />) :
                (<Status colour={statusCompleted} status={STATUS.published} />)
              }
              <Typography variant="caption" display="block" gutterBottom>
                {dateGetter(data.createdAt, true)}
              </Typography>
            </CardHeader>
            <Box>
              <Tooltip title={data.note}>
                <Typography mt={3} pl={1} sx={{
                  maxWidth: '400px',
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  wordWrap: "break-word",
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                }}> {data.note}</Typography>
              </Tooltip>
            </Box>
            <Box sx={{ position: 'relative', bottom: 0, top: 35 }}>
              {renderdueDate()}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={-1} mb={4} pl={1}>
                  {collaborators.map((names) => <Avatar {...stringAvatar(names)} />)}
                </Stack>
                <Box pr={2}> {renderLink()} </Box>
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
      </Cards>
    </Box>
  );
};

CustomCard.propTypes = {
  checkBox: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  data: PropTypes.shape({
    noteId: PropTypes.number.isRequired,
    note: PropTypes.string.isRequired,
    issueLink: PropTypes.string,
    dueDate: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    status: PropTypes.string,
  }).isRequired,
};

import React, { useContext, useEffect, useState } from 'react'
import { PropTypes } from 'prop-types';
import {
  Box,
  Card,
  Typography,
  Checkbox,
  styled,
  Tooltip,
  Link,
}
  from '@mui/material';
import { useParams } from 'react-router-dom';
import Status from './Status';
import dateGetter from '../utilityFunctions/DateGetter';
import { STATUS, TYPE } from '../utilityFunctions/Enums';
import { statusCompleted, statusDraft } from '../utilityFunctions/Color';
import { ErrorContext } from '../contexts/ErrorContext';
import PONotesDialog from '../poNotesComponents/PONotesDialog';
import makeRequest from '../utilityFunctions/makeRequest/index';
import { PATCH_PO_NOTE } from '../constants/apiEndpoints';
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import { isAdmin } from '../constants/users';
import { getDateGroupName } from '../utilityFunctions/dateMatcher';
import DateDivider from '../elements/DateDivider';
import { LoadingContext } from '../contexts/LoadingContext';

const Cards = styled(Card)(() => ({
  borderRadius: 8,
}));
const CardHeader = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between'
}));

export default function CustomCard({ checkBox, data, previousRequestDate, type }) {
  const [checked, setChecked] = useState(data.status === STATUS.completed);
  const { setError, setSuccess } = React.useContext(ErrorContext);
  const [open, setOpen] = React.useState(false);
  const { projectId } = useParams()
  const { userRole } = useContext(ProjectUserContext)
  const { setLoading } = useContext(LoadingContext);

  const [dateGroupName, setDateGroupName] = useState();

  useEffect(() => {
    setDateGroupName(getDateGroupName(new Date(data.createdAt), previousRequestDate));
  }, [data, previousRequestDate]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false ?? !open)
  };

  const isActionItem = () => {
    if (type === TYPE.action_item.toUpperCase()) {
      return true;
    }
    return false;
  }

  const handleToggle = async (e) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      if (!isAdmin(userRole)) {
        setError("ACCESS DENIED: ADMIN's can perform this action")
        return;
      }
      const status = checked;
      handleClose();
      const body = { 'status': !status ? STATUS.completed : STATUS.pending }
      await makeRequest(PATCH_PO_NOTE(projectId, data.noteId), setLoading, { data: body });
      setSuccess(`Suceessfully marked as ${!status ? STATUS.completed : STATUS.pending}`);
      setChecked(!status);
    }
    catch (err) {
      setError(`${err.message} Error in marking as ${!checked ? STATUS.completed : STATUS.pending}`);
    }
  }

  const isDraft = () => {
    if (data.status === STATUS.draft) return true;
    return false;
  }

  const renderCheckBox = () => {
    if (checkBox === true) {
      if (isDraft()) {
        return <Checkbox color='primary' size="medium" disabled />
      }
      return (
        <Tooltip title="Mark as completed" onClick={handleToggle}>
          <Checkbox color='primary' size="medium" disabled={!isAdmin(userRole)} checked={checked} onChange={handleToggle} />
        </Tooltip>
      )
    }
    return <Checkbox color='primary' size="medium" sx={{ visibility: 'hidden' }} />
  };

  return (
    <Box m={3}>
      {dateGroupName &&
        <DateDivider dateGroupName={dateGroupName} sx={{ padding: "0 0 24px 0" }} />
      }
      <PONotesDialog updateItem open={open} handleClose={handleClose} data={data} access={isAdmin(userRole)} />
      <Cards>
        <Box onClick={handleClickOpen} sx={{ padding: '5px 18px 12px 18px', cursor: "pointer" }}>
          <Box sx={{ padding: '0', margin: '0' }}>
            <CardHeader>
              {renderCheckBox()}
              {isDraft() ?
                (<Status colour={statusDraft} status={STATUS.draft} />) :
                (<Status colour={statusCompleted} status={STATUS.published} />)
              }
            </CardHeader>
            <Box>
              <Tooltip title={data.note}>
                <Typography mt={3} pl={1} sx={{
                  maxWidth: '400px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  wordWrap: 'break-word',
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                }}> {data.note}</Typography>
              </Tooltip>
            </Box>
            <Box marginTop="25px" display="flex" justifyContent='space-between' alignItems="baseline">
              <Box>
                {
                  isActionItem() && data?.dueDate !== null && data?.dueDate !== undefined &&
                  <Box display='flex' alignItems="baseline">
                    <Typography sx={{ fontSize: "0.75rem", marginRight: "5px" }}>
                      Needed by
                    </Typography>
                    <Typography color="primary" fontWeight={500} sx={{ fontSize: "0.95rem" }}>
                      {dateGetter(data.dueDate, false)}
                    </Typography >
                  </Box>
                }
              </Box>
              <Box>
                <Box>
                  {
                    isActionItem() && data?.issueLink && data?.issueLink !== '' &&
                    <Link fontSize="0.95rem" target='_blank' href={data?.issueLink ?? '#'} variant="contained"
                      sx={{ fontFamily: 'poppins', display: 'inline-flex' }} onClick={(e) => e.stopPropagation()}>
                      ISSUE LINK
                    </Link>
                  }
                </Box>
              </Box>
            </Box>
            <Box marginTop="10px">
              <Typography fontSize="0.65rem" variant="caption" display="block" gutterBottom>
                {new Date(data.createdAt).toLocaleString('en-US', {
                  hour: '2-digit', minute: '2-digit', hour12: true
                })}
              </Typography>
            </Box>
          </Box>
        </Box>
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
  previousRequestDate: (PropTypes.instanceOf(Date) || null).isRequired,
};
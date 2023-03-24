/* eslint-disable import/no-cycle */
import { Avatar, Card, CardActions, CardContent, CircularProgress, Grid, IconButton, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import PlusOneRoundedIcon from '@mui/icons-material/PlusOneRounded';
import PropTypes from 'prop-types';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { useParams } from 'react-router-dom';
import stc from 'string-to-color';
import { celebrationType } from '../constants/dsm/Celebrations';
import dateGetter from '../utilityFunctions/DateGetter';
import { ErrorContext } from '../contexts/ErrorContext';
import UpdateCelebrationModal from './UpdateCelebrationModal';
import makeRequest from '../utilityFunctions/makeRequest/index';
import { UPDATE_CELEBRATION_REACTION } from '../constants/apiEndpoints';
import { SUCCESS_MESSAGE } from '../constants/dsm/index';
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import stringAvatar from '../utilityFunctions/getStringColor';

export default function CelebrationCard({ celebration, isPreview, onDeleteCelebration }) {
  const { user } = useContext(ProjectUserContext)
  const { setError, setSuccess } = useContext(ErrorContext)
  const [reacted, setReacted] = useState(false);
  const { projectId } = useParams();

  const [reactCount, setReactCount] = useState(0)
  const [newCelebration, setNewCelebration] = useState({})
  const [updateCelebration, setUpdateCelebration] = useState({})

  const updateCelebrationOnSubmit = () => {
    setNewCelebration(updateCelebration)
  }

  const [openUpdateModal, setOpenUpdateModal] = useState(false)

  useEffect(() => {
    setNewCelebration(celebration)
    setUpdateCelebration(celebration)
    setReactCount(celebration?.reaction?.length ?? 0)
    if (!isPreview && celebration?.reaction?.length > 0) {
      setReacted(celebration?.reaction.find(reaction => reaction.memberId === user.memberId))
    }
  }, [])

  useEffect(() => {
    
  }, [reacted])

  const updateReaction = async (e) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      if (isPreview) return setReacted(!reacted);

      const reqBody = {
        isReacted: !reacted
      }
      const resData = await makeRequest(UPDATE_CELEBRATION_REACTION(projectId, celebration.celebrationId), { data: reqBody })
      setSuccess(SUCCESS_MESSAGE("Reaction").UPDATED);
      setReactCount(reacted ? reactCount - 1 : reactCount + 1)
      setReacted(!reacted);
      return resData;
    }
    catch (err) {
      console.error(err);
      setError(err.message);
      return false;
    }
  }

  return newCelebration ?
    <Card
      sx={{
        minWidth: '310px',
        maxWidth: "310px",
        cursor: !isPreview ? 'pointer' : '',
        borderRadius: '8px',
        border: '2px solid',
        borderColor: newCelebration.type === celebrationType.CELEBRATION ? '#044ED7' : '#FF6E00',
        boxShadow: '0px 5px 15px rgba(119, 132, 238, 0.3)'
      }}
      onClick={() => {
        setOpenUpdateModal(!isPreview)
      }}
    >
      <CardContent sx={{ paddingBottom: '0px' }}>
        <Grid container sx={{ maxHeight: '160px', minHeight: '50px' }}>
          <Grid item xs={2} sx={{ maxHeight: 'inherit', display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', }}>
            {newCelebration.isAnonymous ?
              <Avatar><PersonOutlineRoundedIcon /></Avatar> :
              <Avatar {...stringAvatar(newCelebration.author ?? '  ', stc)} />
            }
          </Grid>
          <Grid item xs={10} sx={{ maxHeight: 'inherit', overflow: 'auto' }}>
            <Typography
              variant='contentMain'
              sx={{ fontSize: 14 }}
              color="#121212"
            // gutterBottom
            >
              {newCelebration.content}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '0px 20px 10px 20px'
        }}
      >
        <Typography variant='contentMain' display="block" marginTop="20px" fontSize="10px">
          {dateGetter(newCelebration.createdAt, true)}
        </Typography>
        {newCelebration.type === celebrationType.CELEBRATION ?
          <IconButton onClick={updateReaction}>
            {reacted ?
              <ThumbUpAltIcon /> :
              <ThumbUpOffAltIcon color="disabled" />
            }
            <Typography fontSize="10px" paddingTop="15px">{reactCount}</Typography>
          </IconButton> :
          <IconButton onClick={updateReaction}>
            <PlusOneRoundedIcon color={!reacted ? 'disabled' : ''} />
            <Typography fontSize="10px" paddingTop="15px">{reactCount}</Typography>
          </IconButton>
        }
      </CardActions>
      <UpdateCelebrationModal
        openModal={openUpdateModal}
        setOpenModal={setOpenUpdateModal}
        newCelebration={{ ...updateCelebration, anonymous: updateCelebration.isAnonymous }}
        setNewCelebration={setUpdateCelebration}
        updateCelebrationOnSubmit={updateCelebrationOnSubmit}
        onDeleteCelebration={onDeleteCelebration}
      />
    </Card > :
    <CircularProgress />
}

CelebrationCard.propTypes = {
  celebration: PropTypes.shape({
    celebrationId: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    author: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    isAnonymous: PropTypes.bool.isRequired,
    reaction: PropTypes.arrayOf(PropTypes.shape({
      memberId: PropTypes.number.isRequired,
    }))
  }).isRequired,
  isPreview: PropTypes.bool,
  onDeleteCelebration: PropTypes.func.isRequired,
};

CelebrationCard.defaultProps = {
  isPreview: false
}
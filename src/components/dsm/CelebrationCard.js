/* eslint-disable import/no-cycle */
import { Avatar, Card, CardActions, CardContent, Grid, Box, IconButton, Typography, useMediaQuery, Tooltip } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import PlusOneRoundedIcon from '@mui/icons-material/PlusOneRounded';
import PropTypes from 'prop-types';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { useParams } from 'react-router-dom';
import stc from 'string-to-color';
import { celebrationType } from '../constants/dsm/Celebrations';
import { ErrorContext } from '../contexts/ErrorContext';
import UpdateCelebrationModal from './UpdateCelebrationModal';
import makeRequest from '../utilityFunctions/makeRequest/index';
import { UPDATE_CELEBRATION_REACTION } from '../constants/apiEndpoints';
import { SUCCESS_MESSAGE } from '../constants/dsm/index';
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import stringAvatar from '../utilityFunctions/getStringColor';
import SkeletonCelebration from '../skeletons/dsm/celebration';
import { LoadingContext } from '../contexts/LoadingContext';

export default function CelebrationCard({
  celebration,
  isPreview, onDeleteCelebration }) {
  const breakpoint391 = useMediaQuery('(min-width:391px)');
  const { user } = useContext(ProjectUserContext);
  const { setError, setSuccess } = useContext(ErrorContext);
  const [reacted, setReacted] = useState(false);
  const { projectId } = useParams();
  const [reactCount, setReactCount] = useState(0);
  const [newCelebration, setNewCelebration] = useState({});
  const [updateCelebration, setUpdateCelebration] = useState({});
  const { setLoading } = useContext(LoadingContext);

  const updateCelebrationOnSubmit = () => {
    setNewCelebration(updateCelebration)
  }

  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  useEffect(() => {
    setNewCelebration(celebration);
    setUpdateCelebration(celebration);
    setReactCount(celebration?.reaction?.length ?? 0);
    if (!isPreview && celebration?.reaction?.length > 0) {
      setReacted(celebration?.reaction.find(reaction => reaction.memberId === user.memberId));
    }
  }, [celebration])

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
      const resData = await makeRequest(UPDATE_CELEBRATION_REACTION(projectId, celebration.celebrationId), setLoading, { data: reqBody })
      setSuccess(SUCCESS_MESSAGE("Reaction").UPDATED);
      setReactCount(reacted ? reactCount - 1 : reactCount + 1);
      setReacted(!reacted);
      return resData;
    }
    catch (err) {
      setError(err.message);
      return false;
    }
  }

  return newCelebration && newCelebration.type ?
    <Card
      sx={{
        maxWidth: breakpoint391 ? "155px" : "95%",
        minWidth: breakpoint391 ? "155px" : "95%",
        cursor: !isPreview ? 'pointer' : '',
        backgroundColor: newCelebration.type === celebrationType.CELEBRATION ? 'cardBackground.main' : 'cardBackground.secondary',
        boxShadow: '0px 5px 15px rgba(119, 132, 238, 0.3)'
      }}
      onClick={() => {
        setOpenUpdateModal(!isPreview);
      }}
    >
      <CardContent sx={{ padding: '10px 10px 5px 10px', minHeight: '80px', maxHeight: "160px" }}>
        <Grid container>
          <Grid item xs={12} sx={{ maxHeight: 'inherit', overflow: 'auto' }}>
            <Typography
              variant='contentMain'
              color="#121212"
              sx={{
                fontSize: 14,
                fontStyle: 'italic',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                WebkitLineClamp: 6,
                WebkitBoxOrient: 'vertical',
                display: '-webkit-box'
              }}
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
          padding: '0px 0px 5px 7px'
        }}
      >
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '5px'
        }}>
          {
            newCelebration.isAnonymous ?
              <Tooltip title="Anonymous" placement="bottom">
                <Avatar sx={{ height: "30px", width: "30px", aspectRatio: "1/1" }}><PersonOutlineRoundedIcon /></Avatar>
              </Tooltip> :
              <Tooltip title={newCelebration.author ?? '  '} placement='bottom'>
                <Avatar {...stringAvatar(newCelebration.author ?? '  ', stc, true)} />
              </Tooltip>
          }
          <Typography paddingTop="24%" variant='contentMain' display="flex" fontSize="0.6rem" lineHeight='2'>
            {new Date(newCelebration.createdAt).toLocaleString('en-US', {
              hour: '2-digit', minute: '2-digit', hour12: true
            })}
          </Typography>
        </Box>
        <Tooltip title="React" placement='bottom'>
          {newCelebration.type === celebrationType.CELEBRATION ?
            <IconButton onClick={updateReaction}>
              {reacted ?
                <ThumbUpAltIcon sx={{ color: 'secondaryButton.primary' }} /> :
                <ThumbUpOffAltIcon sx={{ color: 'secondaryButton.primary', opacity: '0.5' }} />
              }
              <Typography fontSize="8px" paddingTop="15px">{reactCount}</Typography>
            </IconButton> :
            <IconButton onClick={updateReaction}>
              {
                reacted ?
                  <PlusOneRoundedIcon sx={{ color: 'secondaryButton.primary' }} /> :
                  <PlusOneRoundedIcon sx={{ color: 'secondaryButton.primary', opacity: '0.5' }} />
              }
              <Typography fontSize="8px" paddingTop="15px">{reactCount}</Typography>
            </IconButton>
          }
        </Tooltip>
      </CardActions>
      <UpdateCelebrationModal
        openModal={openUpdateModal}
        setOpenModal={setOpenUpdateModal}
        newCelebration={{ ...updateCelebration, anonymous: updateCelebration.isAnonymous }}
        setNewCelebration={setUpdateCelebration}
        updateCelebrationOnSubmit={updateCelebrationOnSubmit}
        onDeleteCelebration={onDeleteCelebration}
      />
    </Card>
    :
    <SkeletonCelebration height="100px" />
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
  previousRequestDate: (PropTypes.instanceOf(Date) || null).isRequired,
};

CelebrationCard.defaultProps = {
  isPreview: false
}
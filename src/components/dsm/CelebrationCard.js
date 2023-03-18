/* eslint-disable import/no-cycle */
import { Avatar, Card, CardActions, CardContent, CircularProgress, Grid, IconButton, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import PlusOneRoundedIcon from '@mui/icons-material/PlusOneRounded';
import PropTypes from 'prop-types';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import axios from 'axios';
import { celebrationType } from '../constants/DSM';
import dateGetter from '../utilityFunctions/DateGetter';
import { DOMAIN } from '../../config';
import { ErrorContext } from '../contexts/ErrorContext';
import UpdateCelebrationModal from './UpdateCelebrationModal';

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  const nameSplits = name.split(' ')
  return {
    sx: {
      bgcolor: stringToColor(name)
    },
    children:
      (nameSplits.length > 1 ?
        `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` :
        `${name.split(' ')[0][0]}${name.split(' ')[0][1]}`
      ).toUpperCase()
  };
}

export default function CelebrationCard({ celebration, isPreview }) {

  const { setError, setSuccess } = useContext(ErrorContext)
  const [reacted, setReacted] = useState(false);

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
    if (!isPreview)
      axios.get(`${DOMAIN}/api/dsm/celebrations/${celebration.celebrationId}/react`).then(reaction => {
        if (reaction.data.length !== 0) setReacted(reaction.data)
      })
        .catch(err => {
          console.error(err);
          setError(val => val + err);
        })
  }, [])

  const updateReaction = async (e) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      if (isPreview) return setReacted(!reacted);
      const res = await axios.patch(`${DOMAIN}/api/dsm/celebrations/${newCelebration.celebrationId}/react`, {
        isReacted: !reacted
      });

      if (!reacted) setReactCount(reactCount + 1)
      else setReactCount(reactCount - 1)

      setSuccess(() => 'Reaction updated Successfully!');
      setReacted(!reacted);
      return res.data;
    }
    catch (err) {
      console.error(err);
      setError(val => val + err);
      return false;
    }
  }

  return newCelebration ?
    <Card
      sx={{
        minWidth: '310px',
        maxWidth: "310px",
        cursor: !isPreview ? 'pointer' : '',
        'border-radius': '8px',
        border: '2px solid',
        borderColor: newCelebration.type === celebrationType.CELEBRATION ? '#044ED7' : '#FF6E00',
        boxShadow: '0px 5px 15px rgba(119, 132, 238, 0.3)'
      }}
      onClick={() => {
        setOpenUpdateModal(!isPreview)
      }}
    >
      <CardContent sx={{ paddingBottom: '0px' }}>
        <Grid container sx={{ 'max-height': '160px', 'min-height': '50px' }}>
          <Grid item xs={2} sx={{ 'max-height': 'inherit', display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', }}>
            {newCelebration.isAnonymous ?
              <Avatar><PersonOutlineRoundedIcon /></Avatar> :
              <Avatar {...stringAvatar(newCelebration.author ?? '')} />
            }
          </Grid>
          <Grid item xs={10} sx={{ 'max-height': 'inherit', overflow: 'auto' }}>
            <Typography
              variant='contentMain'
              sx={{ fontSize: 14 }}
              color="#121212"
            // gutterBottom
            >
              {newCelebration.content}
              {/* Word of the Day Word of the Day
            Word of the Day Word of the DayWord of the DayWord of the DayWord of the DayWord of the DayWord of the DayWord of the DayWord of the DayWord of the DayWord of the DayWord of the Day
            Word of the Day Word of the DayWord of the DayWord of the DayWord of the DayWord of the DayWord of the DayWord of the DayWord of the DayWord of the DayWord of the DayWord of the Day */}
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
            {celebration?._count && <Typography fontSize="10px" paddingTop="15px">{reactCount}</Typography>}
          </IconButton> :
          <IconButton onClick={updateReaction}>
            <PlusOneRoundedIcon color={!reacted ? 'disabled' : ''} />
            {celebration?._count && <Typography fontSize="10px" paddingTop="15px">{reactCount}</Typography>}
          </IconButton>
        }
      </CardActions>
      <UpdateCelebrationModal
        openModal={openUpdateModal}
        setOpenModal={setOpenUpdateModal}
        newCelebration={updateCelebration}
        setNewCelebration={setUpdateCelebration}
        updateCelebrationOnSubmit={updateCelebrationOnSubmit}
      />
    </Card > :
    <CircularProgress />
}

CelebrationCard.propTypes = {
  celebration: PropTypes.shape({
    celebrationId: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    isAnonymous: PropTypes.bool.isRequired,
    _count: PropTypes.shape({
      reaction: PropTypes.number
    })
  }).isRequired,
  isPreview: PropTypes.bool
};

CelebrationCard.defaultProps = {
  isPreview: false
}
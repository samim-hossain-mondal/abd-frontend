/* eslint-disable import/no-cycle */
import { Close as CloseIcon } from '@mui/icons-material';
import { Avatar, Button, Checkbox, FormControlLabel, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import ReportRoundedIcon from '@mui/icons-material/ReportRounded';
import stc from 'string-to-color';
import makeRequest from '../../utilityFunctions/makeRequest/index';
import { UPDATE_CELEBRATION } from '../../constants/apiEndpoints';
import stringAvatar from '../../utilityFunctions/getStringColor';
import CustomDropDown from './CustomDropDown';
import CelebrationCard from '../../dsm/CelebrationCard';
import { celebrationTypes, celebrationPlaceholder, instructions, CHAR_COUNT } from '../../constants/dsm/Celebrations';
import InstructionBox from './InstructionBox';
import RichTextArea from '../RichTextArea';
import DeleteDialog from '../DeleteDialog';
import { ProjectUserContext } from '../../contexts/ProjectUserContext';
import ReportDialog from '../ReportDialog';
import { LoadingContext } from '../../contexts/LoadingContext';
import { ErrorContext } from '../../contexts/ErrorContext';


export default function CelebrationGenericModal({
  isNewCelebration,
  onCloseButtonClick,
  title,
  inputTitle,
  children,
  primaryButtonText,
  onPrimaryButtonClick,
  secondaryButtonText,
  onSecondaryButtonClick,
  isPreview,
  setNewCelebration,
  newCelebration,
  update,
  lock,
  setLock,
  handleDelete,
}) {

  const { user } = useContext(ProjectUserContext);
  const { projectId } = useContext(ProjectUserContext);
  const { setLoading } = useContext(LoadingContext);
  const { setError, setSuccess } = useContext(ErrorContext);

  const reStructureCardDetails = () => ({
    content: newCelebration.content,
    type: newCelebration.type,
    createdAt: new Date(),
    isAnonymous: newCelebration.anonymous,
    author: 'anonymous'
  })

  const setContent = (content) => {
    setNewCelebration({
      ...newCelebration,
      content
    });
  }

  const [deleteAlert, setDeleteAlert] = useState(false);
  const [reportAlert, setReportAlert] = useState(false);
  const [open, setOpen] = useState(false);

  const onReportButtonClick = () => {
    setReportAlert(true);
    setOpen(true);
  }

  const handleReport = async () => {
    try {
      const reqBody = {
        content: newCelebration.content,
        type: newCelebration.type,
        isAnonymous: newCelebration.anonymous,
        isAbuse: true
      }
      const resData = await makeRequest(UPDATE_CELEBRATION(projectId, newCelebration.celebrationId), setLoading, { data: reqBody })
      setSuccess('Reported successfully');
      return resData;
    }
    catch (err) {
      setError(err.message);
      return false;
    }
  }

  const onConfirmDelete = async (e) => {
    setDeleteAlert(false)
    onCloseButtonClick(e)
    await handleDelete();
  }

  const updateAnonymous = (isAnonymous) => {
    setNewCelebration({
      ...newCelebration,
      isAnonymous,
      anonymous: isAnonymous
    });
  }

  const [openDropDown, setOpenDropDown] = useState(false);

  const updateCelebration = (celebration) => {
    setNewCelebration(celebration);
  }

  const onDeleteButtonClick = () => {
    setDeleteAlert(true);
  }

  const onEditButtonClick = () => {
    setLock(!lock);
  }

  const handleChange = (value) => {
    updateCelebration({
      ...newCelebration,
      type: value
    });
    setOpenDropDown(false);
  };

  return (
    <Box
      width={isPreview ? 'max(25vw, 340px)' : 'max(20vw, 340px)'}
      sx={{
        boxSizing: 'border-box',
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 30px 60px rgba(32, 56, 85, 0.15)',
        borderRadius: '8px',
        padding: '16px 24px 24px 24px',
        position: 'relative'
      }}
    >
      <Box
        sx={update ? {
          display: 'flex',
          justifyContent: 'space-between'
        } :
          {
            textAlign: 'right',
          }}
        mb={update ? 2 : 0}
      >
        {update &&
          <Tooltip title="Delete" placement="top">
            <IconButton onClick={() => onDeleteButtonClick()}>
              <DeleteForeverRoundedIcon color={!deleteAlert ? 'secondary' : 'primary'} />
            </IconButton>
          </Tooltip>
        }
        <Box sx={{
          textAlign: 'right',
        }}>
          {update && !isPreview &&
            <Tooltip title="Edit" placement="top">
              <IconButton onClick={() => onEditButtonClick()}>
                <EditRoundedIcon color={lock ? 'secondary' : 'primary'} />
              </IconButton>
            </Tooltip>
          }
          <Tooltip title="Close" placement="top">
            <IconButton onClick={(e) => onCloseButtonClick(e)}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {
        isPreview ?
          <Box>
            <CelebrationCard celebration={reStructureCardDetails(newCelebration)} isPreview={isPreview} />
            <InstructionBox header={instructions[newCelebration.type]?.header} points={instructions[newCelebration.type]?.points} />
          </Box> :
          <Box>
            {
              !isNewCelebration &&
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ mr: 1 }}>
                  {
                    newCelebration.isAnonymous ?
                      <Avatar sx={{ height: "30px", width: "30px", aspectRatio: "1/1" }}><PersonOutlineRoundedIcon /></Avatar>
                      :
                      <Avatar {...stringAvatar(newCelebration.author ?? '  ', stc, true)} />
                  }
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.9rem', lineHeight: 1 }}>
                    {
                      newCelebration.isAnonymous ? 'Anonymous' : newCelebration.author
                    }
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'gray', fontSize: '0.7rem' }}>
                    {new Date(newCelebration.createdAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    })}
                  </Typography>
                </Box>
              </Box>
            }
            <Box sx={{ margin: '0 0 16px 0' }}>
              <Typography variant="contentMain" sx={{ fontSize: '1.2rem', color: '#121212' }}>Share your thoughts</Typography>
            </Box>
            <Box sx={{ margin: '16px 0 16px 0' }}>
              <Typography variant="contentMain" sx={{ fontSize: '1rem', color: '#121212' }}>{title}</Typography>
            </Box>
            <CustomDropDown isMenu={false} value={newCelebration.type} openDropDown={lock ? false : openDropDown} setOpenDropDown={lock ? () => { } : setOpenDropDown} />
            <Box
              disabled={lock}
              visibility={openDropDown ? 'visible' : 'hidden'}
              sx={{
                zIndex: 1,
                bgcolor: 'white',
                position: 'absolute',
                minWidth: '85%'
              }}>
              {celebrationTypes.map((type) => {
                if (type !== newCelebration.type)
                  return <CustomDropDown key={type} isMenu value={type} handleChange={handleChange} />
                return null;
              }
              )}
            </Box>
            {
              user.memberId === newCelebration.memberId &&
              <Box sx={{ margin: '16px 0 10px 0' }}>
                <Typography variant='contentMain' sx={{ fontWeight: 500, color: '#121212', fontSize: "1rem" }} >{inputTitle}</Typography>
              </Box>
            }
            <RichTextArea
              sx={{
                width: '85%',
                margin: '5px 0',
                boxShadow: '0px 5px 15px rgba(119, 132, 238, 0.3)',
                fontSize: '1rem'
              }}
              value={newCelebration.content}
              placeholder={celebrationPlaceholder[newCelebration.type]}
              setContent={setContent}
              enableTag
              disabled={lock}
              totalCharacters={CHAR_COUNT}
            />
            {
              user.memberId !== newCelebration.memberId && !isNewCelebration &&
              < Box sx={{ display: 'flex', flexDirection: 'row-reverse', paddingRight: '16px' }}>
                <Button
                  onClick={onReportButtonClick}
                  sx={{ display: 'flex', borderRadius: '8px', backgroundColor: 'transparent' }}>
                  <ReportRoundedIcon sx={{ color: 'error.main', cursor: 'pointer', pr: '5px' }} />
                  <Typography sx={{ textTransform: 'none' }}>Report abuse</Typography>
                </Button>
              </Box>
            }
            {children}
            {
              reportAlert &&
              <ReportDialog
                open={open}
                setOpen={setOpen}
                handleReport={handleReport}
                description='Are you sure to report this behavior as abusive?'
              />
            }
            {
              (!lock || isNewCelebration) &&
              <FormControlLabel disabled={lock} sx={{ margin: '10px 0', paddingLeft: '5px', paddingTop: '5px', fontFamily: 'Poppins' }} control={
                <Checkbox sx={{
                  color: 'customButton1.main',
                  '&.Mui-checked': {
                    color: 'customButton1.main',
                  }
                }} onChange={() => updateAnonymous(!newCelebration.anonymous)} checked={newCelebration.anonymous} />} label="Post Anonymously" />
            }
          </Box>
      }
      {
        !lock &&
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {
              secondaryButtonText && (
                <Button
                  variant='contained'
                  sx={{
                    margin: '16px 0',
                    padding: '8px 0',
                    width: '100%',
                    borderRadius: '8px',
                    color: 'secondaryButton.contrastText',
                    backgroundColor: 'secondaryButton.main',
                    '&:hover': {
                      color: 'secondaryButton.contrastText',
                      backgroundColor: 'secondaryButton.main',
                    },
                  }}
                  onClick={() => onSecondaryButtonClick()}
                >
                  <Typography variant='contentMain' color="inherit">{secondaryButtonText}</Typography>
                </Button>
              )
            }
          </Grid>
          <Grid item xs={6}>
            <Button
              variant='contained'
              sx={{
                margin: '16px 0',
                padding: '8px 0',
                width: '100%',
                borderRadius: '8px',
                color: 'customButton1.contrastText',
                backgroundColor: 'customButton1.main',
                '&:hover': {
                  color: 'customButton1.contrastText',
                  backgroundColor: 'customButton1.main',
                },
              }}
              onClick={() => onPrimaryButtonClick()}
            >
              <Typography variant='contentMain' color="inherit">{primaryButtonText}</Typography>
            </Button>
          </Grid>
        </Grid>
      }
      <DeleteDialog open={deleteAlert} setOpen={setDeleteAlert} handleDelete={onConfirmDelete} description="Are you sure want to delete celebration" />
    </Box >
  );
}

CelebrationGenericModal.propTypes = {
  onCloseButtonClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  inputTitle: PropTypes.string.isRequired,
  primaryButtonText: PropTypes.string.isRequired,
  onPrimaryButtonClick: PropTypes.func,
  children: PropTypes.node,
  secondaryButtonText: PropTypes.string,
  onSecondaryButtonClick: PropTypes.func,
  isPreview: PropTypes.bool,
  setNewCelebration: PropTypes.func.isRequired,
  isNewCelebration: PropTypes.bool.isRequired,
  newCelebration: PropTypes.shape({
    celebrationId: PropTypes.number,
    type: PropTypes.string,
    content: PropTypes.string,
    anonymous: PropTypes.bool,
    isAnonymous: PropTypes.bool,
    memberId: PropTypes.number,
    author: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  update: PropTypes.bool,
  lock: PropTypes.bool,
  setLock: PropTypes.func,
  handleDelete: PropTypes.func,
};

CelebrationGenericModal.defaultProps = {
  onPrimaryButtonClick: () => {
  },
  onSecondaryButtonClick: () => {
  },
  secondaryButtonText: undefined,
  children: undefined,
  isPreview: false,
  update: false,
  lock: false,
  setLock: () => { },
  handleDelete: () => { }
};
/* eslint-disable import/no-cycle */
import { Dialog } from '@mui/material';
import { Box } from '@mui/system';
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import CelebrationGenericModal from '../elements/dsm/CelebrationGenericModal';
import { ErrorContext } from '../contexts/ErrorContext';
import makeRequest from '../utilityFunctions/makeRequest/index';
import { DELETE_CELEBRATION, UPDATE_CELEBRATION } from '../constants/apiEndpoints';
import { SUCCESS_MESSAGE } from '../constants/dsm/index';
import { GENERIC_NAME } from "../constants/dsm/Celebrations";
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import { LoadingContext } from '../contexts/LoadingContext'

export default function UpdateCelebrationModal({ openModal, setOpenModal, newCelebration, setNewCelebration, updateCelebrationOnSubmit, onDeleteCelebration }) {
  const [preview, setPreview] = useState(false);
  const { user } = useContext(ProjectUserContext);
  const { projectId } = useParams();
  const { setError, setSuccess } = useContext(ErrorContext);
  const { setLoading } = useContext(LoadingContext);
  const [lock, setLock] = useState(true);

  const handleModalClose = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenModal(false);
  }

  const updateCelebrationToDB = async () => {
    try {
      const reqBody = {
        content: newCelebration.content,
        type: newCelebration.type,
        isAnonymous: newCelebration.anonymous
      }
      const resData = await makeRequest(UPDATE_CELEBRATION(projectId, newCelebration.celebrationId), setLoading, { data: reqBody })
      setSuccess(SUCCESS_MESSAGE(GENERIC_NAME).UPDATED);
      return resData;
    }
    catch (err) {
      setError(err.message);
      return false;
    }
  }

  const deleteCelebrationToDB = async () => {
    try {
      const resData = await makeRequest(DELETE_CELEBRATION(projectId, newCelebration.celebrationId), setLoading);
      setSuccess(SUCCESS_MESSAGE(GENERIC_NAME).DELETED);
      return resData;
    }
    catch (err) {
      setError(err.message);
      return false;
    }
  }

  const handleDelete = async () => {
    onDeleteCelebration(newCelebration.celebrationId);
    await deleteCelebrationToDB()
  }

  const handleSubmit = async () => {
    await updateCelebrationToDB()
    updateCelebrationOnSubmit()
    setOpenModal(false);
    setPreview(false);
  }

  return (
    <Box>
      <Dialog
        open={openModal}
        onClose={handleModalClose}
      >
        <CelebrationGenericModal
          title='Type'
          inputTitle="Speak out loud"
          onCloseButtonClick={handleModalClose}
          primaryButtonText='Update'
          onPrimaryButtonClick={handleSubmit}
          secondaryButtonText={preview ? 'Edit' : 'Preview'}
          onSecondaryButtonClick={() => preview ? setPreview(false) : setPreview(true)}
          setNewCelebration={setNewCelebration}
          newCelebration={newCelebration}
          isPreview={preview}
          lock={lock}
          setLock={setLock}
          update={true && user.memberId === newCelebration.memberId}
          handleDelete={handleDelete}
        />
      </Dialog>
    </Box>
  )
}

UpdateCelebrationModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  newCelebration: PropTypes.shape({
    celebrationId: PropTypes.number,
    type: PropTypes.string,
    content: PropTypes.string,
    anonymous: PropTypes.bool,
    memberId: PropTypes.number
  }).isRequired,
  setNewCelebration: PropTypes.func.isRequired,
  updateCelebrationOnSubmit: PropTypes.func.isRequired,
  onDeleteCelebration: PropTypes.func.isRequired
}
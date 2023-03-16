/* eslint-disable import/no-cycle */
import { Dialog } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import CelebrationGenericModal from '../elements/dsm/CelebrationGenericModal'
import { DOMAIN } from '../../config'
import { ErrorContext } from '../contexts/ErrorContext'

export default function UpdateCelebrationModal({ openModal, setOpenModal, newCelebration, setNewCelebration, updateCelebrationOnSubmit }) {
  const [preview, setPreview] = useState(false);
  const { setError, setSuccess } = useContext(ErrorContext)

  const [lock, setLock] = useState(true);

  const handleModalClose = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenModal(false);
  }

  const updateCelebrationToDB = async () => {
    try {
      const res = await axios.patch(`${DOMAIN}/api/dsm/celebrations/${newCelebration.celebrationId}`, {
        content: newCelebration.content,
        type: newCelebration.type,
        isAnonymous: newCelebration.anonymous
      });
      setSuccess(() => 'Celebration Updated Successfully!');
      return res.data;
    }
    catch (err) {
      console.error(err);
      setError(val => val + err);
      return false;
    }
  }

  const deleteCelebrationToDB = async () => {
    try {
      const res = await axios.delete(`${DOMAIN}/api/dsm/celebrations/${newCelebration.celebrationId}`);
      setSuccess(() => 'Celebration Deleted Successfully!');
      return res.data;
    }
    catch (err) {
      console.error(err);
      setError(val => val + err);
      return false;
    }
  }

  const handleDelete = async () => {
    await deleteCelebrationToDB()
  }

  const handleSubmit = async () => {
    await updateCelebrationToDB()
    updateCelebrationOnSubmit()
    setOpenModal(false);
    setPreview(false)
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
          update
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
    celebrationId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    anonymous: PropTypes.bool.isRequired,
  }).isRequired,
  setNewCelebration: PropTypes.func.isRequired,
  updateCelebrationOnSubmit: PropTypes.func.isRequired,
}
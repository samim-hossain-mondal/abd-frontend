import { Dialog } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import CelebrationGenericModal from '../elements/dsm/CelebrationGenericModal'
import { DOMAIN } from '../../config'
import { ErrorContext } from '../contexts/ErrorContext'

export default function AddCelebrationModal({ openModal, setOpenModal, newCelebration, setNewCelebration, resetModal }) {
  const [preview, setPreview] = useState(false);
  const { setError, setSuccess } = useContext(ErrorContext)

  const handleModalClose = () => {
    setOpenModal(false);
  }

  const addCelebrationToDB = async () => {
    try {
      const res = await axios.post(`${DOMAIN}/api/dsm/celebrations`, {
        content: newCelebration.content,
        type: newCelebration.type,
        isAnonymous: newCelebration.anonymous
      });
      setSuccess(() => 'Celebration Created Successfully!');
      return res.data;
    }
    catch (err) {
      console.error(err);
      setError(val => val + err);
      return false;
    }
  }

  const handleSubmit = async () => {
    await addCelebrationToDB()
    resetModal()
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
          primaryButtonText='Post'
          onPrimaryButtonClick={handleSubmit}
          secondaryButtonText={preview ? 'Edit' : 'Preview'}
          onSecondaryButtonClick={() => preview ? setPreview(false) : setPreview(true)}
          setNewCelebration={setNewCelebration}
          newCelebration={newCelebration}
          isPreview={preview}
        />
      </Dialog>
    </Box>
  )
}

AddCelebrationModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  newCelebration: PropTypes.shape({
    type: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    anonymous: PropTypes.bool.isRequired,
  }).isRequired,
  setNewCelebration: PropTypes.func.isRequired,
  resetModal: PropTypes.func.isRequired,
}
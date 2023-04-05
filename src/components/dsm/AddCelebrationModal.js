import { Dialog } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import CelebrationGenericModal from '../elements/dsm/CelebrationGenericModal'
import { ErrorContext } from '../contexts/ErrorContext'
import makeRequest from '../utilityFunctions/makeRequest/index'
import { CREATE_CELEBRATION } from '../constants/apiEndpoints'
import { SUCCESS_MESSAGE } from '../constants/dsm/index'
import { GENERIC_NAME } from '../constants/dsm/Celebrations'
import { LoadingContext } from '../contexts/LoadingContext'

export default function AddCelebrationModal({
  isNewCelebration,
  openModal,
  setOpenModal,
  newCelebration,
  setNewCelebration,
  resetModal,
  setCelebrations,
  celebrations
}) {
  const [preview, setPreview] = useState(false);
  const { projectId } = useParams()
  const { setError, setSuccess } = useContext(ErrorContext)
  const { setLoading } = useContext(LoadingContext);

  const handleModalClose = () => {
    setOpenModal(false);
  }

  const addCelebrationToDB = async () => {
    try {
      const reqBody = {
        content: newCelebration.content,
        type: newCelebration.type,
        isAnonymous: newCelebration.anonymous
      }
      const resData = await makeRequest(CREATE_CELEBRATION(projectId), setLoading, { data: reqBody })
      setSuccess(SUCCESS_MESSAGE(GENERIC_NAME).CREATED);
      const newCelebrations = [resData.newCelebration, ...celebrations]
      setCelebrations(newCelebrations)
      return resData;
    }
    catch (err) {
      console.error(err);
      setError(err.message);
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
        sx={{ zIndex: "900" }}
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
          isNewCelebration={isNewCelebration}
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
  setCelebrations: PropTypes.func.isRequired,
  isNewCelebration: PropTypes.bool.isRequired,
  celebrations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.string,
    type: PropTypes.string,
    isAnonymous: PropTypes.bool
  })).isRequired
}
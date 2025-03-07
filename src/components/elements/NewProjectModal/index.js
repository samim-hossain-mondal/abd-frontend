/* eslint-disable react/no-array-index-key */
/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-undef */
import React, { useState, useContext } from "react";
import { Dialog, Box, Stepper, Step, StepLabel } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PropTypes } from "prop-types";
import { ErrorContext } from "../../contexts/ErrorContext";
import { ProjectUserContext } from "../../contexts/ProjectUserContext";
import Step1Content from "./Step1Content";
import Step2Content from "./Step2Content";
import Step3Content from "./Step3Content";

const steps = [
  'Welcome',
  'Add Project Details',
  'Add Collaborators',
];

function NewProjectModal({ open, setOpen }) {

  const [projectTitle, setProjectTitle] = useState("");
  const { setError, setSuccess } = useContext(ErrorContext);
  const [projectDescription, setProjectDescription] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [projId, setProjId] = useState(null);
  const [isProjectCreated, setIsProjectCreated] = useState(false);
  const isStep1Completed = activeStep >= 1;
  const isStep2Completed = activeStep >= 2 || isProjectCreated;
  React.useEffect(() => {
    if (open) {
      setActiveStep(0);
      setIsProjectCreated(false);
      setProjectTitle("");
      setProjectDescription("");
    }
  }, [open]);

  const { addNewProject } = useContext(ProjectUserContext);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleProjectTitle = (e) => {
    const newValue=e.target.value;
    if (newValue.length <= 100) {
      setProjectTitle(newValue);
    }
    else
    {
      setError("Project title cannot be more than 100 characters");
    }
  };

  const handleProjectDescription = (e) => {
    const newValue=e.target.value;
    if (newValue.length <= 250) {
      setProjectDescription(newValue);
    }
    else
    {
      setError("Project Description cannot be more than 500 characters");
    }
  };

  const handleAddNewProject = () => {
    console.log("handleAddNewProject", projectTitle, projectDescription);
    addNewProject(projectTitle, projectDescription)
      .then((response) => {
        setProjId(response.projectId);
        setSuccess("Project created successfully");
        setIsProjectCreated(true);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          display: "flex",
          justifyContent: "center",
          zIndex: "900"
        },
      }}
      sx={{ zIndex: "900",}}
      open={open}
    >
      <Box pr={3} mt={2} />
      <Box sx={{ display: "flex", justifyContent: "flex-end", cursor: "pointer" }} pr={3} mb={3}>
        <CloseIcon
          onClick={() => {
            setOpen(false);
          }}
        />
      </Box>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ marginRight: "13px" }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box my={2} mx={2}>
        {activeStep === 0 && <Step1Content onClick={handleNext}/>}
        {activeStep === 1 && isStep1Completed && <Step2Content projectTitle={projectTitle} handleProjectTitle={handleProjectTitle} projectDescription={projectDescription}
          handleProjectDescription={handleProjectDescription} handleAddNewProject={handleAddNewProject} isProjectCreated={isProjectCreated} onPrev={handleBack}
        />}
        {activeStep === 2 && isStep2Completed && <Step3Content projId={projId} projectTitle={projectTitle} setOpen={setOpen}/>}

      </Box>
    </Dialog>
  );
}

NewProjectModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default NewProjectModal;

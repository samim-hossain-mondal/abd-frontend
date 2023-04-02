/* eslint-disable react/no-array-index-key */

/* eslint-disable no-alert */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-undef */
import React, { useState, useContext } from "react";
import { Dialog, Box, Button,Stepper,Step,StepLabel} from "@mui/material";


import CloseIcon from "@mui/icons-material/Close";
import { PropTypes } from "prop-types";
import { ErrorContext } from "../../contexts/ErrorContext";
import { ProjectUserContext } from "../../contexts/ProjectUserContext";

import Step1Content from "./Step1Content";
import Step2Content from "./Step2Content";
import Step3Content from "./Step3Content";

const steps = [
  'Agree to Terms and Conditions',
  'Create a new project',
  'Add members to the project',
];


function NewProjectModal({ open, setOpen }) {

  const [projectTitle, setProjectTitle] = useState("");
  const { setError, setSuccess } = useContext(ErrorContext);
  const [projectDescription, setProjectDescription] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [projId, setProjId] = useState(null);
  const [isProjectCreated,setIsProjectCreated] = useState(false);
  const isStep1Completed = activeStep >= 1 || isChecked;
  const isStep2Completed = activeStep >= 2 || isProjectCreated;
  React.useEffect(() => {
    if (open) {
      setActiveStep(0);
      setIsChecked(false);
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
    setProjectTitle(e.target.value);
  };
  const handleProjectDescription = (e) => {
    setProjectDescription(e.target.value);
  };

  const handleAddNewProject = (title, projectDesc) => {
    addNewProject(title, projectDesc)
      .then((response) => {
        setProjId(response.projectId);
          setSuccess("Project created successfully");
          setIsProjectCreated(true);
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
        },
      }}
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Box pr={3} mt={2} />
      <Box sx={{ display: "flex", justifyContent: "flex-end", cursor:"pointer"}} pr={3} mb={3}>
        <CloseIcon
          onClick={() => {
            setOpen(false);
          }}
        />
      </Box>

      <Stepper activeStep={activeStep} alternativeLabel sx={{marginRight:"13px"}}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box my={2} mx={2}>
          {activeStep === 0 && <Step1Content isChecked={isChecked} setIsChecked={setIsChecked} />}
          {activeStep === 1 && isStep1Completed && <Step2Content projectTitle={projectTitle} handleProjectTitle={handleProjectTitle} projectDescription={projectDescription} 
          handleProjectDescription={handleProjectDescription} handleAddNewProject={handleAddNewProject}  isProjectCreated={isProjectCreated}
          />}
          {activeStep === 2  && isStep2Completed && <Step3Content projId={projId} projectTitle={projectTitle}/>}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between",flexWrap:"wrap",alignItems:"space-between"}} mx={4} my={2}>
          {activeStep > 0 && (
            <Button variant="contained" disabled={activeStep === 0} onClick={handleBack}>Back</Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" disabled={activeStep===0?!isStep1Completed:!isStep2Completed} onClick={handleNext}>Next</Button>
          ) : (
            <Button variant="contained" disabled={!isStep2Completed} onClick={()=>{
              setOpen(false);

            }}>Finish</Button>
          )}
        </Box>
    </Dialog>
  );
}

NewProjectModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default NewProjectModal;

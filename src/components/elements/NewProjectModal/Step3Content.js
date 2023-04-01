/* eslint-disable react/prop-types */
import React, { useState, useEffect,useRef,useContext} from "react";
import { Box, Button, Select, MenuItem, Typography, TextField,useMediaQuery} from "@mui/material";
// import { PropTypes } from "prop-types";
import axios from "axios";
import { ErrorContext } from "../../contexts/ErrorContext";
import DeleteDialog from "../DeleteDialog";


import { DOMAIN } from "../../../config";


function Step3Content({projId,projectTitle}) {
  const { setError, setSuccess } = useContext(ErrorContext);
  const above600 = useMediaQuery("(min-width:600px)");
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = React.useState(null);
    const Roles = ["ADMIN", "LEADER", "MEMBER"];
    const newMemberNameRef = useRef(null);
    
    const [members, setMembers] = useState([]);
    useEffect(() => {
      axios
        .get(`${DOMAIN}/api/management/project/${projId}`)
        .then((response) => {
          setSuccess("Project members Added");
          setMembers(response.data.projectMembers);
      })
        .catch((error) => {
          setError(error.response.data.message);
        });
  
    }, []);
      useEffect(() => {
        if (newMemberNameRef.current) {
          newMemberNameRef.current.focus();
        }
      }, [members]);

      const removeMember = (index) => {
        setSelectedCollaborator(index);
        setDeleteAlert(true);
      }

      const handleSaveMember = (index) => {
        axios
        .post(`${DOMAIN}/api/management/project/${projId}/member`, {
          email: members[index].email,
          role: members[index].role,
        }).then(() => {
         setMembers([...members.slice(0, index), {email: members[index].email,
          role: members[index].role,
          isNew: false,} ,...members.slice(index + 1)])
        })
        .catch((error) => {
          setError(error.response.data.message);
        });
      }
  
  
      const addMemberToProject = () => {
        setMembers([...members, { email: '', role: '',isNew: true}])
  
      }
  
      const handleEmailChange = (value, index) => {
        const newMembers = [...members];
        newMembers[index].email = value;
        setMembers(newMembers);
      }
  
      const handleRoleChange = (value, index) => {
        const newMembers = [...members];
        newMembers[index].role = value;
        setMembers(newMembers);
      }
      const handleDeleteMember = (index) => {
        if (members[index].isNew === true) {
          setMembers([...members.slice(0, index), ...members.slice(index + 1)]);
          return;
        }
        axios.delete(`${DOMAIN}/api/management/project/${projId}/member`, {
            data: {
              email: members[index].email,
            },
          }).then(() => {
            setMembers([...members.slice(0, index), ...members.slice(index + 1)]);
          })
          .catch((error) => {
            setError(error.response.data.message);
          });

        }

  
      return (
        <>
        <DeleteDialog
        open={deleteAlert}
        setOpen={setDeleteAlert}
        handleDelete={() => {
          handleDeleteMember(selectedCollaborator);
          setSelectedCollaborator(null);
          setDeleteAlert(false);
        }
        }
        description="Are you sure want to delete this project Member?"
      />
        <Box px={2}>
         <Typography variant="h5" mb={2}>
      Add members to the project{" "}
      <Box component="span" color="primary.main" fontWeight="bold">
        {projectTitle}
      </Box>
    </Typography>
          <Box  mb={1}>
          <Button variant="contained" 
          
          sx={{
            mt: 2,
            width: above600?"auto":"100%"
          }}

          onClick={addMemberToProject}>
            Add Member
          </Button>
          </Box>
          <Box maxHeight="290px" overflow="scroll">
          {members && members.map((member, index) => (
            <Box mt={4} mb={2} sx={{display:"flex", flexDirection:"column"}} id="CollabRow">
              <Box id="allPlaceholders"  sx={{justifyContent:"space-between",flexWrap:"wrap",display:"flex",width:"100%",height:"30px"}}>
            <TextField
             inputRef={newMemberNameRef}
            disableUnderline
            inputProps={{style: {padding:"4px 7px"}}}
              placeholder="xyz@gmail.com"
              value={member.email}
              sx={{ width: "50%", height: "100%"}}
              onChange={(event) => handleEmailChange(event.target.value, index)}
              disabled={!member.isNew}
            />
          
          <Select
  sx={{ height: "100%", width: "40%", padding: "0px 0px" }}
  disabled={!member.isNew}
  value={member.role || ""}
  onChange={(event) =>
    handleRoleChange(event.target.value, index)
  }
>
  <MenuItem value="" disabled>
    Select role
  </MenuItem>
  {Roles.map((role) => (
    <MenuItem value={role} key={role}>
      {role}
    </MenuItem>
  ))}
</Select>
                      </Box>
          <Box mt={1} id="icons" sx={{display:"flex", justifyContent:"space-between"}}>
                    {
                      member.isNew === true ? 
                      (
                    <><Button variant="outlined" color="primary"
                        onClick={() => {
                          handleSaveMember(index);
                        } }
                      >
                        Save
                      </Button>
                      <Button variant="outlined" color="error" size="small"
                        onClick={() => {
                          removeMember(index);
                        } }
                      >
                          Delete
                        </Button></>
                      
                     ) : (
                    <>  <Button variant="contained" size="small" disabled >
                        Saved
                      </Button>
                      <Button variant="contained" color="error" size="small" disabled={member.role==="ADMIN"}
                        onClick={() => {
                          removeMember(index);
                        } }
                      >
                          Delete
                        </Button>
                        </>
                     )
                    }
          </Box>
          </Box>
          ))}
          </Box>
        </Box>
        </>
      );
    }
export default Step3Content;
  
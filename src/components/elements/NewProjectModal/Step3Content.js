/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, Box, Button, Select, MenuItem, Typography, TextField, useMediaQuery, Tooltip,
  Avatar,Divider
} from "@mui/material";
import PersonAdd from "@mui/icons-material/PersonAdd";
import axios from "axios";
import { ErrorContext } from "../../contexts/ErrorContext";
import DeleteDialog from "../DeleteDialog";
import { DOMAIN } from "../../../config";

function Step3Content({ projId, projectTitle, setOpen}) {
  const { setError } = useContext(ErrorContext);
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
     const extractedMembers = response.data.projectMembers.map((member) => ({
          email: member.email,
          role: member.role,
          isNew: false,
        }));
        setMembers(extractedMembers);
      })
      .catch((error) => {
        setError(error.response.data.message);
      });

  }, []);
  useEffect(() => {
    if (newMemberNameRef.current) {
      newMemberNameRef.current.focus();
    }
  }, [members.length]);

  const renderColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "red";
      case "LEADER":
        return "info.main";
      case "MEMBER":
        return "success.main";
      default:
        return "grey";
    }
  };

  const emailInitals = (email) =>
  email
    .split("@")[0]
    .split("_")
    .map((n) => n.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
        setMembers([...members.slice(0, index), {
          email: members[index].email,
          role: members[index].role,
        }, ...members.slice(index + 1)])
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
  }


  const addMemberToProject = () => {
    const checkNewCollab = members.find(
      (member) => member.isNew
    );
    if (checkNewCollab) {
      setError("Please save new collaborators before adding more");
      return;
    }

    setMembers([...members, { email: '', role: '', isNew: true }])

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
      <Box  px={2} sx={{width:above600?"500px":"auto"}}>
        <Typography variant="h5">
          Congratulation on creating an agile portal for your {" "}
          <Box component="span" color="primary.main" fontWeight="bold">
            {projectTitle}
          </Box>
          {" "}team!
          <Box mb={4}>
            <Typography variant="h6">
              Your Project Link
            </Typography>
            <Typography variant="h6" mb={2}>
              <Box sx={{ color: 'black', display: 'inline' }} > Project Link:{" "} </Box>
              <Link href={`/${projId}/daily`}>
                https://{window.location.hostname}/{projId}/daily
              </Link>
            </Typography>
          </Box>
        </Typography>
        <Divider />
        <Box mt={1} sx={{display:"flex", justifyContent:"space-between", width:"auto"}}>
        <Typography variant="h5">Collaborators</Typography>
          <Tooltip title="Add Members">
            <PersonAdd mr={0}
              sx={{ 
              }}
              onClick={addMemberToProject} />
          </Tooltip>
        </Box>
        <Box maxHeight="290px" overflow="scroll">
          {members && members.map((member, index) => (
            <Box mt={2} mb={2} sx={{ display: "flex", flexDirection: "column",padding:"4px"}} id="CollabRow">
              <Box id="allPlaceholders" sx={{ justifyContent: "space-between", display: "flex", width: "100%"}}>
                    <Avatar
                      sx={{
                        backgroundColor: renderColor(member.role),
                        color: "#fff",
                    
                      }}
                    >
                      {emailInitals(member.email)}
                    </Avatar>

                <TextField
                  inputRef={newMemberNameRef} 
                  inputProps={{ style: { padding: "4px 7px" } }}
                  placeholder="xyz@gmail.com"
                  value={member.email}
                  sx={{ width: "50%", height: "100%" }}
                  onChange={(event) => handleEmailChange(event.target.value, index)}
                  disabled={!member.isNew}
                />

                <Select
                  sx={{ height: "30px", width: "30%", padding: "0px 0px" }}
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
              <Box mt={1} id="icons" sx={{ display: "flex", justifyContent: !member.isNew ? "flex-end" : "space-between" }}>
                {
                  member.isNew === true ?
                    (
                      <>
                      <Button sx={{visibility:"hidden"}}variant="outlined" color="error" size="small"
                          onClick={() => {
                            removeMember(index);
                          }}
                        >
                          Delete
                        </Button>
                      <Button variant="outlined" color="success"
                        onClick={() => {
                          handleSaveMember(index);
                        }}
                      >
                        Save
                      </Button>
                        
</>
                    ) : (
                      <Button variant="contained" color="error" size="small" disabled={member.role === "ADMIN"}
                          onClick={() => {
                            removeMember(index);
                          }}
                        >
                          Delete
                        </Button>
                    )
                }
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }} mt={1}>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(false);
          }}
        >
          Finish
        </Button>
        </Box>
      </Box >
    </>
  );
}
export default Step3Content;

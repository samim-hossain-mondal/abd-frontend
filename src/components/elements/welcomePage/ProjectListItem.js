import React, { useState } from "react";
import { Box, Collapse, IconButton } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import propTypes from "prop-types";

function ProjectListItem({ project, handleProjectClick }) {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <Box
      key={project.projectId}
      component="card"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        textAlign: "start",
        borderBottom: "1px solid white",
      }}
      onClick={() => handleProjectClick(project.projectId)}
    >
      <Box
        component="p"
        sx={{
          fontSize: 15,
          width: "100%",
          padding: 1,
          margin: 0,
          backgroundColor: "#4B93FC",
          color: "white",
          fontWeight: 800,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {project.projectName}
        <IconButton onClick={(e) => {
            e.stopPropagation();
            setShowDescription(!showDescription)
            }
        }>
          {showDescription ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      <Collapse in={showDescription} timeout="auto" unmountOnExit>
        <Box
          component="p"
          sx={{
            fontSize: 15,
            color: "text.primary",
            width: "100%",
            px: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {project.projectDescription}
        </Box>
      </Collapse>
    </Box>
  );
}

ProjectListItem.propTypes = {
  project: propTypes.shape({
    projectId: propTypes.number.isRequired,
    projectName: propTypes.string.isRequired,
    projectDescription: propTypes.string.isRequired,
  }).isRequired,
  handleProjectClick: propTypes.func.isRequired,
};

export default ProjectListItem;

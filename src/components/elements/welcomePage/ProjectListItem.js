import React, { useState } from "react";
import { Box, Collapse, IconButton, Tooltip } from "@mui/material";
import { ExpandLess, ExpandMore, ArrowCircleRight } from "@mui/icons-material";
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
        alignItems: "flex-start",
        backgroundColor: "white",
        textAlign: "start",
        borderBottom: "1px solid #e0e0e0",
      }}
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
        <Box>
          <Tooltip
            title={showDescription ? "Hide Description" : "Show Description"}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setShowDescription(!showDescription);
              }}
            >
              {showDescription ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Go to project dashboard">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleProjectClick(project.projectId);
              }}
            >
              <ArrowCircleRight backgroundColor='white'/>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Collapse in={showDescription} timeout="auto" unmountOnExit>
        <Box
          component="p"
          paddingX={1}
          sx={{
            fontSize: 15,
            color: "text.primary",
            width: "100%",
            px: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            WebkitAlignContent: "start",
            textAlign: "start",
            overflow: "hidden",
            textOverflow: "ellipsis",
            wordBreak: "break-word",
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

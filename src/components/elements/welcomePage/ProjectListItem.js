import React, { useState } from "react";
import {
  // Box,
  // Collapse,
  // IconButton,
  // Tooltip,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  useMediaQuery
} from "@mui/material";
import { ExpandMore, OpenInNew } from "@mui/icons-material";
import propTypes from "prop-types";

function ProjectListItem({ project, handleProjectClick }) {
  const isLargeScreen = useMediaQuery("(min-width: 600px)");
  const [showDescription, setShowDescription] = useState(false);
  const [showSummary, setShowSummary] = useState(true);

  return (
    <Accordion
      expanded={showDescription}
      onChange={(e) => {
        e.stopPropagation();
        setShowSummary(!showSummary);
        setShowDescription(!showDescription);
      }}
      TransitionProps={{ unmountOnExit: true }}
      sx = {{
        backgroundColor: "white",
        "&:hover": {
          backgroundColor: "grey.200",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography 
          sx={{ 
            width: isLargeScreen? '25%' : '20%',
            flexShrink: 0,
            flexGrow: isLargeScreen && showSummary ? 0 : 1,
            marginRight: 5,
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
          {project.projectName}
        </Typography>
        {isLargeScreen && showSummary ? (
        <Typography 
          sx={{ 
            flexGrow: 1,
            color: "text.secondary",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            WebkitAlignContent: "start",
            textAlign: "start",
            overflow: "hidden",
            textOverflow: "ellipsis",
            wordBreak: "break-word",
            marginRight: 5
            }}
        >
          {project.projectDescription}
        </Typography>
        ) : null}
        <IconButton
          sx={{ 
            justifyContent: "flex-end" 
          }}
        >
          <OpenInNew 
            onClick={(e) => {
              e.stopPropagation();
              handleProjectClick(project.projectId);
            }}
          />
        </IconButton>
      </AccordionSummary>
      <AccordionDetails sx={{ borderTop: "3px solid #e0e0e0" }}>
        <Typography>{project.projectDescription}</Typography>
      </AccordionDetails>
    </Accordion>

    // <Box
    //   key={project.projectId}
    //   component="card"
    //   sx={{
    //     display: "flex",
    //     flexDirection: "column",
    //     width: "100%",
    //     justifyContent: "space-between",
    //     alignItems: "flex-start",
    //     backgroundColor: "white",
    //     textAlign: "start",
    //     borderBottom: "1px solid #e0e0e0",
    //   }}
    // >
    //   <Box
    //     component="p"
    //     sx={{
    //       fontSize: 15,
    //       width: "100%",
    //       padding: 1,
    //       margin: 0,
    //       backgroundColor: "white",
    //       fontWeight: 200,
    //       display: "flex",
    //       justifyContent: "space-between",
    //       alignItems: "center",
    //     }}
    //   >
    //     <Box sx={{ display: "flex", flexDirection: "column"}}>
    //       <Box>{project.projectName}</Box>
    //       <Box sx={{ fontSize: 12, color: 'grey.800' }}>{[project._count.projectMembers, ' members']}</Box>
    //     </Box>
    //     <Box>
    //       <Tooltip
    //         title={showDescription ? "Hide Description" : "Show Description"}
    //       >
    //         <IconButton
    //           onClick={(e) => {
    //             e.stopPropagation();
    //             setShowDescription(!showDescription);
    //           }}
    //         >
    //           {showDescription ? <ExpandLess sx={{color: 'logoBlue.main'}}/> : <ExpandMore sx={{color: 'logoBlue.main'}}/>}
    //         </IconButton>
    //       </Tooltip>
    //       <Tooltip title="Go to project dashboard">
    //         <IconButton
    //           onClick={(e) => {
    //             e.stopPropagation();
    //             handleProjectClick(project.projectId);
    //           }}
    //         >
    //           <ArrowCircleRight sx={{color: 'logoBlue.main'}}/>
    //         </IconButton>
    //       </Tooltip>
    //     </Box>
    //   </Box>
    //   <Collapse in={showDescription} timeout="auto" unmountOnExit>
    //     <Box
    //       component="p"
    //       paddingX={1}
    //       sx={{
    //         fontSize: 15,
    //         color: "text.primary",
    //         width: "100%",
    //         px: 1,
    //         display: "-webkit-box",
    //         WebkitLineClamp: 2,
    //         WebkitBoxOrient: "vertical",
    //         WebkitAlignContent: "start",
    //         textAlign: "start",
    //         overflow: "hidden",
    //         textOverflow: "ellipsis",
    //         wordBreak: "break-word",
    //       }}
    //     >
    //       {project.projectDescription}
    //     </Box>
    //   </Collapse>
    // </Box>
  );
}

ProjectListItem.propTypes = {
  project: propTypes.shape({
    projectId: propTypes.number.isRequired,
    projectName: propTypes.string.isRequired,
    projectDescription: propTypes.string.isRequired,
    _count: propTypes.shape({
      projectMembers: propTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  handleProjectClick: propTypes.func.isRequired,
};

export default ProjectListItem;

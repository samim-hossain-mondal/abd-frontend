import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Pagination,
  Typography,
  Button,
  CardActions,
  useMediaQuery,
  IconButton,
  Chip
} from "@mui/material";
import propTypes from "prop-types";
import { OpenInNew } from "@mui/icons-material";

function ProjectCard({ project, handleProjectClick }) {
  const isLargeScreen = useMediaQuery("(min-width: 800px)");
  return (
    <Card
      sx={{
        minWidth: isLargeScreen ? 275 : 200,
      }}
    >
      <CardContent>
        <Typography 
        sx={{ 
            fontSize: isLargeScreen ? 14 : 12,
        }} 
        color="text.secondary" gutterBottom>
          {/* TODO: this is just a dummy implementation */}
          <Chip 
            label='IN PROGRESS' 
            size='small' 
            variant='outlined' 
            color="success"
          />
        </Typography>
        <Typography 
            variant="h5" 
            component="div"
            sx={{
                fontSize: isLargeScreen ? 20 : 16,
                textAlign: "start",
                overflow: "hidden",
                textOverflow: "ellipsis",
                wordBreak: "break-word",
            }}
        >
          {project.projectName}
        </Typography>
        <Typography 
        sx={{ 
            mb: 1.5,
            fontSize: isLargeScreen ? 14 : 12,
        }} 
        color="text.secondary">
          adjective
        </Typography>
        <Typography
          variant="body2"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            WebkitAlignContent: "start",
            textAlign: "start",
            overflow: "hidden",
            textOverflow: "ellipsis",
            wordBreak: "break-word",
          }}
        >
          {project.projectDescription}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: 1,
            flexShrink: 0,
        }}
      >
        <Button
            sx = {{
                fontSize: isLargeScreen ? 14 : 12,
                padding: 1,
                justifyContent: "flex-start",
                width: isLargeScreen ? 8 : 6,
            }}
        >
            VIEW
            </Button>
        <IconButton size="small"
            sx = {{
                padding: 1
            }}
        >
          <OpenInNew
            onClick={(e) => {
              e.stopPropagation();
              handleProjectClick(project.projectId);
            }}
          />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default function PaginatedCards({ projects, handleProjectClick }) {
  const isLargeScreen = useMediaQuery("(min-width: 800px)");
  const [page, setPage] = useState(1);
  const pageSize = isLargeScreen ? 6 : 3;

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const visibleProjects = projects.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <Grid container spacing={2}>
        {visibleProjects.map((project) => (
          <Grid item xs={12} md={4} key={project.projectId}>
            <ProjectCard
              project={project}
              handleProjectClick={handleProjectClick}
            />
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={Math.ceil(projects.length / pageSize)}
        page={page}
        onChange={handlePageChange}
        sx = {{
            display: "flex",
            justifyContent: "center",
            marginTop: 2,
        }}
      />
    </>
  );
}

ProjectCard.propTypes = {
  project: propTypes.shape({
    projectId: propTypes.number,
    projectName: propTypes.string,
    projectDescription: propTypes.string,
  }),
  handleProjectClick: propTypes.func.isRequired,
};

PaginatedCards.propTypes = {
  projects: propTypes.arrayOf(
    propTypes.shape({
      projectId: propTypes.number,
      projectName: propTypes.string,
      projectDescription: propTypes.string,
    })
  ),
  handleProjectClick: propTypes.func.isRequired,
};

ProjectCard.defaultProps = {
  project: {},
};

PaginatedCards.defaultProps = {
  projects: [],
};

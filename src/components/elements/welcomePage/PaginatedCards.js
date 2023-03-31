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
  Chip,
  Box,
  Tooltip,
} from "@mui/material";
import propTypes from "prop-types";
import { OpenInNew, Person } from "@mui/icons-material";

function ProjectCard({ project, handleProjectClick }) {
  const isLargeScreen = useMediaQuery("(min-width: 800px)");
  return (
    <Card
      sx={{
        minWidth: isLargeScreen ? 275 : 200,
      }}
    >
      <CardContent>
        <Box
          sx={{
            // fontSize: isLargeScreen ? 14 : 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 1,
          }}
          color="text.secondary"
          gutterBottom
        >
          {/* TODO: this is just a dummy implementation */}
          {project.projectId % 2 === 0 ? (
          <Chip
            label="IN PROGRESS"
            size="small"
            variant="outlined"
            color="primary"
          />) : (
          <Chip
            label="COMPLETED"
            size="small"
            variant="outlined"
            color="success"
          />
          )}
          <Tooltip title="Number of members">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Person />
              <Typography sx={{ fontSize: 13.5, marginLeft: 1 }}>
                {project._count.projectMembers}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
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
            fontSize: isLargeScreen ? 14 : 12,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            WebkitAlignContent: "start",
            textAlign: "start",
            overflow: "hidden",
            textOverflow: "ellipsis",
            wordBreak: "break-word",
          }}
          color="text.secondary"
        >
          {project.projectDescription}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: 1,
          paddingTop: 0,
          flexShrink: 0,
        }}
      >
        <Button
          sx={{
            fontSize: isLargeScreen ? 14 : 12,
            padding: 1,
            justifyContent: "flex-start",
            width: isLargeScreen ? 8 : 6,
            color: "logoBlue.main",
          }}
        >
          VIEW
        </Button>
        <IconButton
          size="small"
          sx={{
            padding: 1,
            color: "logoBlue.main"
          }}
        >
          <Tooltip title="Open project dashboard">
            <OpenInNew
              onClick={(e) => {
                e.stopPropagation();
                handleProjectClick(project.projectId);
              }}
            />
          </Tooltip>
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default function PaginatedCards({ projects, handleProjectClick }) {
  const isLargeScreen = useMediaQuery("(min-width: 800px)");
  const [page, setPage] = useState(1);
  const pageSize = isLargeScreen ? 9 : 3;

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
        size={isLargeScreen ? "large" : "small"}
        siblingCount={0}
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 2,
          "& .MuiPaginationItem-root": {
            fontSize: isLargeScreen ? 14 : 12,
            maxWidth: isLargeScreen ? "unset" : "12px",
          },
          "& .Mui-selected": {
            backgroundColor: "logoBlue.main",
            color: "white",
          },
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
    _count: propTypes.shape({
      projectMembers: propTypes.number,
    }),
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

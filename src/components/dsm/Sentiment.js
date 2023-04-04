import React, { useState, useContext, useEffect } from 'react';
import SentimentVerySatisfiedOutlinedIcon from '@mui/icons-material/SentimentVerySatisfiedOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined';
import SentimentVeryDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentVeryDissatisfiedOutlined';
import SentimentVerySatisfiedTwoToneIcon from '@mui/icons-material/SentimentVerySatisfiedTwoTone';
import SentimentSatisfiedTwoToneIcon from '@mui/icons-material/SentimentSatisfiedTwoTone';
import SentimentDissatisfiedTwoToneIcon from '@mui/icons-material/SentimentDissatisfiedTwoTone';
import SentimentVeryDissatisfiedTwoToneIcon from '@mui/icons-material/SentimentVeryDissatisfiedTwoTone';
import {
  IconButton,
  Box,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  useMediaQuery,
  Tooltip,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams } from 'react-router-dom';
import { CREATE_SENTIMENT, GET_TODAY_SENTIMENT_OF_MEMBER, UPDATE_SENTIMENT } from '../constants/apiEndpoints';
import InformationModel from '../elements/InformationModel';
import { DSMBodyLayoutContext } from "../contexts/DSMBodyLayoutContext";
import SentimentMeterDialog from './SentimentMeterDialog';
import { SentimentMeterInfo } from '../constants/SentimentMeter';
import { RefreshContext } from '../contexts/RefreshContext';
import makeRequest from '../utilityFunctions/makeRequest/index';
import { ErrorContext } from '../contexts/ErrorContext';
import { SUCCESS_MESSAGE } from "../constants/dsm/index"
import { GENERIC_NAME, HEADING } from '../constants/dsm/Sentiments';
import { ProjectUserContext } from '../contexts/ProjectUserContext';
import { isAdmin, isLeader, isMember } from '../constants/users';
import { LoadingContext } from '../contexts/LoadingContext';

export default function Sentiment() {
  const breakpoint1080 = useMediaQuery('(min-width:1080px)');
  const breakpoint500 = useMediaQuery('(min-width:500px)');
  const breakpoint391 = useMediaQuery('(min-width:391px)');
  const { setError, setSuccess } = useContext(ErrorContext)
  const [sentimentResponse, setSentimentResponse] = useState(undefined);
  const [sentimentObj, setSentimentObj] = useState({})
  const { projectId } = useParams()
  const { setLoading } = useContext(LoadingContext);

  const { userRole } = useContext(ProjectUserContext);
  const isLeaderOrAdmin = () => (isAdmin(userRole) || isLeader(userRole))

  const createSentiment = async (sentiment) => {
    const reqBody = {
      sentiment
    }
    const resData = await makeRequest(CREATE_SENTIMENT(projectId), setLoading, { data: reqBody })
    setSentimentResponse(sentiment);
    setSuccess(SUCCESS_MESSAGE(GENERIC_NAME).UPDATED)
    return resData;
  }

  const updateSentiment = async (sentiment) => {
    const reqBody = {
      sentiment
    }
    const resData = await makeRequest(UPDATE_SENTIMENT(projectId, sentimentObj.sentimentId), setLoading, { data: reqBody })
    setSentimentResponse(sentiment);
    setSuccess(SUCCESS_MESSAGE(GENERIC_NAME).UPDATED)
    return resData;
  }

  const getTodaySentimentOfMember = async () => {
    try {
      if (!isMember(userRole)) return {};
      const resData = await makeRequest(GET_TODAY_SENTIMENT_OF_MEMBER(projectId), setLoading);
      return resData;
    }
    catch (err) {
      setError(err.message);
      return null;
    }
  }

  const handleOnClickResponse = async (response) => {
    try {
      if (!sentimentObj.sentimentId) {
        const newSentiment = await createSentiment(response);
        setSentimentObj(newSentiment);
      }
      else {
        const updatedSentiment = await updateSentiment(response === sentimentResponse ? "NULL" : response);
        setSentimentObj(updatedSentiment)
      }
      if (response === sentimentResponse) setSentimentResponse(undefined);
      else setSentimentResponse(response);
    }
    catch (err) {
      setError(err.message);
    }
  }

  // feeling name is treated as ID, hence it should be different for each feeling
  const feelings = [
    {
      name: 'HAPPY',
      icon: <SentimentVerySatisfiedOutlinedIcon sx={{ fontSize: breakpoint391 ? 50 : 30 }} />,
      iconSelected: <SentimentVerySatisfiedTwoToneIcon sx={{ fontSize: breakpoint391 ? 60 : 40 }} />,
      color: 'emoji.happy'
    },
    {
      name: 'GOOD',
      icon: <SentimentSatisfiedOutlinedIcon sx={{ fontSize: breakpoint391 ? 50 : 30 }} />,
      iconSelected: <SentimentSatisfiedTwoToneIcon sx={{ fontSize: breakpoint391 ? 60 : 40 }} />,
      color: 'emoji.good'
    },
    {
      name: 'OK',
      icon: <SentimentDissatisfiedOutlinedIcon sx={{ fontSize: breakpoint391 ? 50 : 30 }} />,
      iconSelected: <SentimentDissatisfiedTwoToneIcon sx={{ fontSize: breakpoint391 ? 60 : 40 }} />,
      color: 'emoji.ok'
    },
    {
      name: 'BAD',
      icon: <SentimentVeryDissatisfiedOutlinedIcon sx={{ fontSize: breakpoint391 ? 50 : 30 }} />,
      iconSelected: <SentimentVeryDissatisfiedTwoToneIcon sx={{ fontSize: breakpoint391 ? 60 : 40 }} />,
      color: 'emoji.bad'
    }
  ]

  const { gridHeightState, dispatchGridHeight } = useContext(DSMBodyLayoutContext);
  const { refresh, setRefresh } = useContext(RefreshContext);
  const handleExpandSentiment = () => {
    dispatchGridHeight({ type: "SENTIMENT", userRole })
  };
  const [open, setOpen] = useState(false);

  const handleDialog = () => {
    setOpen(true);
  };

  useEffect(() => {
    getTodaySentimentOfMember().then(todaySentiment => {
      if (todaySentiment !== null) {
        setSentimentResponse(todaySentiment.sentiment)
        setSentimentObj(todaySentiment)
      }
    })
  }, [])

  if (refresh.sentiment) {
    setRefresh(val => ({ ...val, sentiment: false }));
    getTodaySentimentOfMember().then(todaySentiment => {
      if (todaySentiment !== null) {
        setSentimentResponse(todaySentiment.sentiment)
        setSentimentObj(todaySentiment)
      }
    })
  }

  return (
    <Grid item
      sx={{
        marginBottom: "10px", paddingBottom: "10px",
        ...(gridHeightState.sentiment.expanded && { paddingBottom: "15px" }),
        display: "flex", flexDirection: "row", justifyContent: "space-between"
      }} height={gridHeightState.sentiment.height} >
      <Grid item xs={breakpoint1080 && gridHeightState.celebration.fullExpanded ? 8 : 12}>
        <Accordion
          expanded={userRole && isMember(userRole) && gridHeightState.sentiment.expanded}
          onChange={handleExpandSentiment}
          sx={{
            height: gridHeightState.sentiment.expanded ? "100%" : "auto",
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', height: '8vh' }}>
            {userRole && isLeaderOrAdmin() &&
              <SentimentMeterDialog
                open={open} setOpen={setOpen} isLeaderOrAdmin={isLeaderOrAdmin}
              />
            }
            <AccordionSummary
              expandIcon={userRole && isMember(userRole) ? <Tooltip title={(gridHeightState.sentiment.expanded) ? 'Collapse' : 'Expand'} placement='top'><ExpandMoreIcon /></Tooltip> : null}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                flexGrow: 1,
                ...(userRole && isLeaderOrAdmin() && { paddingRight: "0px" }),
                ...(userRole && isMember(userRole) && { paddingLeft: breakpoint391 ? "none" : "5px" })
              }}
            >
              {!userRole || isLeaderOrAdmin() ?
                (<Typography variant="dsmSubMain" fontSize='1.25rem'
                  sx={{ textTransform: 'none', gap: breakpoint391 ? '4px' : "2px" }}>{HEADING}
                </Typography>) :
                (<Typography onClick={() => { }} variant="dsmMain"
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: breakpoint391 ? '4px' : "2px" }}
                  fontSize={breakpoint500 ? "1.65rem" : "1.25rem"} paddingLeft="6%" textTransform='none'
                  width="100%" >
                  How are you feeling today?
                  <InformationModel
                    heading={SentimentMeterInfo.heading}
                    definition={SentimentMeterInfo.definition}
                    accessibiltyInformation={SentimentMeterInfo.accessibilityInformation} />
                </Typography>)
              }
            </AccordionSummary>
            {userRole && isLeaderOrAdmin() &&
              <Button variant="contained" onClick={handleDialog}
                sx={{
                  fontSize: "0.85rem",
                  ...(!breakpoint500 && { fontSize: "0.65rem", width: "28%" }),
                  marginRight: "16px",
                  textTransform: "capitalize",
                  borderRadius: "8px",
                }}>
                See Results
              </Button>
            }
          </Box>
          {userRole && isMember(userRole) &&
            <AccordionDetails sx={{ p: 0 }}>
              <Grid container direction="row" sx={{ display: "flex", justifyContent: "center", height: "8vh" }}>
                {feelings.map((feeling) => (
                  <Grid key={feeling.name} item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Tooltip title={feeling.name} placement='top'>
                      <IconButton onClick={() => handleOnClickResponse(feeling.name)} sx={{ borderRadius: 100, p: 0, color: feeling.color, display: 'flex', justifyContent: 'center' }} >
                        {feeling.name === sentimentResponse ?
                          feeling.iconSelected :
                          feeling.icon
                        }
                      </IconButton>
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          }
        </Accordion>
      </Grid>
      {
        breakpoint1080 && gridHeightState.celebration.fullExpanded && (
          <Grid item xs={1.7}>
            <Accordion expanded={false} onChange={handleExpandSentiment} sx={{
              height: gridHeightState.sentiment.expanded ? "100%" : "none",
              padding: "6px",
            }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography fontSize="1rem" variant='dsmSubMain'>Requests</Typography>
              </AccordionSummary>
            </Accordion>
          </Grid>
        )
      }
      {
        breakpoint1080 && gridHeightState.celebration.fullExpanded && (
          <Grid item xs={2} height="auto">
            <Accordion expanded={false} onChange={handleExpandSentiment} sx={{
              height: gridHeightState.sentiment.expanded ? "100%" : "none",
              padding: "6px",
            }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography fontSize="1rem" variant='dsmSubMain'>Announcements</Typography>
              </AccordionSummary>
            </Accordion>
          </Grid>
        )
      }
    </Grid >
  );
};
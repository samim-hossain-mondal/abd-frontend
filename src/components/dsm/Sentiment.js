import React, { useState, useContext, useEffect } from 'react';
import SentimentVerySatisfiedOutlinedIcon from '@mui/icons-material/SentimentVerySatisfiedOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined';
import SentimentVeryDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentVeryDissatisfiedOutlined';
import SentimentVerySatisfiedTwoToneIcon from '@mui/icons-material/SentimentVerySatisfiedTwoTone';
import SentimentSatisfiedTwoToneIcon from '@mui/icons-material/SentimentSatisfiedTwoTone';
import SentimentDissatisfiedTwoToneIcon from '@mui/icons-material/SentimentDissatisfiedTwoTone';
import SentimentVeryDissatisfiedTwoToneIcon from '@mui/icons-material/SentimentVeryDissatisfiedTwoTone';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  IconButton,
  Box,
  Menu,
  MenuItem,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  useMediaQuery
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CSVLink } from "react-csv";
import { useParams } from 'react-router-dom';
import getDBOffSetTime from "../utilityFunctions/getOffsetTimestamp";
import { CREATE_SENTIMENT, GET_SENTIMENTS_BY_DATE, GET_TODAY_SENTIMENT_OF_MEMBER, UPDATE_SENTIMENT } from '../constants/apiEndpoints';
import InformationModel from '../elements/InformationModel';
import { DSMBodyLayoutContext } from "../contexts/DSMBodyLayoutContext";
import SentimentMeterDialog from './SentimentMeterDialog';
import { SentimentMeterInfo } from '../constants/SentimentMeter';
import { RefreshContext } from '../contexts/RefreshContext';
import makeRequest from '../utilityFunctions/makeRequest/index';
import { ErrorContext } from '../contexts/ErrorContext';
import { SUCCESS_MESSAGE } from "../constants/dsm/index"
import { GENERIC_NAME } from '../constants/dsm/Sentiments';
import getTodayDate from '../utilityFunctions/getTodayDate';
import { ProjectUserContext } from '../contexts/ProjectUserContext';

export default function Sentiment() {
  const breakpoint1080 = useMediaQuery('(min-width:1080px)');
  const breakpoint500 = useMediaQuery('(min-width:500px)');
  const breakpoint391 = useMediaQuery('(min-width:391px)');
  const { setError, setSuccess } = useContext(ErrorContext)
  const [sentimentResponse, setSentimentResponse] = useState(undefined);
  const [sentimentObj, setSentimentObj] = useState({})
  const { projectId } = useParams()

  const { userRole } = useContext(ProjectUserContext);
  const isLeaderOrAdmin = () => (userRole === "ADMIN" || userRole === "LEADER")
  // const isLeaderOrAdmin = () => false;

  const [weekStats, setWeekStats] = useState([])
  const [todayStats, setTodayStats] = useState([])

  const createSentiment = async (sentiment) => {
    const reqBody = {
      sentiment
    }
    const resData = await makeRequest(CREATE_SENTIMENT(projectId), { data: reqBody })
    setSentimentResponse(sentiment);
    setSuccess(SUCCESS_MESSAGE(GENERIC_NAME).UPDATED)
    return resData;
  }

  const updateSentiment = async (sentiment) => {
    const reqBody = {
      sentiment
    }
    const resData = await makeRequest(UPDATE_SENTIMENT(projectId, sentimentObj.sentimentId), { data: reqBody })
    setSentimentResponse(sentiment);
    setSuccess(SUCCESS_MESSAGE(GENERIC_NAME).UPDATED)
    return resData;
  }

  const getSentiments = async (date) => {
    try {
      const resData = await makeRequest(GET_SENTIMENTS_BY_DATE(projectId, date));
      return resData;
    }
    catch (err) {
      setError(err.message);
      return [];
    }
  }

  const getTodaySentimentOfMember = async () => {
    try {
      const resData = await makeRequest(GET_TODAY_SENTIMENT_OF_MEMBER(projectId));
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
    dispatchGridHeight({ type: "SENTIMENT" })
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const openMenu = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDialog = () => {
    setOpen(true);
    setAnchorEl(null);
  };

  const [sentimeterData, setSentimeterData] = useState([]);

  const getSentimeterStats = async (queryDate) => {
    try {
      if (isLeaderOrAdmin()) {
        const resData = await getSentiments(queryDate);
        return resData;
      }
      return [];
    }
    catch (err) {
      setError(err.message);
      return [];
    }
  }

  useEffect(() => {
    getTodaySentimentOfMember().then(todaySentiment => {
      if (todaySentiment !== null) {
        setSentimentResponse(todaySentiment.sentiment)
        setSentimentObj(todaySentiment)
      }
    })
  }, [])

  useEffect(() => {
    const queryDate = getTodayDate();
    getSentimeterStats(queryDate).then(stats => {
      setSentimeterData(stats)
    })
  }, [sentimentResponse, userRole])

  if (refresh.sentiment) {
    const queryDate = getTodayDate();
    getSentimeterStats(queryDate).then(stats => {
      setSentimeterData(stats)
    })
    getTodaySentimentOfMember().then(todaySentiment => {
      if (todaySentiment !== null) {
        setSentimentResponse(todaySentiment.sentiment)
        setSentimentObj(todaySentiment)
      }
    })
    setRefresh(val => ({ ...val, sentiment: false }));
  }

  const feelingsArray = ["HAPPY", "GOOD", "OK", "BAD"]

  const formatedDataByLabels = (groupData) => {
    if (groupData) {
      const formatedData = [];
      groupData.forEach((item) => {
        formatedData[item.sentiment] = item.count;
      });
      return formatedData;
    }
    return [];
  }

  const calcSentimentCountWeekAvg = (dataArray, dayDiff) => {
    const noOfDays = (dayDiff + 1) > 5 ? 5 : (dayDiff + 1);
    const formatedData = formatedDataByLabels(dataArray);
    return feelingsArray.map((item) => {
      if (!formatedData[item]) return 0;
      return formatedData[item] / noOfDays;
    })
  }

  const calcSentimentCountToday = (dataArray) => {
    const formatedData = formatedDataByLabels(dataArray);
    return feelingsArray.map((item) => {
      if (!formatedData[item]) return 0;
      return formatedData[item];
    })
  }

  useEffect(() => {
    if (isLeaderOrAdmin()) {
      setWeekStats(calcSentimentCountWeekAvg(sentimeterData.thisWeek?.data, sentimeterData.thisWeek?.dayDifference))
      setTodayStats(calcSentimentCountToday(sentimeterData.today?.data))
    }
  }, [sentimeterData])

  const getCSVHeaders = () => {
    const headers = [{ label: "", key: "name" }, { label: "Date", key: "date" }]
    feelings.forEach(emoji => {
      headers.push({ label: emoji.name, key: emoji.name })
    })
    headers.push({ label: "Total Responses", key: "totalCount" })
    return headers;
  }

  const getOffSetTimeDate = (date, offSetTime) => {
    if (date) return new Date(new Date(date).getTime() + offSetTime).toISOString().split('T')[0]
    return null;
  }

  const createCSVReportData = () => {
    const todayDateString = getTodayDate();
    const offSetTime = getDBOffSetTime(todayDateString);
    const todayRow = { name: "Today", date: `${getOffSetTimeDate(sentimeterData.thisWeek?.firstDay, offSetTime)}` }
    const weekRow = {
      name: "This Week",
      date:
        `(${getOffSetTimeDate(sentimeterData.thisWeek?.firstDay, offSetTime)}) - (${getOffSetTimeDate(sentimeterData.thisWeek?.lastDay, offSetTime)})`
    }
    todayStats.forEach((item, index) => {
      todayRow[feelings[index].name] = item;
      weekRow[feelings[index].name] = weekStats[index];
    })
    todayRow.totalCount = todayStats.reduce((a, b) => a + b, 0);
    weekRow.totalCount = weekStats.reduce((a, b) => a + b, 0);
    return [todayRow, weekRow];
  }

  const csvReport = {
    data: createCSVReportData(),
    headers: getCSVHeaders(),
    filename: `SentimentMeter-${new Date().toLocaleDateString()}.csv`
  };

  return (
    <Grid item
      sx={{
        marginBottom: "10px", paddingBottom: "10px",
        ...(gridHeightState.sentiment.expanded && { paddingBottom: "15px" }),
        display: "flex", flexDirection: "row", justifyContent: "space-between"
      }} height={breakpoint500 ? gridHeightState.sentiment.height : gridHeightState.sentiment.height} >
      <Grid item xs={breakpoint1080 && gridHeightState.celebration.fullExpanded ? 8 : 12}>
        <Accordion expanded={gridHeightState.sentiment.expanded} onChange={handleExpandSentiment} sx={{
          height: gridHeightState.sentiment.expanded ? "100%" : "auto",
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', height: '8vh' }}>
            {isLeaderOrAdmin() &&
              <SentimentMeterDialog
                open={open} setOpen={setOpen}
                feelingsArray={feelingsArray}
                csvReport={csvReport}
                weekStats={weekStats}
                todayStats={todayStats}
              />
            }
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                flexGrow: 1,
                paddingRight: 0,
                paddingLeft: breakpoint391 ? "none" : "5px"
              }}
            >
              <Typography onClick={() => { }} variant="dsmMain"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: breakpoint391 ? '4px' : "2px" }}
                fontSize={breakpoint500 ? "1.65rem" : "1.25rem"} paddingLeft="6%" textTransform='none'
                width="100%" >
                How are you feeling today?
                <InformationModel
                  heading={SentimentMeterInfo.heading}
                  definition={SentimentMeterInfo.definition}
                  accessibiltyInformation={SentimentMeterInfo.accessibilityInformation} />
              </Typography>
            </AccordionSummary>
            {isLeaderOrAdmin() &&
              <IconButton
                sx={{ borderRadius: 100, width: breakpoint391 ? "none" : "30px" }}
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon sx={{ borderRadius: 50 }} />
              </IconButton>
            }
            {isLeaderOrAdmin() &&
              <Menu
                id="long-menu"
                MenuListProps={{
                  'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleClose} >
                <MenuItem onClick={handleDialog}>See Results</MenuItem>
                <CSVLink {...csvReport} style={{ "text-decoration": "none", color: '#3D3D3D' }}>
                  <MenuItem onClick={handleClose}>
                    Export Results
                  </MenuItem>
                </CSVLink>
              </Menu>
            }
          </Box>
          <AccordionDetails sx={{ p: 0 }}>
            <Grid container direction="row" sx={{ display: "flex", justifyContent: "center", height: "8vh" }}>
              {feelings.map((feeling) => (
                <Grid key={feeling.name} item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconButton onClick={() => handleOnClickResponse(feeling.name)} sx={{ borderRadius: 100, p: 0, color: feeling.color, display: 'flex', justifyContent: 'center' }} >
                    {feeling.name === sentimentResponse ?
                      feeling.iconSelected : feeling.icon
                    }
                  </IconButton>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
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
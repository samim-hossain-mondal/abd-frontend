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
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Stack } from '@mui/system';
import { CSVLink } from "react-csv";
import { useParams } from 'react-router-dom';
import getDBOffSetTime from "../utilityFunctions/getOffsetTimestamp";
import { CREATE_SENTIMENT, GET_SENTIMENTS_BY_DATE, GET_TODAY_SENTIMENT_OF_MEMBER, UPDATE_SENTIMENT } from '../constants/apiEndpoints';
import InformationModel from '../elements/InformationModel';
import { DSMBodyLayoutContext } from "../contexts/DSMBodyLayoutContext";
import SentimentMeterDialog from './SentimentMeterDialog';
import { SentimentMeterInfo } from '../constants/SentimentMeter';
import { RefreshContext } from '../contexts/RefreshContext';
import makeRequest from '../utilityFunctions/makeRequest';
import { ErrorContext } from '../contexts/ErrorContext';
import { SUCCESS_MESSAGE } from "../constants/dsm/index"
import { GENERIC_NAME } from '../constants/dsm/Sentiments';
import getTodayDate from '../utilityFunctions/getTodayDate';
import { ProjectUserContext } from '../contexts/ProjectUserContext';

export default function Sentiment() {
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

  const feelings = [
    {
      name: 'HAPPY',
      icon: <SentimentVerySatisfiedOutlinedIcon sx={{ fontSize: 40 }} />,
      iconSelected: <SentimentVerySatisfiedTwoToneIcon sx={{ fontSize: 50 }} />,
      color: 'emoji.happy'
    },
    {
      name: 'GOOD',
      icon: <SentimentSatisfiedOutlinedIcon sx={{ fontSize: 40 }} />,
      iconSelected: <SentimentSatisfiedTwoToneIcon sx={{ fontSize: 50 }} />,
      color: 'emoji.good'
    },
    {
      name: 'OK',
      icon: <SentimentDissatisfiedOutlinedIcon sx={{ fontSize: 40 }} />,
      iconSelected: <SentimentDissatisfiedTwoToneIcon sx={{ fontSize: 50 }} />,
      color: 'emoji.ok'
    },
    {
      name: 'BAD',
      icon: <SentimentVeryDissatisfiedOutlinedIcon sx={{ fontSize: 40 }} />,
      iconSelected: <SentimentVeryDissatisfiedTwoToneIcon sx={{ fontSize: 50 }} />,
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
      // Date from query/filter
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
  }, [sentimentResponse])

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
    console.log(date, offSetTime);
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
      }} height={gridHeightState.sentiment.height} >
      <Grid item xs={gridHeightState.celebration.fullExpanded ? 8 : 12}>
        <Accordion expanded={gridHeightState.sentiment.expanded} onChange={handleExpandSentiment} sx={{
          height: gridHeightState.sentiment.expanded ? "100%" : "auto",
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              }}
            >
              <Typography onClick={() => { }} variant="dsmMain"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                width="100%" >
                How are you feeling today?
                <InformationModel heading={SentimentMeterInfo.heading}
                  definition={SentimentMeterInfo.definition}
                  accessibiltyInformation={SentimentMeterInfo.accessibilityInformation} />
              </Typography>
            </AccordionSummary>
            {isLeaderOrAdmin() &&
              <IconButton
                sx={{ borderRadius: 100 }}
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
          <AccordionDetails sx={{ padding: '0px' }}>
            <Stack direction="row" spacing={10} sx={{ justifyContent: "center" }}>
              {feelings.map((feeling) => (
                <IconButton onClick={() => handleOnClickResponse(feeling.name)} sx={{ borderRadius: 100, padding: "0px", color: feeling.color }} >
                  {feeling.name === sentimentResponse ?
                    feeling.iconSelected : feeling.icon
                  }
                </IconButton>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Grid>
      {
        gridHeightState.celebration.fullExpanded && (
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
                <Typography variant='dsmSubMain'>Requests</Typography>
              </AccordionSummary>
            </Accordion>
          </Grid>
        )
      }
      {
        gridHeightState.celebration.fullExpanded && (
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
                <Typography variant='dsmSubMain'>Announcements</Typography>
              </AccordionSummary>
            </Accordion>
          </Grid>
        )
      }
    </Grid >
  );
};
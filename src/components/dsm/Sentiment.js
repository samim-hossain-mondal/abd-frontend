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
import axios from 'axios';
import { CSVLink } from "react-csv";
import InformationModel from '../elements/InformationModel';
import { DSMBodyLayoutContext } from "../contexts/DSMBodyLayoutContext";
import SentimentMeterDialog from './SentimentMeterDialog';
import preventParentClick from '../utilityFunctions/PreventParentClick';
import { SentimentMeterInfo } from '../constants/SentimentMeter';
import { DOMAIN } from '../../config';

export default function Sentiment() {
  const { gridHeightState, dispatchGridHeight } = useContext(DSMBodyLayoutContext);
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

  const getDay = (date) => {
    const convertDate = new Date(date);
    const day = convertDate.getDate();
    return day.toString();
  }

  if (localStorage.getItem('currentDay') === null) {
    localStorage.setItem('currentDay', getDay(new Date()));
  }

  if (localStorage.getItem('currentDay') !== null && localStorage.getItem('currentDay') !== getDay(new Date())) {
    localStorage.setItem('currentDay', getDay(new Date()));
    localStorage.setItem('sentimentId', 0);
    localStorage.setItem('currentFeeling', '');
  }

  if (localStorage.getItem('sentimentId') === null) {
    localStorage.setItem('sentimentId', 0);
  }

  if (localStorage.getItem('currentFeeling') === null) {
    localStorage.setItem('currentFeeling', '');
  }

  const [data, setData] = useState([]);
  const [currentFeeling, setCurrentFeeling] = useState(localStorage.getItem('currentFeeling'));
  const [sentimentId, setSentimentId] = useState(localStorage.getItem('sentimentId'));
  const [sentimentUpdation, setSentimentUpdation] = useState(false);

  const [feelingHappy, setFeelingHappy] = useState(localStorage.getItem('currentFeeling') === 'HAPPY');
  const [feelingGood, setFeelingGood] = useState(localStorage.getItem('currentFeeling') === 'GOOD');
  const [feelingOk, setFeelingOk] = useState(localStorage.getItem('currentFeeling') === 'OK');
  const [feelingBad, setFeelingBad] = useState(localStorage.getItem('currentFeeling') === 'BAD');

  if (localStorage.getItem('sentimentId') !== 0) {
    localStorage.setItem('sentimentId', sentimentId);
  }

  const anonymusAuthor = "Anonymus";
  const feeling = {
    feeling_1: 'HAPPY',
    feeling_2: 'GOOD',
    feeling_3: 'OK',
    feeling_4: 'BAD'
  }

  const filterDataByDay = (day) => {
    const filteredData = data.filter((sentiment) => {
      const currentData = getDay(sentiment.createdAt);
      return currentData === day;
    })
    return filteredData;
  }

  const filteredData = filterDataByDay(getDay(new Date()));

  const headers = [
    { label: "sentimentId", key: "sentimentId" },
    { label: "author", key: "author" },
    { label: "sentiment", key: "sentiment" },
    { label: "createdAt", key: "createdAt" }
  ]

  const csvReport = {
    data: filteredData,
    headers,
    filename: `SentimentMeter-${new Date().toLocaleDateString()}.csv`
  };

  const getDataByDay = async () => {
    const response = await axios.get(`${DOMAIN}/api/dsm/sentiment-meter`);
    setData(response.data);
  }
  useEffect(() => {
    getDataByDay();
    setSentimentUpdation(false);
  }, [sentimentId, sentimentUpdation])

  const handleSentimentHappy = async () => {
    setFeelingHappy(!feelingHappy);
    if (!feelingHappy && currentFeeling !== feeling.feeling_1 && currentFeeling !== '') {
      await axios.patch(`${DOMAIN}/api/dsm/sentiment-meter/${sentimentId}`, {
        sentiment: feeling.feeling_1
      })
      localStorage.setItem('currentFeeling', feeling.feeling_1);
      setCurrentFeeling(feeling.feeling_1);
      setSentimentUpdation(true);
    }
    else if (!feelingHappy) {
      const response = await axios.post(`${DOMAIN}/api/dsm/sentiment-meter`, {
        sentiment: feeling.feeling_1,
        author: anonymusAuthor
      })
      setCurrentFeeling(feeling.feeling_1);
      setSentimentId(response.data.sentimentId);
      localStorage.setItem('currentFeeling', feeling.feeling_1);
    }
    else {
      await axios.delete(`${DOMAIN}/api/dsm/sentiment-meter/${sentimentId}`)
      setSentimentId(0);
      setCurrentFeeling('');
      localStorage.setItem('currentFeeling', '');
    }
    setFeelingGood(false);
    setFeelingOk(false);
    setFeelingBad(false);
  }

  const handleSentimentGood = async () => {
    setFeelingGood(!feelingGood);
    if (!feelingGood && currentFeeling !== feeling.feeling_2 && currentFeeling !== '') {
      await axios.patch(`${DOMAIN}/api/dsm/sentiment-meter/${sentimentId}`, {
        sentiment: feeling.feeling_2
      })
      localStorage.setItem('currentFeeling', feeling.feeling_2);
      setCurrentFeeling(feeling.feeling_2);
      setSentimentUpdation(true);
    }
    else if (!feelingGood) {
      const response = await axios.post(`${DOMAIN}/api/dsm/sentiment-meter`, {
        sentiment: feeling.feeling_2,
        author: anonymusAuthor
      })
      setCurrentFeeling(feeling.feeling_2);
      setSentimentId(response.data.sentimentId);
      localStorage.setItem('currentFeeling', feeling.feeling_2);
    }
    else {
      await axios.delete(`${DOMAIN}/api/dsm/sentiment-meter/${sentimentId}`)
      setSentimentId(0);
      setCurrentFeeling('');
      localStorage.setItem('currentFeeling', '');
    }
    setFeelingHappy(false);
    setFeelingOk(false);
    setFeelingBad(false);
  }

  const handleSentimentOk = async () => {
    setFeelingOk(!feelingOk);
    if (!feelingOk && currentFeeling !== feeling.feeling_3 && currentFeeling !== '') {
      await axios.patch(`${DOMAIN}/api/dsm/sentiment-meter/${sentimentId}`, {
        sentiment: feeling.feeling_3
      })
      localStorage.setItem('currentFeeling', feeling.feeling_3);
      setCurrentFeeling(feeling.feeling_3);
      setSentimentUpdation(true);
    }
    else if (!feelingOk) {
      const response = await axios.post(`${DOMAIN}/api/dsm/sentiment-meter`, {
        sentiment: feeling.feeling_3,
        author: anonymusAuthor
      })
      setCurrentFeeling(feeling.feeling_3);
      setSentimentId(response.data.sentimentId);
      localStorage.setItem('currentFeeling', feeling.feeling_3);
    }
    else {
      await axios.delete(`${DOMAIN}/api/dsm/sentiment-meter/${sentimentId}`)
      setSentimentId(0);
      setCurrentFeeling('');
      localStorage.setItem('currentFeeling', '');
    }
    setFeelingHappy(false);
    setFeelingGood(false);
    setFeelingBad(false);
  }

  const handleSentimentBad = async () => {
    setFeelingBad(!feelingBad);
    if (!feelingBad && currentFeeling !== feeling.feeling_4 && currentFeeling !== '') {
      await axios.patch(`${DOMAIN}/api/dsm/sentiment-meter/${sentimentId}`, {
        sentiment: feeling.feeling_4
      })
      localStorage.setItem('currentFeeling', feeling.feeling_4);
      setCurrentFeeling(feeling.feeling_4);
      setSentimentUpdation(true);
    }
    else if (!feelingBad) {
      const response = await axios.post(`${DOMAIN}/api/dsm/sentiment-meter`, {
        sentiment: feeling.feeling_4,
        author: anonymusAuthor
      })
      setCurrentFeeling(feeling.feeling_4);
      setSentimentId(response.data.sentimentId);
      localStorage.setItem('currentFeeling', feeling.feeling_4);
    }
    else {
      await axios.delete(`${DOMAIN}/api/dsm/sentiment-meter/${sentimentId}`)
      setSentimentId(0);
      setCurrentFeeling('');
      localStorage.setItem('currentFeeling', '');
    }
    setFeelingHappy(false);
    setFeelingGood(false);
    setFeelingOk(false);
  }

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
            <SentimentMeterDialog open={open} setOpen={setOpen} data={data} csvReport={csvReport} />
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                flexGrow: 1,
              }}
            >
              <Typography onClick={preventParentClick(() => { })} variant="dsmMain"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                width="100%" >
                How are you feeling today?
                <InformationModel heading={SentimentMeterInfo.heading}
                  definition={SentimentMeterInfo.definition}
                  accessibiltyInformation={SentimentMeterInfo.accessibilityInformation} />
              </Typography>
            </AccordionSummary>
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
          </Box>
          <AccordionDetails sx={{ padding: '0px' }}>
            <Stack direction="row" spacing={10} sx={{ justifyContent: "center" }}>
              <Box>
                <IconButton onClick={handleSentimentHappy} sx={{ borderRadius: 100, padding: "0px", color: 'emoji.happy' }}>
                  {
                    feelingHappy ?
                      <SentimentVerySatisfiedTwoToneIcon sx={{ fontSize: 40 }} />
                      :
                      <SentimentVerySatisfiedOutlinedIcon sx={{ fontSize: 40 }} />
                  }
                </IconButton>
              </Box>
              <IconButton onClick={handleSentimentGood} sx={{ borderRadius: 100, padding: "0px", color: 'emoji.good' }}>
                {
                  feelingGood ?
                    <SentimentSatisfiedTwoToneIcon sx={{ fontSize: 40 }} />
                    :
                    <SentimentSatisfiedOutlinedIcon sx={{ fontSize: 40 }} />
                }
              </IconButton>
              <IconButton onClick={handleSentimentOk} sx={{ borderRadius: 100, padding: "0px", color: 'emoji.ok' }}>
                {
                  feelingOk ?
                    <SentimentDissatisfiedTwoToneIcon sx={{ fontSize: 40 }} />
                    :
                    <SentimentDissatisfiedOutlinedIcon sx={{ fontSize: 40 }} />
                }
              </IconButton>
              <IconButton onClick={handleSentimentBad} sx={{ borderRadius: 100, padding: "0px", color: 'emoji.bad' }}>
                {
                  feelingBad ?
                    <SentimentVeryDissatisfiedTwoToneIcon sx={{ fontSize: 40 }} />
                    :
                    <SentimentVeryDissatisfiedOutlinedIcon sx={{ fontSize: 40 }} />}
              </IconButton>
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
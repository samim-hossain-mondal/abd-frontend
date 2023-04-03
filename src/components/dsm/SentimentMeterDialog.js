/* eslint-disable react/forbid-prop-types */
import { React, useContext, useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';
import { useParams } from 'react-router';
import getDBOffSetTime from "../utilityFunctions/getOffsetTimestamp";
import getTodayDate from '../utilityFunctions/getTodayDate';
import { SentimentMeterInfo } from '../constants/SentimentMeter';
import makeRequest from '../utilityFunctions/makeRequest';
import { GET_SENTIMENTS_BY_DATE } from '../constants/apiEndpoints';
import { ErrorContext } from '../contexts/ErrorContext';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function SentimentMeterDialog({ open, setOpen, isLeaderOrAdmin }) {
  const [compareButton, setCompareButton] = useState(false);
  const [weekStats, setWeekStats] = useState([])
  const [todayStats, setTodayStats] = useState([])
  const [sentimeterData, setSentimeterData] = useState([]);
  const { projectId } = useParams()
  const { setError } = useContext(ErrorContext)
  const feelingsArray = ["HAPPY", "GOOD", "OK", "BAD"]

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
    const queryDate = getTodayDate();
    if (isLeaderOrAdmin()) {
      getSentimeterStats(queryDate).then(stats => {
        setSentimeterData(stats)
      })
    }
  }, [])


  const sentimentData = {
    labels: feelingsArray,
    datasets: [
      {
        label: '# of Sentiments',
        data: todayStats,
        backgroundColor: [
          'rgb(0, 0, 255, 0.5)',
          'rgb(60, 179, 113, 0.5)',
          'rgb(255, 165, 0, 0.5)',
          'rgb(255, 0, 0, 0.5)',
        ],
        borderColor: [
          'rgb(0, 0, 255)',
          'rgb(60, 179, 113)',
          'rgb(255, 165, 0)',
          'rgb(255, 0, 0)',
        ],
        borderWidth: 1,
      },
    ],
  };



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
    feelingsArray.forEach(emoji => {
      headers.push({ label: emoji, key: emoji })
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
      todayRow[feelingsArray[index]] = item;
      weekRow[feelingsArray[index]] = weekStats[index];
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

  const handleClose = () => { setOpen(false); };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Sentiment Meter Bar Chart',
      },
    },
  };

  const { labels } = sentimentData;

  const barData = {
    labels,
    datasets: [
      {
        label: 'Week Average',
        data: weekStats,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Today',
        data: todayStats,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const compareDataHandler = () => {
    setCompareButton(!compareButton);
  };

  return (
    <div >
      <Dialog
        open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
        sx={{ boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1), 0px 24px 48px rgba(0, 0, 0, 0.2)', borderRadius: '2px' }}
      >
        <DialogContent>
          <Box sx={{ display: 'flex' }}>
            <Typography flexGrow={1} variant="h6" color='black'>Sentiment Meter</Typography>
            <Box>
              <Button onClick={compareDataHandler} variant="button" color='primary.main' autoFocus>
                <Typography variant="button" color='primary.main'>
                  {
                    compareButton ? 'Show Pie Chart' : 'Show Bar Chart'
                  }
                </Typography>
              </Button>
            </Box>
          </Box>
          <Box padding='50px'>
            {
              compareButton ?
                (<Bar data={barData} options={options}
                  height="200px" width="200px"
                // width='50%' aspectRatio="1/1"
                />)
                :
                (<Pie data={sentimentData} height="200px" width="200px" />)
            }
          </Box>
          <DialogContentText id="alert-dialog-description">
            {SentimentMeterInfo.heading} {SentimentMeterInfo.definition}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CSVLink {...csvReport} style={{ 'text-decoration': 'none' }}>
            <Button onClick={handleClose} variant="button" color='primary.main' autoFocus>
              <Typography variant="button" color='primary.main'>Export to CSV</Typography>
            </Button>
          </CSVLink>
          <Button onClick={handleClose} variant="button" color='primary.main' autoFocus>
            <Typography variant="button" color='primary.main'>OK</Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </div >
  );
}

SentimentMeterDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  isLeaderOrAdmin: PropTypes.func.isRequired,
}
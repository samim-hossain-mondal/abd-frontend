/* eslint-disable react/prop-types */
import { React, useState } from 'react';
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
import { SentimentMeterInfo } from '../constants/SentimentMeter';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function SentimentMeterDialog({ open, setOpen, data, csvReport }) {

  const [compareButton, setCompareButton] = useState(false);

  const feeling = {
    feeling_1: 'HAPPY',
    feeling_2: 'GOOD',
    feeling_3: 'OK',
    feeling_4: 'BAD'
  }

  const getDay = (date) => {
    const convertDate = new Date(date);
    let day = convertDate.getDate();
    if (day < 10) {
      day = `0${day}`;
    }
    return day;
  }

  const filterDataByDay = (day) => {
    const filteredData = data.filter((sentiment) => {
      const currentData = getDay(sentiment.createdAt);
      return currentData === day;
    })
    return filteredData;
  }

  const filteredData = filterDataByDay(getDay(new Date()));

  const getLast7days = () => {
    const lastWeek = [];
    for (let i = 0; i < 7; i += 1) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      lastWeek.push(getDay(date));
    }
    return lastWeek;
  }

  const countFeeling = (weekData, sentiment) => {
    let count = 0;
    weekData.forEach((item) => {
      if (item.sentiment === sentiment) {
        count += 1;
      }
    });
    return count;
  }

  const calcSentimentCountWeekAvg = () => {
    const last7days = getLast7days();
    const sentimentOfWeek = [];
    last7days.forEach((day) => {
      sentimentOfWeek.push(filterDataByDay(day));
    })
    const happyAvg = sentimentOfWeek.map((item) => countFeeling(item, feeling.feeling_1)).reduce((a, b) => a + b, 0) / 5;
    const goodAvg = sentimentOfWeek.map((item) => countFeeling(item, feeling.feeling_2)).reduce((a, b) => a + b, 0) / 5;
    const okAvg = sentimentOfWeek.map((item) => countFeeling(item, feeling.feeling_3)).reduce((a, b) => a + b, 0) / 5;
    const badAvg = sentimentOfWeek.map((item) => countFeeling(item, feeling.feeling_4)).reduce((a, b) => a + b, 0) / 5;
    return [happyAvg, goodAvg, okAvg, badAvg];
  }

  const avgData = calcSentimentCountWeekAvg();

  const filteredSentiment = filteredData.map((item) => item.sentiment);
  const countSentiment = (sentiment) => {
    let count = 0;
    filteredSentiment.forEach((item) => {
      if (item === sentiment) {
        count += 1;
      }
    });
    return count;
  };

  const sentimentData = {
    labels: [feeling.feeling_1, feeling.feeling_2, feeling.feeling_3, feeling.feeling_4],
    datasets: [
      {
        label: '# of Sentiments',
        data: [
          countSentiment(feeling.feeling_1),
          countSentiment(feeling.feeling_2),
          countSentiment(feeling.feeling_3),
          countSentiment(feeling.feeling_4)],
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
        data: avgData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Today',
        data: [
          countSentiment(feeling.feeling_1),
          countSentiment(feeling.feeling_2),
          countSentiment(feeling.feeling_3),
          countSentiment(feeling.feeling_4)],
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
                (<Bar data={barData} options={options} height='200px' width='200px' />)
                :
                (<Pie data={sentimentData} height='200px' width='200px' />)
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
  /* eslint-disable react/forbid-prop-types */
  data: PropTypes.array.isRequired,
};

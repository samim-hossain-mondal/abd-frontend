/* eslint-disable react/forbid-prop-types */
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

export default function SentimentMeterDialog({ open, setOpen, csvReport, feelingsArray, weekStats, todayStats }) {
  const [compareButton, setCompareButton] = useState(false);

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
  csvReport: PropTypes.object.isRequired,
  feelingsArray: PropTypes.array.isRequired,
  weekStats: PropTypes.array.isRequired,
  todayStats: PropTypes.array.isRequired,
}
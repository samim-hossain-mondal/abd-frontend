import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { Divider, Typography } from '@mui/material';
import { getDateGroupName } from '../../utilityFunctions/dateMatcher';
import DateDivider from '../DateDivider';

export default function AnnouncementChatContainer({ title, content, date, previousRequestDate, onClick }) {
  const [dateGroupName, setDateGroupName] = useState();

  useEffect(() => {
    setDateGroupName(getDateGroupName(date, previousRequestDate));
  }, [date, previousRequestDate]);

  return (
    <Box>
      {dateGroupName ?
        <DateDivider dateGroupName={dateGroupName} /> :
        <Divider />
      }
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
          cursor: 'pointer',
          padding: '0 8px 8px 8px',
        }}
        onClick={onClick}
      >
        <Box>
          <Typography
            variant='dsmSubMain'
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {content}
          </Typography>
          <Typography variant="caption" sx={{ marginTop: 8, color: 'gray' }}>
            {date.toLocaleString('en-US', {
              hour: '2-digit', minute: '2-digit', hour12: true
            })}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

AnnouncementChatContainer.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  date: PropTypes.instanceOf(Date),
  onClick: PropTypes.func,
  previousRequestDate: (PropTypes.instanceOf(Date) || null).isRequired,
};

AnnouncementChatContainer.defaultProps = {
  title: '',
  content: '',
  date: '',
  onClick: () => { },
};

import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

export default function AnnouncementChatContainer({ title, content, date, onClick }) {
  return (
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
            month: 'short',
            day: 'numeric',
          })}
        </Typography>
      </Box>
    </Box>
  );
}

AnnouncementChatContainer.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  date: PropTypes.instanceOf(Date),
  onClick: PropTypes.func,
};

AnnouncementChatContainer.defaultProps = {
  title: '',
  content: '',
  date: '',
  onClick: () => { },
};

import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { Avatar, Chip, Typography } from '@mui/material';
import stc from 'string-to-color';

export default function ChatContainer({ name, src, content, date, onClick, afterDate, chipContent }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <Avatar src={src} sx={{ bgcolor: stc(name) }}>
        {src ? '' : name.trim()[0]}
      </Avatar>
      <Box sx={{
        width: '100%',
        position: 'relative',
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
        }}>
          <Typography>{content}</Typography>
          {
            chipContent.length > 0 && <Chip label={chipContent} sx={{
              cursor: onClick ? 'pointer' : 'default',
            }} />
          }
        </Box>
        <Typography variant="caption" sx={{ marginTop: 8, color: 'gray' }}>
          {date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
          {' '}
          {afterDate}
        </Typography>
      </Box>
    </Box>
  );
}

ChatContainer.propTypes = {
  name: PropTypes.string,
  src: PropTypes.string,
  content: PropTypes.string,
  date: PropTypes.instanceOf(Date),
  onClick: PropTypes.func,
  chipContent: PropTypes.string,
  afterDate: PropTypes.node,
};

ChatContainer.defaultProps = {
  name: '',
  src: undefined,
  content: '',
  date: '',
  onClick: undefined,
  chipContent: '',
  afterDate: ''
};

import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { Avatar, Typography } from '@mui/material';
import stc from 'string-to-color';

export default function ChatContainer({ name, src, content, date, onClick }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <Avatar src={src} sx={{ bgcolor: stc(name) }}>
        {src ? '' : name.trim()[0]}
      </Avatar>
      <Box>
        <Typography>{content}</Typography>
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

ChatContainer.propTypes = {
  name: PropTypes.string,
  src: PropTypes.string,
  content: PropTypes.string,
  date: PropTypes.instanceOf(Date),
  onClick: PropTypes.func,
};

ChatContainer.defaultProps = {
  name: '',
  src: undefined,
  content: '',
  date: '',
  onClick: () => { },
};

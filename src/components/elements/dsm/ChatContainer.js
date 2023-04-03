import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { Avatar, Chip, Tooltip, Typography } from '@mui/material';
import stc from 'string-to-color';
import DateDivider from '../DateDivider';
import { getDateGroupName } from "../../utilityFunctions/dateMatcher";
import { DSM_REQUEST_TYPES } from '../../constants/dsm/Requests';

export default function ChatContainer({ name, src, content, date, previousRequestDate, onClick, isRequestDone, chipContent }) {

  const [dateGroupName, setDateGroupName] = useState();

  useEffect(() => {
    setDateGroupName(getDateGroupName(date, previousRequestDate));
  }, [date, previousRequestDate]);

  return (
    <Box sx={{ paddingBottom: "5px" }}>
      {dateGroupName &&
        <DateDivider dateGroupName={dateGroupName} sx={{ padding: previousRequestDate ? "8px 0" : "0 0 8px 0" }} />
      }
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '8px',
          cursor: onClick ? 'pointer' : 'default',
        }}
        onClick={onClick}
      >
        <Tooltip title={name} placement="bottom">
          <Avatar src={src} sx={{ width: "30px", height: "30px", aspectRatio: "1/1", bgcolor: stc(name) }}>
            {src ? '' : name.trim()[0]}
          </Avatar>
        </Tooltip>
        <Box sx={{
          width: '100%',
          position: 'relative',
        }}>

          <Typography sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical',
            paddingRight: "8px"
          }}>{content}</Typography>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: "8px"
          }}>
            <Typography variant="caption" sx={{ color: 'gray' }}>
              {date.toLocaleString('en-US', {
                hour: '2-digit', minute: '2-digit', hour12: true
              })}
            </Typography>
            <Box>
              {
                isRequestDone && <Chip label="COMPLETE" sx={{
                  cursor: onClick ? 'pointer' : 'default',
                  height: "24px",
                  width: "80px",
                  fontSize: "10px",
                  backgroundColor: "#e8f5e9",
                  marginRight: "8px"
                }} />
              }

              {
                chipContent.length > 0 && <Chip label={chipContent} sx={{
                  cursor: onClick ? 'pointer' : 'default',
                  height: "24px",
                  width: "80px",
                  fontSize: "10px",
                  backgroundColor: chipContent === DSM_REQUEST_TYPES[0] ? "#e3f2fd" : "#ffebee",
                }} />
              }
            </Box>
          </Box>
        </Box>
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
  isRequestDone: PropTypes.bool,
  previousRequestDate: (PropTypes.instanceOf(Date) || PropTypes.string).isRequired,
};

ChatContainer.defaultProps = {
  name: '',
  src: undefined,
  content: '',
  date: '',
  onClick: undefined,
  chipContent: '',
  isRequestDone: false
};

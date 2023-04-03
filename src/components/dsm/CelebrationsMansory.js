import React from 'react';
import { PropTypes } from 'prop-types';
import { Masonry } from '@mui/lab';
import { Box } from '@mui/system';
import CelebrationCard from './CelebrationCard';
import DateDivider from '../elements/DateDivider';

export default function CelebrationsMansory({ masonryIndex, dateGroupName, celebrationsByDate, onDeleteCelebration }) {

  return (
    <Box>
      {dateGroupName &&
        <DateDivider dateGroupName={dateGroupName} sx={{ ...(masonryIndex && { paddingTop: "24px" }), minWidth: "100%" }} />
      }
      <Masonry
        overflow="hidden"
        className="celebration-masonry" sx={{ overflowY: 'hidden', paddingButtom: "32px", paddingTop: "24px" }} spacing={4}>
        {celebrationsByDate.map((celebration, index) => (
          <CelebrationCard
            key={celebration?.celebrationId}
            celebration={celebration}
            previousRequestDate={index === 0 ? null : new Date(celebrationsByDate[index - 1]?.createdAt)}
            isPreview={false}
            onDeleteCelebration={onDeleteCelebration}
          />
        ))}
      </Masonry>
    </Box>
  );
};

CelebrationsMansory.propTypes = {
  masonryIndex: PropTypes.number.isRequired,
  dateGroupName: PropTypes.string.isRequired,
  celebrationsByDate: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isAnonymous: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
  })).isRequired,
  onDeleteCelebration: PropTypes.func.isRequired,
};

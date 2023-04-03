import React from 'react';
import { Skeleton, useMediaQuery } from '@mui/material';
import { PropTypes } from 'prop-types';
import { Stack } from '@mui/system';

export default function SkeletonCelebration({ height }) {
  const breakpoint391 = useMediaQuery('(min-width:391px)');
  return (
    <Stack direction="column" spacing={1} sx={{
      height,
      maxWidth: breakpoint391 ? "155px" : "95%",
      minWidth: breakpoint391 ? "155px" : "95%",
    }}>
      <Skeleton animation="pulse" variant="text" width="100%" />
      <Skeleton animation="pulse" variant="text" width="40%" />
      <Stack direction="row" spacing={1} height="50%">
        <Skeleton animation="pulse" variant="circular" sx={{ width: "30px", height: "30px", aspectRatio: "1/1" }} />
        <Stack width="40%" paddingTop="15px"><Skeleton animation="pulse" variant="text" height="10px" /></Stack>
      </Stack>
    </Stack>
  )
}

SkeletonCelebration.propTypes = {
  height: PropTypes.string.isRequired,
};
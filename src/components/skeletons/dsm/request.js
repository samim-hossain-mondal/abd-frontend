import React from 'react';
import { Skeleton } from '@mui/material';
import { Stack } from '@mui/system';

export default function SkeletonRequest() {
  return (
    <Stack direction="row" spacing={1}>
      < Skeleton animation="pulse" variant="circular" sx={{ width: "30px", height: "30px", aspectRatio: "1/1" }} />
      <Stack direction="column" spacing={1} width="80%">
        <Skeleton animation="pulse" variant="text" width="100%" />
        <Skeleton animation="pulse" variant="text" width="40%" />
      </Stack>
    </Stack>
  )
}
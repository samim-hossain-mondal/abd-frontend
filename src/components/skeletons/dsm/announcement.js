import React from 'react';
import { Skeleton } from '@mui/material';
import { Stack } from '@mui/system';

export default function SkeletonAnnouncement() {
  return (
    <Stack direction="column" spacing={1}>
      <Skeleton animation="pulse" variant="text" width="30%" />
      <Skeleton animation="pulse" variant="text" width="80%" />
    </Stack>
  )
}
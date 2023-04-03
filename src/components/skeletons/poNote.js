import React from 'react';
import { Skeleton } from '@mui/material';
import { Stack } from '@mui/system';

export default function SkeletonPONote() {
  return (
    <Stack direction="column" spacing={1} sx={{ padding: "20px 20px" }}>
      <Stack direction="row" spacing="70%" width="95%">
        <Skeleton animation="pulse" variant="text" width="20px" height="30px" sx={{ aspectRatio: "1/1" }} />
        <Skeleton animation="pulse" variant="text" width="30%" height="20px" />
      </Stack>
      <Skeleton animation="pulse" variant="text" width="80%" height="20px" />
      <Skeleton animation="pulse" variant="text" width="40%" height="20px" />
      <Skeleton animation="pulse" variant="text" width="60%" height="20px" />
      <Skeleton animation="pulse" variant="text" width="20%" height="10px" />
    </Stack>
  )
}
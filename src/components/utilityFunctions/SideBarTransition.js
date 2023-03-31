import React from 'react';
import { Slide } from '@mui/material';

const Transition = React.forwardRef(
  (props, ref) => <Slide direction="left" ref={ref} {...props} />
);
export default Transition;
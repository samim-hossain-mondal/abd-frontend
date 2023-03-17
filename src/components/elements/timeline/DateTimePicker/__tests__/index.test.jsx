import React from 'react';
import { render, screen } from '@testing-library/react';
import DateTimePicker from '../Index';
import dateGetter from '../../../../utilityFunctions/DateGetter';

describe('DateTimePicker', () => {
  it('should show date when defaultValue is passed', () => {
    render(<DateTimePicker defaultValue={new Date()} label='label' onChange={()=>{}} />);
    expect(screen.getByText(dateGetter(new Date(),true))).toBeTruthy();
  });

  it('should show label when defaultValue is not passed', () => {
    render(<DateTimePicker label='label' onChange={()=>{}} />);
    expect(screen.getByText('label')).toBeTruthy();
  });
});

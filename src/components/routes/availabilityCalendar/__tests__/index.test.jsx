import React from 'react';
import {render,screen} from '@testing-library/react';
import AvailabilityCalendar from '..';

describe('AvailabilityCalendar', () => {
  it('should show agenda as view',()=>{
    render(<AvailabilityCalendar/>);
    expect(screen.getByText('Agenda')).toBeTruthy();
  })
});
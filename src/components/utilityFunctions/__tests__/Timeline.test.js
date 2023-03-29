import React from 'react';
import { render, screen } from '@testing-library/react';
import Timeline from '../Timeline';

describe('Timeline', () => {
  it('should show timeline if timeline is not empty', () => {
    const timeline = '2021-02-01T00:00:00';
    const isSubmit = false;
    render(<Timeline timeline={timeline} isSubmit={isSubmit} setTimeline={()=>{}}/>);
    expect(screen.getByText('Timeline')).toBeTruthy();
  });

  it('should set timeline date is entered', () => {
    const timeline = '2021-02-01T00:00:00';
    const isSubmit = false;
    const setTimeline = jest.fn();
    render(<Timeline timeline={timeline} isSubmit={isSubmit} setTimeline={setTimeline}/>);
    expect(screen.getByText('Timeline')).toBeTruthy();
    const date = screen.getByLabelText('Select date');
    date.value = '2021-02-02T00:00:00';
    date.dispatchEvent(new Event('change', { bubbles: true }));
    expect(setTimeline).toHaveBeenCalledTimes(1);
  });
});
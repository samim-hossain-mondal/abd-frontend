import React from 'react';
import { render, screen } from '@testing-library/react';
import DateFilterBox from '../DateFilterBox';


describe('DateFilterBox', () => {
  it('should show label when defaultValue is not passed', () => {
    render(<DateFilterBox label='label' onChange={()=>{}} />);
    expect(screen.getByText('label')).toBeTruthy();
  });
});
import React from 'react';
import { render, screen } from '@testing-library/react';
import EditIcon from '@mui/icons-material/Edit';
import IconCheckbox from '../IconCheckbox';

describe('IconCheckBox', () => {
  it('should show label when component is rendered', () => {
    render(<IconCheckbox Icon={EditIcon} label='label' onChange={()=>{}}/>);
    expect(screen.getByText('label')).toBeTruthy();
  });

  it('should be checked if checked is true', () => {
    const isChecked = true;
    render(<IconCheckbox Icon={EditIcon} label='label' onChange={()=>{}} isChecked={isChecked}/>);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveProperty('checked', true)
  });
});
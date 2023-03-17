import React from 'react';
import { render, screen } from '@testing-library/react';
import GenericInputModal from '../GenericInputModal';

describe('GenericInputModal', () => {
  it('should display title on the screen', () => {
    jest.spyOn(React, 'useState').mockImplementation((init) => [init, jest.fn()]);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    render(<GenericInputModal title="Title" onCloseButtonClick={()=>{}} primaryButtonText=''/>);
    expect(screen.getByText('Title')).toBeTruthy();
  });
  
  it('should show delete and edit icons if isDisabled is false',()=>{
    jest.spyOn(React, 'useState').mockImplementation((init) => [init, jest.fn()]);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    render(<GenericInputModal title="Title" onCloseButtonClick={()=>{}} primaryButtonText='' isDisabled={false}/>);
    expect(screen.getByTestId('edit-icon')).toBeTruthy();
  })
});
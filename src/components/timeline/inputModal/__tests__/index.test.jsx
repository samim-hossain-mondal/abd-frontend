import {render} from '@testing-library/react';
import React from 'react';
import GenericInputModal from '..';

describe('GenericInputModal', () => {
  it('should render', () => {
    const {container} = render(<GenericInputModal onCloseButtonClick={()=>{}} primaryButtonText='TEXT' />);
    expect(container).toMatchSnapshot();
  });
});
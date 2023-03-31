import React from 'react';
import {render,screen,fireEvent} from '@testing-library/react';
import SuccessSnackbar from '../SuccessSnackbar';

describe('SuccessSnackbar', () => {
  it('should match snapshot', () => {
    const {container} = render(
      <SuccessSnackbar message="success" setSuccess={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
  });

  it('the snackbar should disappear when closed',()=>{
    const setSuccess = jest.fn();
    render(
      <SuccessSnackbar message="success" setSuccess={setSuccess} />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(setSuccess).toHaveBeenCalled();
  });
});
import React from 'react';
import {render,fireEvent,screen} from '@testing-library/react';
import ErrorSnackbar from '../ErrorSnackbar';


describe('ErrorSnackbar', () => {
  it('should match snapshot', () => {
    const {container} = render(
      <ErrorSnackbar message="error" setError={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
  });

  it('should call setError when the snackbar is closed',()=>{
    const setError = jest.fn();
    render(
      <ErrorSnackbar message="error" setError={setError} />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(setError).toHaveBeenCalled();
  });
});
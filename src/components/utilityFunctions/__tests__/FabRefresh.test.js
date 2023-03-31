import React from 'react';
import {render} from '@testing-library/react';
import FabRefresh from '../FabRefresh';
import { RefreshContext } from '../../contexts/RefreshContext';

describe('FabRefresh', () => {
  it('should match snapshot', () => {
    const {container} = render(
      <RefreshContext.Provider value={{setRefresh: jest.fn()}}>
        <FabRefresh />
      </RefreshContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it('should handle refresh when fab is clicked', () => {
    const setRefresh = jest.fn();
    const {getByRole} = render(
      <RefreshContext.Provider value={{setRefresh}}>
        <FabRefresh />
      </RefreshContext.Provider>
    );
    getByRole('button').click();
    expect(setRefresh).toHaveBeenCalledTimes(1);
  });
});
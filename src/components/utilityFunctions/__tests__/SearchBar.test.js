import React from 'react';
import {render,fireEvent,screen, waitFor} from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('should match snapshot', () => {
    const {container} = render(
      <SearchBar query={{search: '', status: '', startDate: '', endDate: ''}} setQuery={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
  });

  it('should setQuery when submits', () => {
    const setQuery = jest.fn();
    render(
      <SearchBar query={{search: '', status: '', startDate: '', endDate: ''}} setQuery={setQuery} />
    );
    fireEvent.submit(screen.getByTestId('search-form'));
    expect(setQuery).toHaveBeenCalled();
  });

  it('should setQuery when changes', async () => {
    const setQuery = jest.fn();
    render(
      <SearchBar query={{search: '', status: '', startDate: '', endDate: ''}} setQuery={setQuery} />
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
    await waitFor(() => {
      expect(setQuery).toHaveBeenCalled();
    });
  });
});
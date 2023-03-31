import React from 'react';
import { useParams } from 'react-router-dom';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ErrorProvider } from '../../../contexts/ErrorContext';
import { RefreshContextProvider, RefreshContext } from '../../../contexts/RefreshContext';
import { ProjectUserProvider } from '../../../contexts/ProjectUserContext';
import AvailabilityCalendar from '..';
import makeRequest from '../../../utilityFunctions/makeRequest';

jest.mock('react-router-dom');
jest.mock('../../../utilityFunctions/makeRequest');

const queryClient = new QueryClient();

describe('AvailabilityCalendar', () => {
  it('renders without crashing', async () => {
    useParams.mockReturnValue({ projectId: '1' });
    await act(async () => {
      render(
        <ProjectUserProvider>
          <QueryClientProvider client={queryClient}>
            <ErrorProvider>
              <RefreshContextProvider>
                <AvailabilityCalendar availabilityIsInViewPort={false} />
              </RefreshContextProvider>
            </ErrorProvider>
          </QueryClientProvider>
        </ProjectUserProvider>
      );
    });
    expect(screen.getByText('Loading...')).toBeTruthy();
    waitFor(() => {
      expect(screen.getByTestId('availability-calendar')).toBeTruthy();
    });
  });

  it('should have agenda view as default', async () => {
    useParams.mockReturnValue({ projectId: '1' });
    await act(async () => {
      render(
        <ProjectUserProvider>
          <QueryClientProvider client={queryClient}>
            <ErrorProvider>
              <RefreshContextProvider>
                <AvailabilityCalendar availabilityIsInViewPort={false} />
              </RefreshContextProvider>
            </ErrorProvider>
          </QueryClientProvider>
        </ProjectUserProvider>
      );
    });
    expect(screen.getByText('Loading...')).toBeTruthy();
    waitFor(() => {
      expect(screen.getByText('Agenda')).toHaveClass('rbc-active');
    });
  });


  it('should change view to Month on clicking Month button', async () => {
    useParams.mockReturnValue({ projectId: '1' });
    const events = [
      {
        startDate: '2021-07-01T00:00:00.000Z',
        endDate: '2021-07-02T00:00:00.000Z',
        event: 'Leave',
        userFullName: 'John Doe',
        memberId: '1',
        leaveId: '1',
        isRisk: false,
      },
    ];
    makeRequest.mockResolvedValue(events);
    await act(async () => {
      render(
        <ProjectUserProvider>
          <QueryClientProvider client={queryClient}>
            <ErrorProvider>
              <RefreshContextProvider>
                <AvailabilityCalendar availabilityIsInViewPort />
              </RefreshContextProvider>
            </ErrorProvider>
          </QueryClientProvider>
        </ProjectUserProvider>
      );
    });
    fireEvent.click(screen.getByText('Month'));
    waitFor(() => {
      expect(screen.getByText('Month')).toHaveClass('rbc-active');
    });
  });

  it('should fetch all the events from the server', async () => {
    const events = [
      {
        startDate: '2021-07-01T00:00:00.000Z',
        endDate: '2021-07-02T00:00:00.000Z',
        event: 'Leave',
        userFullName: 'John Doe',
        memberId: '1',
        leaveId: '1',
        isRisk: false,
      },
    ];
    
    useParams.mockReturnValue({ projectId: '1' });
    makeRequest.mockResolvedValue(events);
    await act(async () => {
    render(
      <ProjectUserProvider>
        <QueryClientProvider client={queryClient}>
          <ErrorProvider>
            <RefreshContextProvider>
              <AvailabilityCalendar availabilityIsInViewPort />
            </RefreshContextProvider>
          </ErrorProvider>
        </QueryClientProvider>
      </ProjectUserProvider>
    );
    });
    waitFor(() => {
      expect(screen.getByText('@John Doe: Leave')).toBeTruthy();
    });
  });

  it('should show error message if there is an error while fetching events', async () => {
    useParams.mockReturnValue({ projectId: '1' });
    makeRequest.mockRejectedValue('Error');
    await act(async () => {
      render(
        <ProjectUserProvider>
          <QueryClientProvider client={queryClient}>
            <ErrorProvider>
              <RefreshContextProvider>
                <AvailabilityCalendar availabilityIsInViewPort />
              </RefreshContextProvider>
            </ErrorProvider>
          </QueryClientProvider>
        </ProjectUserProvider>
      );
    });
    waitFor(() => {
      expect(screen.getByText('Error')).toBeTruthy();
    });
  });

  it('should refetch events when refresh is triggered', async () => {
    useParams.mockReturnValue({ projectId: '1' });
    makeRequest.mockResolvedValue([]);
    const refreshValues = {
      refresh:{
        availabilityCalendar: true,
        poNotes: false,
        sentiment: false,
        request: false,
        announcement: false,
        celebration: false,
      },
      setRefresh: jest.fn(),
    }

    render(
      <ProjectUserProvider>
        <QueryClientProvider client={queryClient}>
          <ErrorProvider>
            <RefreshContext.Provider value={refreshValues}>
              <AvailabilityCalendar availabilityIsInViewPort />
            </RefreshContext.Provider>
          </ErrorProvider>
        </QueryClientProvider>
      </ProjectUserProvider>
    );

    await waitFor(async () => {
      expect(await makeRequest).toHaveBeenCalledTimes(2);
    });
  });

});
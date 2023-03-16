import React from 'react';
import { render,screen } from '@testing-library/react';
import ChatContainer from '../ChatContainer';

describe('ChatContainer', () => {
  it('should display content on the screen', () => {
    render(<ChatContainer name="John Doe" content="Hello World" date={new Date()} />);
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  it('should call onClick function when clicked', () => {
    const onClick = jest.fn();
    render(<ChatContainer name="John Doe" content="Hello World" date={new Date()} onClick={onClick} />);
    screen.getByText('Hello World').click();
    expect(onClick).toHaveBeenCalled();
  });
});
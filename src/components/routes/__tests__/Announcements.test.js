import React from 'react';
import {render} from '@testing-library/react';

import Announcements from '../Announcements';

describe('Announcements', () => {
  it('renders', () => {
    const {container} = render(<Announcements />);
    expect(container).toMatchSnapshot();
  });
});
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Settings from './Settings';

describe('Settings Component', () => {
  // Test for initial render
  test('renders initial message correctly', () => {
    const { getByText } = render(<Settings />);
    
    // Check that the initial message "Settings Screen" is displayed
    expect(getByText('Settings Screen')).toBeTruthy();
  });

  // Test button press
  test('updates message on button press', () => {
    const { getByText } = render(<Settings />);
    
    // Find the button and simulate a press
    const button = getByText('Update Settings');
    fireEvent.press(button);

    // After the press, the message should change to "Settings Updated"
    expect(getByText('Settings Updated')).toBeTruthy();
  });
});

import React from 'react';
import { render } from '@testing-library/react-native';
import { Marker } from 'react-native-maps';
import MarkDestinations from '../../App/Screens/RouteDisplay/MarkDestinations';
import AuthContext from '../../App/context/AuthContextProvider';

// Manually mock `react-native-maps`
jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  return {
    Marker: jest.fn().mockImplementation(({ children }) => <View>{children}</View>),
  };
});

describe('MarkDestinations', () => {
  const mockContextValue = {
    deliveryDetails: {
      visitOrder: "0,1,2,0", // Visit order including 0 for the post office
      destinations: [
        { lat: 40.7128, lng: -74.0060 }, // Post Office (Index 0)
        { lat: 40.730610, lng: -73.935242 }, // Location 1
        { lat: 40.7896239, lng: -73.9598939 }, // Location 2
      ],
    },
    currentIndexContext: 1, // Current destination index
  };

  it('renders the correct number of markers', () => {
    const { getAllByTestId } = render(
      <AuthContext.Provider value={mockContextValue}>
        <MarkDestinations />
      </AuthContext.Provider>
    );

    // Check if 3 markers are rendered
    const markers = getAllByTestId(/marker-/);
    expect(markers).toHaveLength(3);
  });

  it('highlights the current location with a yellow marker', () => {
    const { getByTestId } = render(
      <AuthContext.Provider value={mockContextValue}>
        <MarkDestinations />
      </AuthContext.Provider>
    );

    // Check if the marker with `currentIndexContext` is highlighted
    const currentMarker = getByTestId('marker-1'); // currentIndexContext is 1, which corresponds to Location 1
    expect(currentMarker.props.style).toContainEqual({ backgroundColor: 'yellow' });
  });
  

  it('renders the post office marker correctly', () => {
    const { getByTestId } = render(
      <AuthContext.Provider value={mockContextValue}>
        <MarkDestinations />
      </AuthContext.Provider>
    );
  
    // Check if the marker for the Post Office is rendered
    const postOfficeMarker = getByTestId('marker-0');
    expect(postOfficeMarker).toBeTruthy(); // Ensures the marker is rendered
  
    // Check if the FontAwesome icon for the Post Office is correctly rendered
    const postOfficeIcon = getByTestId('postOfficeIcon');
    expect(postOfficeIcon).toBeTruthy(); // Check if the icon for the Post Office is rendered
  });


  
});

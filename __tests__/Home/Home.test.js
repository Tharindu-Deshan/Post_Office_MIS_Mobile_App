import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import Home from "../../App/Screens/HomePage/Home";
import AuthContext from "../../App/context/AuthContextProvider";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation to mock
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import axios from 'axios'; // Mock axios for API call
import '@testing-library/jest-native/extend-expect';


// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)), // Return null to simulate no value in storage
  removeItem: jest.fn(),
}));

// Mock useNavigation
jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

// Mock axios for the data fetching
jest.mock('axios');

describe("Home Component", () => {
  const mockContextValue = {
    userId: 1,
    email: "test@test.com",
    userName: "Test User",
    setDeliveryDetails: jest.fn(),
    deliveryDetails: {
      status: "In Progress",
      destinations: [1, 2, 3],
    }, // Provide valid deliveryDetails to simulate a loaded state
    currentIndexContext: 1,
  };

  // Mock the navigation object
  beforeEach(() => {
    useNavigation.mockReturnValue({
      navigate: jest.fn(),
    });

    // Mock axios to simulate a successful API call
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: {
        status: "In Progress",
        destinations: [1, 2, 3],
      },
    });
  });

  it("should render the component and display the user's name and email", async () => {
    const { getByText, queryByTestId } = render(
      <AuthContext.Provider value={mockContextValue}>
        <Home />
      </AuthContext.Provider>
    );

    // Mock the loading state by simulating data load completion
    await waitFor(() => {
      // Ensure that the loading indicator is no longer rendered
      expect(queryByTestId('ActivityIndicator')).toBeNull();
    });

    // Wait for the text to appear
    await waitFor(() => {
      // Check that the user's name and email are displayed
      expect(getByText("Welcome, Test User!")).toBeTruthy();
      expect(getByText("Email: test@test.com")).toBeTruthy();
    });
  });

   // Add this new test case below to check if Explore Map button is disabled when delivery status is "Completed"
   it("should disable the Explore Map button when delivery status is Completed", async () => {
    const mockCompletedContext = {
      ...mockContextValue,
      deliveryDetails: { status: "Completed", destinations: [1, 2, 3] }, // Simulate completed delivery
    };
  
    const { getByTestId, queryByTestId } = render(
      <AuthContext.Provider value={mockCompletedContext}>
        <Home />
      </AuthContext.Provider>
    );
  
    // Ensure the loading state completes
    await waitFor(() => {
      expect(queryByTestId('ActivityIndicator')).toBeNull();
    });
  
    // Check if the Explore Map button is disabled using `toBeDisabled` matcher
    const exploreMapButton = getByTestId("explore-map-button");
    expect(exploreMapButton).toBeDisabled();
  });

  it("should enable the Explore Map button when delivery status is Assigned", async () => {
    const mockAssignedContext = {
      ...mockContextValue,
      deliveryDetails: { status: "Assigned", destinations: [1, 2, 3] }, // Simulate assigned delivery
    };
  
    const { getByTestId, queryByTestId } = render(
      <AuthContext.Provider value={mockAssignedContext}>
        <Home />
      </AuthContext.Provider>
    );
  
    // Ensure the loading state completes
    await waitFor(() => {
      expect(queryByTestId('ActivityIndicator')).toBeNull();
    });
  
    // Check if the Explore Map button is enabled
    const exploreMapButton = getByTestId("explore-map-button");
    expect(exploreMapButton).not.toBeDisabled(); // Check that it is NOT disabled
  });
  
  
  
  

});

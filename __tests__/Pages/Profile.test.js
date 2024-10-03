import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AuthContext, { AuthContextProvider } from "../../App/context/AuthContextProvider";
import Profile from "../../App/Screens/Profile/Profile";
// import Profile from "../Profile"; // Adjust the import path as needed
// import AuthContext from "../../context/AuthContextProvider";

// Mock the AuthContext to provide dummy user data for the test
const mockAuthContext = {
  userId: "12345",
  userName: "John Doe",
  email: "johndoe@example.com",
  handleLogout: jest.fn(), // Mock the logout function
};

describe("Profile Component", () => {
  test("renders user information and handles logout", () => {
    // Render the Profile component within the AuthContext provider
    const { getByText } = render(
      <AuthContextProvider value={mockAuthContext}>
        <Profile />
      </AuthContextProvider>
    );

    // Check if the user name, ID, and email are displayed
    expect(getByText("John Doe")).toBeTruthy(); // User Name
    expect(getByText("Postman ID : 12345")).toBeTruthy(); // User ID
    expect(getByText("johndoe@example.com")).toBeTruthy(); // Email

    // Check if the logout button is rendered and simulate a logout click
    const logoutButton = getByText("Logout");
    expect(logoutButton).toBeTruthy();
    fireEvent.press(logoutButton);

    // Verify if the handleLogout function is called
    expect(mockAuthContext.handleLogout).toHaveBeenCalled();
  });
});

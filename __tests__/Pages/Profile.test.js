import React from "react";
// import { render, screen,  } from "@testing-library/react-native";
import {
  render,
  screen,
  within,
  fireEvent,
} from "@testing-library/react-native";
// import Profile from "../Profile";
// import AuthContext from "../../context/AuthContextProvider";
import Profile from "../../App/Screens/Profile/Profile";
import AuthContext from "../../App/context/AuthContextProvider";

const mockLogout = jest.fn();

const authContextValue = {
  isLoggedIn: true,
  userId: "12345",
  userName: "John Doe",
  email: "johndoe@example.com",
  handleLogin: jest.fn(),
  handleLogout: mockLogout,
  deliveryDetails: { item: "Package 1", status: "Delivered" },
  setDeliveryDetails: jest.fn(),
  currentIndexContext: 1,
  setCurrentIndexContext: jest.fn(),
};

const renderComponent = () =>
  
  render(
    <AuthContext.Provider value={authContextValue}>
      <Profile />
    </AuthContext.Provider>
  );

describe("Profile Component", () => {
  it("calls the logout function when the logout button is pressed", () => {
    renderComponent();

    const logoutButton = screen.getByText("Logout");
    fireEvent.press(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it("renders the details section correctly", () => {
    renderComponent();

    const detailsSection = screen.getByTestId("detailsSection");
    expect(detailsSection).toBeTruthy();
  });

  it("renders user name, postman ID, contact, and email correctly in details section", () => {
    renderComponent();

    const detailsSection = screen.getByTestId("detailsSection");

    const userNameText =
      within(detailsSection).getByText(/User Name : John Doe/);
    expect(userNameText).toBeTruthy();

    const postmanIDText =
      within(detailsSection).getByText(/Postman ID : 12345/);
    expect(postmanIDText).toBeTruthy();

    const contactText = within(detailsSection).getByText(
      /Contact : 076 551 6789/
    );
    expect(contactText).toBeTruthy();

    const emailText = within(detailsSection).getByText(
      /Email : johndoe@example.com/
    );
    expect(emailText).toBeTruthy();
  });
});

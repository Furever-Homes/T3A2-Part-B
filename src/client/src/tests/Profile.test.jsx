import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Profile from "../pages/Profile";

// Mock Axios to prevent real API calls
jest.mock("axios");

beforeEach(() => {
  localStorage.setItem("token", "mockToken"); // Simulate a logged-in user
});

describe("Profile Page", () => {
  test("renders profile heading and logout button after loading", async () => {
    // Mock the API response for user profile
    axios.get.mockResolvedValueOnce({
      data: {
        name: "Test User",
        email: "test@example.com",
        admin: false,
      },
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    // Wait for profile data to load
    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    // Check if logout button is displayed
    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
  });
});

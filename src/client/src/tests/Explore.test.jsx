import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; // Provides extra matchers
import { BrowserRouter } from "react-router-dom";
import Explore from "../pages/Explore"; // Adjust path if needed
import axios from "axios";

// Mock the API request to avoid real backend dependency
jest.mock("axios");

describe("Explore Page", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test("renders Explore heading after pets load", async () => {
    // Mock API response with fake pet data
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, name: "Buddy", species: "Dog" },
        { id: 2, name: "Whiskers", species: "Cat" },
      ],
    });

    render(
      <BrowserRouter>
        <Explore />
      </BrowserRouter>
    );

    // Ensure the "Loading pets..." text appears first
    expect(screen.getByText(/Loading pets/i)).toBeInTheDocument();

    // Wait for the heading to appear
    await waitFor(() => {
        expect(screen.getByText("🐾 Explore Pets")).toBeInTheDocument();
    });
  });

  test("displays a list of pets once loaded", async () => {
    // Mock API response with fake pet data
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, name: "Buddy", species: "Dog" },
        { id: 2, name: "Whiskers", species: "Cat" },
      ],
    });

    render(
      <BrowserRouter>
        <Explore />
      </BrowserRouter>
    );

    // Wait for pet cards to appear
    await waitFor(() => {
      const petCards = screen.getAllByTestId("pet-card");
      expect(petCards.length).toBeGreaterThan(0);
    });
  });

  test("displays an error message if API call fails", async () => {
    // Simulate a failed API response
    axios.get.mockRejectedValueOnce(new Error("Network error"));

    render(
      <BrowserRouter>
        <Explore />
      </BrowserRouter>
    );

    // Wait for the error message to appear
    await waitFor(() => {
      expect(
        screen.getByText("Failed to load pets. Please try again later.")
      ).toBeInTheDocument();
    });
  });
});

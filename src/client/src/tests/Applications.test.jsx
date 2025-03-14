import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Applications from "../pages/Applications";

jest.mock("axios");

const mockApplications = [
  {
    _id: "1",
    pet: { name: "Buddy", image: "pet-image-url" },
    status: "Pending",
    createdAt: "2024-03-10T12:00:00Z",
    message: "I would love to adopt Buddy."
  },
];

describe("Applications Component", () => {
  beforeEach(() => {
    localStorage.setItem("token", "fake-token");
    axios.get.mockResolvedValueOnce({ data: mockApplications });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the Applications page correctly", async () => {
    render(
      <MemoryRouter>
        <Applications />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("📄 Adoption Applications")).toBeInTheDocument());
    expect(screen.getByText("Track the status of your applications.")).toBeInTheDocument();
  });

  test("displays user applications after fetching data", async () => {
    render(
      <MemoryRouter>
        <Applications />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Buddy")).toBeInTheDocument();
      expect(screen.getByText("Pending")).toBeInTheDocument();
      expect(screen.getByText("I would love to adopt Buddy.")).toBeInTheDocument();
    });
  });

  test("shows error message if user is not logged in", async () => {
    localStorage.removeItem("token");
    axios.get.mockRejectedValueOnce(new Error("You must be logged in to view applications."));
    
    render(
      <MemoryRouter>
        <Applications />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("You must be logged in to view applications.")).toBeInTheDocument());
  });

  test("handles application deletion", async () => {
    axios.delete.mockResolvedValueOnce({});
    window.confirm = jest.fn(() => true);

    render(
      <MemoryRouter>
        <Applications />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("❌ Remove Application"));

    fireEvent.click(screen.getByText("❌ Remove Application"));

    await waitFor(() => expect(axios.delete).toHaveBeenCalledWith(
      "http://localhost:5001/api/user/applications/1",
      { headers: { Authorization: "Bearer fake-token" } }
    ));
  });

  test("shows message when there are no applications", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(
      <MemoryRouter>
        <Applications />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("You haven't submitted any applications yet.")).toBeInTheDocument());
  });

  test("handles API failure gracefully", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed to load applications"));

    render(
      <MemoryRouter>
        <Applications />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Failed to load applications. Please try again.")).toBeInTheDocument());
  });
});
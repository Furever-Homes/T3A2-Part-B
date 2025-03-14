import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import ApplicationAdmin from "../pages/ApplicationAdmin";

jest.mock("axios");

// Mock useNavigate from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const mockApplications = [
  {
    _id: "1",
    user: { name: "John Doe", email: "johndoe@example.com", image: "user-image-url" },
    pet: { name: "Buddy", animalType: "Dog", age: 3, location: "Sydney", image: "pet-image-url", activityLevel: "High", status: "Pending" },
    message: "Looking for a loving home.",
    status: "Pending"
  },
];

describe("ApplicationAdmin Component", () => {
  beforeEach(() => {
    localStorage.setItem("token", "fake-token");

    // Mock API calls
    axios.get.mockResolvedValueOnce({ data: { admin: true } }); // Admin check
    axios.get.mockResolvedValueOnce({ data: mockApplications }); // Fetch applications

    // Mock alert
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the ApplicationAdmin page correctly", async () => {
    render(
      <MemoryRouter>
        <ApplicationAdmin />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("📂 Admin: All Applications")).toBeInTheDocument());
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Buddy (Dog)")).toBeInTheDocument();
  });

  test("handles application approval", async () => {
    axios.put.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <ApplicationAdmin />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Approve"));

    fireEvent.click(screen.getByText("Approve"));

    await waitFor(() => expect(axios.put).toHaveBeenCalledWith(
      "http://localhost:5001/api/admin/applications/1/approve",
      {},
      { headers: { Authorization: "Bearer fake-token" } }
    ));
  });

  test("handles application rejection", async () => {
    axios.put.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <ApplicationAdmin />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Reject"));

    fireEvent.click(screen.getByText("Reject"));

    await waitFor(() => expect(axios.put).toHaveBeenCalledWith(
      "http://localhost:5001/api/admin/applications/1/reject",
      {},
      { headers: { Authorization: "Bearer fake-token" } }
    ));
  });

  test("handles application deletion", async () => {
    axios.delete.mockResolvedValueOnce({});
    window.confirm = jest.fn(() => true);

    render(
      <MemoryRouter>
        <ApplicationAdmin />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Delete Application"));

    fireEvent.click(screen.getByText("Delete Application"));

    await waitFor(() => expect(axios.delete).toHaveBeenCalledWith(
      "http://localhost:5001/api/admin/applications/1",
      { headers: { Authorization: "Bearer fake-token" } }
    ));
  });

  test("redirects non-admin users away from the page", async () => {
    axios.get.mockResolvedValueOnce({ data: { admin: false } });

    render(
      <MemoryRouter>
        <ApplicationAdmin />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Loading...")).toBeInTheDocument());
  });

  test("handles API failure gracefully", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed to load applications"));

    render(
      <MemoryRouter>
        <ApplicationAdmin />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText("Failed to load applications. Please try again.")));
  });
});

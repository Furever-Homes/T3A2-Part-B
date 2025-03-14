import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Adopt from "../pages/Adopt";

jest.mock("axios");

describe("Adopt Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders adopt heading", () => {
    render(
      <BrowserRouter>
        <Adopt />
      </BrowserRouter>
    );

    expect(screen.getByText("🐾 Adopt a Pet")).toBeInTheDocument();
  });

  test("fetches and displays pets", async () => {
    axios.get.mockResolvedValue({
      data: [
        { id: 1, name: "Buddy", age: 3, type: "dog", breed: "Labrador", photo: "/buddy.jpg" },
        { id: 2, name: "Whiskers", age: 2, type: "cat", breed: "Siamese", photo: "/whiskers.jpg" },
      ],
    });

    render(
      <BrowserRouter>
        <Adopt />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Buddy")).toBeInTheDocument();
      expect(screen.getByText("Whiskers")).toBeInTheDocument();
    });

    expect(screen.getByText("Age: 3 years")).toBeInTheDocument();
    expect(screen.getByText("Age: 2 years")).toBeInTheDocument();
  });

  test("filters pets by category", async () => {
    axios.get.mockResolvedValue({
      data: [
        { id: 1, name: "Buddy", age: 3, type: "dog", breed: "Labrador", photo: "/buddy.jpg" },
        { id: 2, name: "Whiskers", age: 2, type: "cat", breed: "Siamese", photo: "/whiskers.jpg" },
      ],
    });

    render(
      <BrowserRouter>
        <Adopt />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Buddy"));

    fireEvent.click(screen.getByText("Dogs"));
    expect(screen.getByText("Buddy")).toBeInTheDocument();
    expect(screen.queryByText("Whiskers")).not.toBeInTheDocument();
  });

  test("clicking 'View Details' navigates to pet details page", async () => {
    axios.get.mockResolvedValue({
      data: [{ id: 1, name: "Buddy", age: 3, type: "dog", breed: "Labrador", photo: "/buddy.jpg" }],
    });

    render(
      <BrowserRouter>
        <Adopt />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Buddy"));

    const viewDetailsButton = screen.getByText("View Details");
    expect(viewDetailsButton).toHaveAttribute("href", "/pet/1");
  });
});

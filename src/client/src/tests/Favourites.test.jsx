import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Favourites from "../pages/Favourites";

jest.mock("axios");

describe("Favourites Page", () => {
  const mockPets = [
    {
      _id: "1",
      name: "Buddy",
      age: 3,
      animalType: "Dog",
      image: "buddy.jpg",
    },
    {
      _id: "2",
      name: "Whiskers",
      age: 2,
      animalType: "Cat",
      image: "whiskers.jpg",
    },
  ];

  beforeEach(() => {
    localStorage.setItem("token", "mocked-token");
    axios.get.mockResolvedValue({ data: { favourites: mockPets } });
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("renders Favourites heading", async () => {
    render(
      <BrowserRouter>
        <Favourites />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("⭐ Your Favourited Pets")).toBeInTheDocument();
    });
  });

  test("displays favourite pets", async () => {
    render(
      <BrowserRouter>
        <Favourites />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Buddy")).toBeInTheDocument();
      expect(screen.getByText("Whiskers")).toBeInTheDocument();
    });
  });

  test("removes a pet from favourites", async () => {
    render(
      <BrowserRouter>
        <Favourites />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Buddy"));

    const removeButton = screen.getAllByText("❌ Remove")[0];
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText("Buddy")).not.toBeInTheDocument();
    });
  });
});

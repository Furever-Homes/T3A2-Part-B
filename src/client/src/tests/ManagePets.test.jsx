import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import ManagePets from "../pages/ManagePets";

jest.mock("axios");

describe("ManagePets Page", () => {
  const mockPets = [
    { _id: "1", name: "Buddy", age: 3, animalType: "Dog", image: "buddy.jpg" },
    { _id: "2", name: "Whiskers", age: 2, animalType: "Cat", image: "whiskers.jpg" },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockPets });

    // 🔧 Mock window.confirm to always return true
    global.confirm = jest.fn(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders Manage Pets heading", async () => {
    render(
      <BrowserRouter>
        <ManagePets />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("🐾 Manage Pets")).toBeInTheDocument();
    });
  });

  test("displays list of pets", async () => {
    render(
      <BrowserRouter>
        <ManagePets />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Buddy")).toBeInTheDocument();
      expect(screen.getByText("Whiskers")).toBeInTheDocument();
    });
  });

  test("adds a new pet", async () => {
    axios.post.mockResolvedValue({
      data: { _id: "3", name: "Charlie", age: 1, animalType: "Dog", image: "charlie.jpg" },
    });

    render(
      <BrowserRouter>
        <ManagePets />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Pet Name"), {
      target: { value: "Charlie" },
    });
    fireEvent.change(screen.getByPlaceholderText("Age"), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByText("Add Pet"));

    await waitFor(() => {
      expect(screen.getByText("Charlie")).toBeInTheDocument();
    });
  });

  test("deletes a pet", async () => {
    axios.delete.mockResolvedValue({});

    render(
      <BrowserRouter>
        <ManagePets />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText("Buddy"));

    // 🔧 Now confirm will always return true, allowing the delete process to continue
    fireEvent.click(screen.getAllByText("🗑 Delete")[0]);

    await waitFor(() => {
      expect(screen.queryByText("Buddy")).not.toBeInTheDocument();
    });
  });
});

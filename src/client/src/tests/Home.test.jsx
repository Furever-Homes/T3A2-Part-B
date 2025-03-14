import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import Home from "../pages/Home";

describe("Home Page", () => {
  test("renders welcome message and buttons", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Check if the heading is displayed
    expect(screen.getByText("🐾 Welcome to Furever Homes")).toBeInTheDocument();

    // Check if the buttons are displayed
    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign Up" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "🐶 Explore Pets 🐱" })).toBeInTheDocument();
  });
});

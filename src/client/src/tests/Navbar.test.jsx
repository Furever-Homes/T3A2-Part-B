import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../components/Navbar";

describe("Navbar Component", () => {
  test("renders site logo and navigation links", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Match logo by checking full text content, since it's broken into separate elements
    expect(
      screen.getByText((_, element) => element.textContent === "Furever H🐾mes")
    ).toBeInTheDocument();

    // Check if navigation links are displayed
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("Favourites")).toBeInTheDocument();
    expect(screen.getByText("Applications")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });
});

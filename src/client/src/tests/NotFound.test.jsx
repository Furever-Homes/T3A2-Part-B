import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NotFound from "../pages/NotFound";

describe("Not Found Page", () => {
  test("renders 404 message", () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText("🚫 404 - Page Not Found")).toBeInTheDocument();
    expect(screen.getByText("Sorry, the page you're looking for doesn't exist.")).toBeInTheDocument();
  });

  test("has a link to go back home", () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText("Go Back Home")).toHaveAttribute("href", "/");
  });
});

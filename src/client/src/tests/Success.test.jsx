import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Success from "../pages/Success";

describe("Success Page", () => {
  test("renders success message", () => {
    render(
      <BrowserRouter>
        <Success />
      </BrowserRouter>
    );

    expect(screen.getByText("🎉 Application Submitted!")).toBeInTheDocument();
    expect(screen.getByText("Thank you for applying to adopt. The shelter will review your application soon.")).toBeInTheDocument();
  });

  test("has a link to explore more pets", () => {
    render(
      <BrowserRouter>
        <Success />
      </BrowserRouter>
    );

    expect(screen.getByText("Explore More Pets")).toHaveAttribute("href", "/explore");
  });
});

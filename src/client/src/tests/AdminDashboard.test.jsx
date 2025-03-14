import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";

describe("AdminDashboard Page", () => {
  test("renders Admin Dashboard heading", () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText("⚙️ Admin Dashboard")).toBeInTheDocument();
  });
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Login from "../pages/Login";

jest.mock("axios");

describe("Login Page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders login heading", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText("🔑 Login")).toBeInTheDocument();
  });

  test("allows user to type email and password", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "admin@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("admin@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("logs in successfully and redirects", async () => {
    axios.post.mockResolvedValue({ data: { token: "mocked-token" } });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "admin@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("mocked-token");
    });
  });

  test("displays error on failed login", async () => {
    axios.post.mockRejectedValue({ response: { data: { message: "Invalid email or password." } } });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "wrong@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "wrongpass" } });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password.")).toBeInTheDocument();
    });
  });
});

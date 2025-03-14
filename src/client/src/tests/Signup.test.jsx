import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Signup from "../pages/Signup";

jest.mock("axios");

describe("Signup Page", () => {
  test("renders signup heading", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    expect(screen.getByText("📝 Sign Up")).toBeInTheDocument();
  });

  test("allows user to type name, email, and password", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });

    expect(screen.getByPlaceholderText("Full Name").value).toBe("John Doe");
    expect(screen.getByPlaceholderText("Email").value).toBe("john@example.com");
    expect(screen.getByPlaceholderText("Password").value).toBe("password123");
  });

  test("signs up successfully and redirects", async () => {
    axios.post.mockResolvedValue({});

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });

    fireEvent.click(screen.getByText("Sign Up"));

    await waitFor(() => {
      expect(screen.getByText("Signup successful! Redirecting to login...")).toBeInTheDocument();
    });
  });

  test("displays error on failed signup", async () => {
    axios.post.mockRejectedValue({ response: { data: { message: "Email already in use." } } });

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });

    fireEvent.click(screen.getByText("Sign Up"));

    await waitFor(() => {
      expect(screen.getByText("Email already in use.")).toBeInTheDocument();
    });
  });
});

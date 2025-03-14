import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; 
import Footer from "../components/Footer"; 



describe("Footer Component", () => {
  test("renders contact phone and email correctly", () => {
    render(<Footer />);

    // Check if contact phone is rendered
    expect(screen.getByText("📞 Contact us:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /\+1 \(234\) 567-89/ })).toBeInTheDocument();

    // Check if email is rendered
    expect(screen.getByText("📧 Email:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /contact@fureverhomes.com.au/ })).toBeInTheDocument();
  });
});

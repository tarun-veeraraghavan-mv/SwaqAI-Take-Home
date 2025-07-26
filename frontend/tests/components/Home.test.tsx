import React from "react";
import { describe } from "node:test";
import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/page";

describe("Home", () => {
  it("should render the heading and subtext properly", () => {
    render(<Home />);

    expect(screen.getByText(/select channels/i)).toBeInTheDocument();
  });
});

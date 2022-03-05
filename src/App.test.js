import React from "react";
import ReactDOM from "react-dom";
import { render, screen, cleanup } from "@testing-library/react";
import renderer from "react-test-renderer";
import App from "./App";

afterEach(() => {
  cleanup();
});

it("it renders a table", () => {
  render(<App />);
  const tableBody = screen.getByTestId("tableBody");
  expect(tableBody).toBeInTheDocument();
});

it("The table includes data from the provided JSON object", () => {
  render(<App />);
  const firstCreditor = screen.getByTestId("debt1Creditor");
  expect(firstCreditor).toHaveTextContent("CBNA");
});

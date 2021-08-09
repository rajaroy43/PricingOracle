import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders Lithium Finance in header", () => {
  const { getAllByText } = render(<App />);
  const textElements = getAllByText(/Lithium Finance/i);
  expect(textElements.length).toBeTruthy();
});

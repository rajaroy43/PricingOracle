import React from "react";
import { render } from "@testing-library/react";
import NavMenuItem from "./NavMenuItem";
import { HashRouter } from "react-router-dom";

test("renders NavMenuItem", () => {
  const testProps = {
    id: 'testId',
    label: 'Test Item',
    url: '/test-endpoint',
    shouldRender: true,
    isActive: false
  }
  const { getByText } = render(
    <HashRouter>
      <NavMenuItem {...testProps} />
    </HashRouter>
  );
  const searhText = `${testProps.label}`
  const textElement = getByText(/Test Item/i);
  expect(textElement).toBeTruthy();
});
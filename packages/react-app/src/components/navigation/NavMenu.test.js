import React from "react";
import { render } from "@testing-library/react";
import NavMenu from "./NavMenu";
import { HashRouter } from "react-router-dom";

const navWalletConneced = {
  isWalletConnected: true,
  walletAddress: '0x1234',
  activePage: 'Dashboard' 
}

const navWalletNotConneced = {
  isWalletConnected: false,
  walletAddress: null,
  activePage: 'Dashboard' 
}



test("renders NavMenu when wallet connected", () => {

  const { getByText } = render(
    <HashRouter>
      <NavMenu {...navWalletConneced} />
    </HashRouter>
  );
  const dashboard = getByText(/Dashboard/);
  expect(dashboard).toBeTruthy();

  const avaialableSets = getByText(/Available Questions/);
  expect(avaialableSets).toBeTruthy();
});


test("renders NavMenu when wallet not connected", () => {

  const { getByText, queryByText } = render(
    <HashRouter>
      <NavMenu {...navWalletNotConneced} />
    </HashRouter>
  );
  const dashboard = queryByText(/Dashboard/);
  expect(dashboard).toBeFalsy();

  const avaialableSets = getByText(/Available Questions/);
  expect(avaialableSets).toBeTruthy();
});
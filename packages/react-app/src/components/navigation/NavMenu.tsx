import React from 'react'
import { GetNavItemParams, NavMenuParams, NavItemParams, GetIsActive } from '../../types/navigation'
import Box from '../atoms/Box'
import NavMenuItem from './NavMenuItem'


const  prepareNavItem = (
  menuProps: NavMenuParams, itemProps: GetNavItemParams
): NavItemParams => {
  return {
    id: itemProps.id,
    label: itemProps.label,
    url: itemProps.getUrl(menuProps),
    shouldRender: itemProps.getShouldRender(menuProps),
    isActive: itemProps.getIsActive(menuProps, itemProps)
  }
}

const getIsActive: GetIsActive = (menuProps, itemProps) => {
  return menuProps.activePage === itemProps.id
}

export const baseMenuItem = {
  getIsActive
}

const navItems: GetNavItemParams[] = [
  {
    ...baseMenuItem,
    id: 'dashboard',
    label: 'Dashboard',
    getUrl: (params) => {
      return params.isWalletConnected ?
        `/account/${params.walletAddress}`
        :
        '/'
    },
    getShouldRender: (params) => {
      return params.isWalletConnected
    },

  },
  {
    ...baseMenuItem,
    id: 'available_sets',
    label: 'Available Questions',
    getUrl: (params) => {
      return params.isWalletConnected ?
        `/available-sets/${params.walletAddress}`
        :
        '/'
    },
    getShouldRender: (_) => {
      return true
    },
  }
]

const NavMenu = (props: NavMenuParams) => {
  const preppedItems = navItems.map(item => prepareNavItem(props, item))
  return (
    <Box flexDirection="column">
      {preppedItems.map(navItem => <NavMenuItem key={navItem.id} {...navItem} />)}
    </Box>
  )
}

export default NavMenu
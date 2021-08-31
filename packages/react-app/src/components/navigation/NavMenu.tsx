import React from 'react'
import { GetNavItemParams, NavMenuParams, NavItemParams, GetIsActive } from '../../types/navigation'
import { makeStyles } from '@material-ui/core/styles';
import Box from '../atoms/Box'
import NavMenuItem from './NavMenuItem'

const  prepareNavItem = (
  menuProps: NavMenuParams, itemProps: GetNavItemParams
): NavItemParams => {
  return {
    id: itemProps.id,
    icon: itemProps.icon,
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
    id: 'account',
    icon: 'nav-icon-dashboard',
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
    icon: 'nav-icon-available-sets',
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
  },
  {
    ...baseMenuItem,
    id: 'upcoming_questions',
    icon: 'nav-icon-upcoming-questions',
    label: 'Upcoming Questions',
    getUrl: (params) => {
      return params.isWalletConnected ?
        `/upcoming-questions/${params.walletAddress}`
        :
        '/'
    },
    getShouldRender: (_) => {
      return true
    },
  },
  {
    ...baseMenuItem,
    id: 'history',
    icon: 'nav-icon-history',
    label: 'History / My Answers',
    getUrl: (params) => {
      return params.isWalletConnected ?
        `/history/${params.walletAddress}`
        :
        '/'
    },
    getShouldRender: (_) => {
      return true
    },
  },
  {
    ...baseMenuItem,
    id: 'stats',
    icon: 'nav-icon-stats',
    label: 'Stats / My Profile',
    getUrl: (params) => {
      return params.isWalletConnected ?
        `/stats/${params.walletAddress}`
        :
        '/'
    },
    getShouldRender: (_) => {
      return true
    },
  },
  {
    ...baseMenuItem,
    id: 'staking',
    icon: 'nav-icon-staking',
    label: 'Staking',
    getUrl: (params) => {
      return params.isWalletConnected ?
        `/staking/${params.walletAddress}`
        :
        '/'
    },
    getShouldRender: (_) => {
      return true
    },
  }    
]

const useStyles = makeStyles(theme => ({
  navMenus: {
    margin: 0,
    padding: '16px 0 0 0'
  },
}));  

const NavMenu = (props: NavMenuParams) => {  
  const classes = useStyles();

  const preppedItems = navItems.map(item => prepareNavItem(props, item))
  return (
    <Box flexDirection="column" className={classes.navMenus}>
      {preppedItems.map(navItem => (
          <NavMenuItem key={navItem.id} {...navItem} />
      ))}
    </Box>
  )
}

export default NavMenu
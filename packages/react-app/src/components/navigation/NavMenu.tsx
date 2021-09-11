import React from 'react'
import { GetNavItemParams, NavMenuParams, NavItemParams, PageParams } from '../../types/navigation'
import { makeStyles } from '@material-ui/core/styles';
import Box from '../atoms/Box'
import NavMenuItem from './NavMenuItem'
import { SwipeableDrawer, useMediaQuery, useTheme } from '@material-ui/core';
import NavMenuItemMobile from './NavMenuItemMobile';


const useStyles = makeStyles(theme => ({
  navMenus: {
    margin: 0,
    padding: '16px 0 0 0'
  },
  navMenuMobile: {
    backgroundColor: '#222222',
    padding: '16px'
  },
  spacer: {
    marginTop: '64px'
  }
})); 

const  prepareNavItem = (menuProps: PageParams, itemProps: GetNavItemParams): NavItemParams => {
  return {
    id: itemProps.id,
    icon: itemProps.icon,
    label: itemProps.label,
    url: itemProps.getUrl(menuProps),
    shouldRender: itemProps.getShouldRender(menuProps),
    isActive: itemProps.getIsActive(menuProps, itemProps),
  }
} 

const NavMenu = (props: NavMenuParams) => {
  const classes = useStyles();
  const theme = useTheme();
  const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const preppedItems = props.getNavItems.map(item => prepareNavItem(props.pageParams, item));

  const fullMenu = (
    <Box flexDirection="column" className={classes.navMenus}>
      {preppedItems.map(navItem => (
          <NavMenuItem key={navItem.id} {...navItem} />
      ))}
    </Box>
  )

  const mobileMenu = (
    <SwipeableDrawer
      anchor="right"
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      open={props.isDrawerOpen}
      onClose={() => props.setDrawerOpen(false)}
      onOpen={() => props.setDrawerOpen(true)}
      classes={{ paper: classes.navMenuMobile}}
    >
      <div className={classes.spacer}></div>
      {preppedItems.map(navItem => (
        <NavMenuItemMobile key={navItem.id} {...navItem} />
      ))}
    </SwipeableDrawer>
  )

  const displayMenu = isMobile ? mobileMenu : fullMenu;

  console.log('displayMenu', displayMenu);

  return displayMenu;
}

export default NavMenu
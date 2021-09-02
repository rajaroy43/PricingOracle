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
    isActive: itemProps.getIsActive(menuProps, itemProps),
  }
}

const useStyles = makeStyles(theme => ({
  navMenus: {
    margin: 0,
    padding: '16px 0 0 0'
  },
}));  

const NavMenu = (props: NavMenuParams) => {  
  const classes = useStyles();

  const preppedItems = props.getNavItems.map(item => prepareNavItem(props, item))
  return (
    <Box flexDirection="column" className={classes.navMenus}>
      {preppedItems.map(navItem => (
          <NavMenuItem key={navItem.id} {...navItem} />
      ))}
    </Box>
  )
}

export default NavMenu
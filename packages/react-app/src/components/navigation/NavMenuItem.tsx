import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { NavItemParams } from '../../types/navigation'

const useStyles = makeStyles(theme => ({
  navMenuItem: {
    alignItems: 'center',
    color: '#fff',
    display: 'flex',
    fontFamily: '16px',
    fontWeight: 600,
    height: '33px',
    margin: 0,
    padding: '0 8px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    width: 'min-content',
    "&&:hover > span, &&:hover > img": {
      filter: 'brightness(0) saturate(100%) invert(57%) sepia(76%) saturate(4201%) hue-rotate(341deg) brightness(96%) contrast(90%)'
    },
    "&&:hover": {
      backgroundColor: '#fff'
    }
  },
  navMenuItemIcon: {
    marginRight: '6px !important'
  },
  navMenuItemActive: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    color: '#e96036',
    display: 'flex',
    fontFamily: '16px',
    fontWeight: 600,
    height: '33px',
    margin: 0,
    padding: '0 8px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    width: 'min-content',
    "&& > img": {
      filter: 'brightness(0) saturate(100%) invert(57%) sepia(76%) saturate(4201%) hue-rotate(341deg) brightness(96%) contrast(90%)'
    },
  }
}));

const NavMenuItem = (item: NavItemParams) => {
  const classes = useStyles();
  const itemClass = item.isActive ? classes.navMenuItemActive : classes.navMenuItem;
  const icon = require(`../../assets/${item.icon}.svg`)

  return (
    item.shouldRender ? 
      <RouterLink to={item.url} className={itemClass}>
        <img className={classes.navMenuItemIcon} src={icon.default} alt={`${item.label}`} /><span>{item.label}</span>
      </RouterLink>
      :
      null
  )
}

export default NavMenuItem
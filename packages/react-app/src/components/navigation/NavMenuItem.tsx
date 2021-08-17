import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { NavItemParams } from '../../types/navigation'


const NavMenuItem = (item: NavItemParams) => {
  return (
    item.shouldRender ? 
      <RouterLink to={item.url}>
        <div style={{ marginTop: '1em'}}>{item.label}</div>
      </RouterLink>
      :
      null
  )
}

export default NavMenuItem
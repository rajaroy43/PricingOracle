import React from 'react'
import Button from '@material-ui/core/Button'

const _Button = ({onClick = () => {}, label, type = 'button', disabled = false, variant = 'contained',  style = {}, className = ''}) =>
  <Button variant={variant} onClick={onClick} color="primary" type={type} disabled={disabled} style={style} className={className} disableElevation>
    {label}
  </Button>

export default _Button

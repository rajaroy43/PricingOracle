import React from 'react'
import MUButton from '@material-ui/core/Button'

const Button = ({onClick = () => {}, label, type = 'button', disabled = false, variant = 'contained',  style = {}, className = ''}) =>
  <MUButton variant={variant} onClick={onClick} color="primary" type={type} disabled={disabled} style={style} className={className} disableElevation>
    {label}
  </MUButton>

export default Button

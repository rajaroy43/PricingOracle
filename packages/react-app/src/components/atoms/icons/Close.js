import React from 'react'
import CloseIcon from '@material-ui/icons/Close'

const CloseIcon = (props) => {
  const fontSize = props.size || "medium"
  const color = props.color || "primary"
  return (
    <CloseIcon
      fontSize={fontSize}
      color={color}
      onClick={props.onClick}
    />
  )
}

export default CloseIcon
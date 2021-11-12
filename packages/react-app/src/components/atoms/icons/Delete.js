import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete'

const CloseIcon = (props) => {
  const fontSize = props.size || "medium"
  const color = props.color || "primary"
  return (
    <DeleteIcon
      fontSize={fontSize}
      color={color}
      onClick={props.onClick}
    />
  )
}

export default DeleteIcon
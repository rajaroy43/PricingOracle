import React from 'react'
import Base from './Base'

const Account = ({match}) => {
  const urlAddress = match.params.address
  return (

    <Base>
    <div> Welcome to Lithium {urlAddress}</div>
    </Base>
   
  
    
  )
}

export default Account
import React from 'react'

const Address = ({ address, className="", length }) => (
  <div title={address} className={className}>
    {length ? `${address.slice(0, length+2)}...${address.slice(length*-1)}`: address}
  </div>
)

export default Address
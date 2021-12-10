import React from 'react'
import config from '../../config'

const BidExplorerLink = ({txHash}: {txHash: string}) => (
  <a target="_blank" rel="noreferrer" href={config.getTxExplorerUrl(txHash)}>View Tx</a>
)

export default BidExplorerLink
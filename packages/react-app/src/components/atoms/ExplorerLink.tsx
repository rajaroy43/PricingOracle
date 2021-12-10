import React from 'react'
import config from '../../config'

const ExplorerLink = ({txHash}: {txHash: string}) => (
  <a target="_blank" rel="noreferrer" href={config.getTxExplorerUrl(txHash)}>{txHash}</a>
)

export default ExplorerLink
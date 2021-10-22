import React from 'react'
import config from '../../config'
import Flex from '../atoms/Flex'
import ApproveLithiumPricingForm from '../forms/ApproveLithiumPricing'

const MAX_APPROVE = '10000000000'

const UserInputRow = ({connectedWallet, pricingIsApproved}: {connectedWallet: any, pricingIsApproved: boolean}) => {
  return (
    <Flex justifyContent='space-around'>
      { !pricingIsApproved && 
        <ApproveLithiumPricingForm
        connectedAddress={connectedWallet.address}
        tokenInstance={connectedWallet.tokenInstance}
        pricingAddress={config.LITHIUM_PRICING_ADDRESS}
        value={MAX_APPROVE}
        />
      }
    </Flex>
  )
  }


export default UserInputRow
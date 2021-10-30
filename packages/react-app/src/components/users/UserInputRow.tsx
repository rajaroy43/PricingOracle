import React from 'react'
import Flex from '../atoms/Flex'
import ApproveLithiumPricingForm from '../forms/ApproveLithiumPricing'

const UserInputRow = ({pricingIsApproved, connectedWallet}: {pricingIsApproved: boolean, connectedWallet: any}) => {

  return (
    <Flex justifyContent='space-around'>
      { !pricingIsApproved && 
        <ApproveLithiumPricingForm wallet={connectedWallet} />
      }
    </Flex>
  )
  }


export default UserInputRow
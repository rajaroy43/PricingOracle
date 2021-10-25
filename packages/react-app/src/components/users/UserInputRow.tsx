import React from 'react'
import Flex from '../atoms/Flex'
import ApproveLithiumPricingForm from '../forms/ApproveLithiumPricing'

const UserInputRow = ({pricingIsApproved}: {pricingIsApproved: boolean}) => {
  return (
    <Flex justifyContent='space-around'>
      { !pricingIsApproved && 
        <ApproveLithiumPricingForm />
      }
    </Flex>
  )
  }


export default UserInputRow
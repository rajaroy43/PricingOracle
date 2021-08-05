import React from 'react'
import LithiumPricingAddress from '../../contracts/LithiumPricing.address'
import Flex from '../atoms/Flex'
import ApproveLithiumPricingForm from '../forms/ApproveLithiumPricing'
import CreateQuestionForm from '../forms/CreateQuestion'

const MAX_APPROVE = '10000000000'

const UserInputRow = ({connectedWallet, pricingIsApproved}: {connectedWallet: any, pricingIsApproved: boolean}) => {
  return (
    <Flex justifyContent='space-around'>
      { !pricingIsApproved && 
        <ApproveLithiumPricingForm
        connectedAddress={connectedWallet.address}
        tokenInstance={connectedWallet.tokenInstance}
        pricingAddress={LithiumPricingAddress}
        value={MAX_APPROVE}
        />
      }
      <CreateQuestionForm
        connectedAddress={connectedWallet.address}
        pricingInstance={connectedWallet.pricingInstance}
        categoryId='0'
      />
    </Flex>
  )
  }


export default UserInputRow
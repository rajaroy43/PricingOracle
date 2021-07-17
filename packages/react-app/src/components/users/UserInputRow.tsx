import React from 'react'
import Flex from '../atoms/Flex'
import CreateQuestionForm from '../forms/CreateQuestion'


const UserInputRow = ({connectedWallet}: {connectedWallet: any}) => (
  <Flex>
    <CreateQuestionForm
      connectedAddress={connectedWallet.address}
      pricingInstance={connectedWallet.pricingInstance}
      categoryId='0'
    />
  </Flex>
)


export default UserInputRow
import React from 'react'
import { Form } from 'formik'
import Web3Form from '../formikTLDR/forms/Web3Form'
import Button from '../atoms/inputs/buttons/Button'
import { approveSchema } from '../../schemas/approve'
import { SuccessProps } from '../formikTLDR/types'
import ExplorerLink from '../atoms/ExplorerLink'

const getForm = (isDisabled: boolean) => (submit: any) => (
  <Form>
     
    <Button
      label="Claim Reward"
      onClick={submit}
      disabled={isDisabled}
    />
  </Form>
)

const Success = ({receipt}: SuccessProps) => (
  <div>
      <h3>Reward Claimed!</h3>
      <h5>Tx Confirmed</h5>
      <ExplorerLink txHash={receipt.transactionHash} />
  </div>
)

const getMethodArgs = (answerGroupIds: string[]) => (_: any) => {
  // TODO update contract method to accept an array of ids
  return [answerGroupIds]
}

const ClaimRewardForm = ({ connectedAddress, pricingInstance, answerGroupIds, isDisabled }: any) => {
  const formProps = {
    defaultValues: approveSchema.defaultValues,
    schema: approveSchema.schema,
    getForm: getForm(isDisabled),
    contractMethod: pricingInstance.methods.claimRewards,
    connectedAddress,
    getMethodArgs: getMethodArgs(answerGroupIds),
    stateEls: {
      SuccessEl: Success
    },
    formOnSuccess: false,
    updaters: {}
  }
  return (
    <Web3Form
      formProps={{...formProps}}
    />
  )
}

export default ClaimRewardForm
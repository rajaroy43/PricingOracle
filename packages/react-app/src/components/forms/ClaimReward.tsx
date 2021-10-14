import React from 'react'
import { Form } from 'formik'
import Web3Form from '../formikTLDR/forms/Web3Form'
import Button from '../atoms/inputs/buttons/Button'
import Modal from '../atoms/Modal'
import { approveSchema } from '../../schemas/approve'

const Success = () => (
  <div>
    <h3>Lithium Pricing Approved!</h3>
  </div>
)

const getForm = (isDisabled: boolean) => (submit: any, isValid: boolean) => (
  <Form>
     
    <Button
      label="Claim Reward"
      onClick={submit}
      disabled={isDisabled}
    />
  </Form>
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
      successEl: Success
    },
    formOnSuccess: false,
    onSuccess: null
  }
  return (
    <Web3Form
      formProps={{...formProps}}
    />
  )
}

export default ClaimRewardForm
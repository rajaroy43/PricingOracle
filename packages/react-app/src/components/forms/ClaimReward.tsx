import React from 'react'
import { Form } from 'formik'
import Web3Form from '../formikTLDR/forms/Web3Form'
import Button from '../atoms/inputs/buttons/Button'
import Modal from '../atoms/Modal'
import { parseUnits } from '../../helpers/formatters'
import { approveSchema } from '../../schemas/approve'

const Success = () => (
  <div>
    <h3>Lithium Pricing Approved!</h3>
  </div>
)

const getForm = () => (submit: any, isValid: boolean) => (
  <Form>
     
    <Button
      label="ClaimReward"
      onClick={submit}
      disabled={!isValid}
    />
  </Form>
)

const getMethodArgs = (questionId: string) => (_: any) => {
  return [[questionId]]
}

const ClaimRewardForm = ({ connectedAddress, pricingInstance, questionId }: any) => {
  const formProps = {
    defaultValues: approveSchema.defaultValues,
    schema: approveSchema.schema,
    getForm: getForm(),
    contractMethod: pricingInstance.methods.claimRewards,
    connectedAddress,
    getMethodArgs: getMethodArgs(questionId),
    stateEls: {
      successEl: Success
    },
    formOnSuccess: false,
    onSuccess: null
  }
  return (
    <Modal
      triggerText='Claim Reward'
      title=''
      contentText=''
      getForm={(cancelForm: any) => {
        return (
          <Web3Form
            formProps={{...formProps, cancelForm}}
          />
        )
      }}
    />
  )
}

export default ClaimRewardForm
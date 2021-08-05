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
      label="Submit Approval"
      onClick={submit}
      disabled={!isValid}
    />
  </Form>
)

const getMethodArgs = (pricingAddress: string, value: string) => (_: any) => {
  return [pricingAddress, parseUnits(value)]
}

const ApproveLithiumPricingForm = ({ connectedAddress, tokenInstance, pricingAddress, value }: any) => {
  const formProps = {
    defaultValues: approveSchema.defaultValues,
    schema: approveSchema.schema,
    getForm: getForm(),
    contractMethod: tokenInstance.methods.approve,
    connectedAddress,
    getMethodArgs: getMethodArgs(pricingAddress, value),
    stateEls: {
      successEl: Success
    },
    formOnSuccess: false,
    onSuccess: null
  }
  return (
    <Modal
      triggerText='Approve Lithium Pricing'
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

export default ApproveLithiumPricingForm
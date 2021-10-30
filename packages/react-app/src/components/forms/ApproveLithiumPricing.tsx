import React from 'react'
import { Form } from 'formik'
import { BigNumber } from 'ethers'
import Web3Form from '../formikTLDR/forms/Web3Form'
import Button from '../atoms/inputs/buttons/Button'
import Modal from '../atoms/Modal'
import { parseUnits } from '../../helpers/formatters'
import { approveSchema } from '../../schemas/approve'
import config from '../../config'
import { PendingProps, SuccessProps } from '../formikTLDR/types'

const MAX_APPROVE = BigNumber.from(2).pow(256).toString()

const Pending = ({ txHash }: PendingProps) => (
  <div>
    <h3>Lithium Pricing Approved!</h3>
    <div>{txHash}</div>
  </div>
)

const Success = ({receipt}: SuccessProps) => (
  <div>
      <h3>Pricing Approved!</h3>
      {receipt.txHash}
  </div>
)

const getForm = () => (submit: any, isValid: boolean) => (
  <div style={{'display': 'flex', 'justifyContent': 'center', 'padding': '0 0 16px 0'}}>
    <Form style={{'display': 'flex', 'flexDirection': 'column'}}>
      <p>Approve $LITH for use in this app.</p>
      <Button
        label="Submit Approval"
        onClick={submit}
        disabled={!isValid}
      />
    </Form>
  </div>
)

const getMethodArgs = (pricingAddress: string, value: string) => (_: any) => {
  return [pricingAddress, parseUnits(value)]
}

const ApproveLithiumPricingForm = ({ wallet }: {wallet: any}) => {

  const formProps = {
    defaultValues: approveSchema.defaultValues,
    schema: approveSchema.schema,
    getForm: getForm(),
    contractMethod: wallet.tokenInstance.methods.approve,
    connectedAddress: wallet.address,
    getMethodArgs: getMethodArgs(config.LITHIUM_PRICING_ADDRESS, MAX_APPROVE),
    stateEls: {
      SuccessEl: Success,
      PendingEl: Pending
    },
    formOnSuccess: false,
    onSuccess: null
  }
  return (
    <>
      <Modal
        triggerText='Approve $LITH'
        title='Approve $LITH'
        contentText=''
        getForm={(cancelForm: any) => {
          return (
            <Web3Form
              formProps={{...formProps, cancelForm}}
            />
          )
        }}
      />
    
    </>
  )
}

export default ApproveLithiumPricingForm
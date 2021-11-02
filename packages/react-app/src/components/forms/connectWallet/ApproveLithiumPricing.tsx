import React from 'react'
import { Form } from 'formik'
import { BigNumber } from 'ethers'
import Web3Form from '../../formikTLDR/forms/Web3Form'
import Button from '../../atoms/inputs/buttons/Button'
import { approveSchema } from '../../../schemas/approve'
import config from '../../../config'
import { PendingProps, SuccessProps } from '../../formikTLDR/types'


const MAX_APPROVE = BigNumber.from(2).pow(256).sub(1).toString()

const Pending = ({ txHash }: PendingProps) => (
  <div>
    <h3>Lithium Pricing Approval Pending</h3>
    <a href={config.getTxExplorerUrl(txHash)}>{txHash}</a>
  </div>
)

const Success = ({receipt}: SuccessProps) => (
  <div>
      <h3>Pricing Approved!</h3>
      <h5>Tx Confirmed</h5>
      <a href={config.getTxExplorerUrl(receipt.transactionHash)}>{receipt.transactionHash}</a>
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
  return [pricingAddress, value]
}

const ApproveLithiumPricingForm = ({ wallet, updaters }: any) => {
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
    updaters
  }
  return (
    <>
      <Web3Form
        formProps={{...formProps}}
      />
    </>
  )
}

export default ApproveLithiumPricingForm
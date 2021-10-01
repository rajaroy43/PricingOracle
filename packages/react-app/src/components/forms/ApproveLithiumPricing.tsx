import React, { useContext } from 'react'
import { Form } from 'formik'
import Web3Form from '../formikTLDR/forms/Web3Form'
import Button from '../atoms/inputs/buttons/Button'
import Modal from '../atoms/Modal'
import { parseUnits } from '../../helpers/formatters'
import { approveSchema } from '../../schemas/approve'
import { subgraphClient } from '../../client'
import { WalletContext } from '../providers/WalletProvider'
import { useGetUser } from '../../queries/user'
import config from '../../config'
const MAX_APPROVE = '10000000000'

const Success = () => (
  <div>
    <h3>Lithium Pricing Approved!</h3>
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

const ApproveLithiumPricingForm = () => {
  const connectedWallet = useContext(WalletContext);
  // @ts-ignore
  const { user} = useGetUser(subgraphClient, connectedWallet.address);
  const pricingIsApproved = user?.pricingIsApproved;

  const formProps = {
    defaultValues: approveSchema.defaultValues,
    schema: approveSchema.schema,
    getForm: getForm(),
    // @ts-ignore
    contractMethod: connectedWallet.tokenInstance.methods.approve,
    // @ts-ignore
    connectedAddress: connectedWallet.address,
    getMethodArgs: getMethodArgs(config.LITHIUM_PRICING_ADDRESS, MAX_APPROVE),
    stateEls: {
      successEl: Success
    },
    formOnSuccess: false,
    onSuccess: null
  }
  return (
    <>
      { !pricingIsApproved && <Modal
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
      }
    </>
  )
}

export default ApproveLithiumPricingForm
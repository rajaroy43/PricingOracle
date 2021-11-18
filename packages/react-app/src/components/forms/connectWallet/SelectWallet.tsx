import React from 'react'
import { Form } from 'formik'
import { makeStyles } from '@material-ui/core'
import { selectWalletSchema } from '../../../schemas/wallet'
import wallets from '../../../wallets'
import Button from '../../atoms/inputs/buttons/Button'
import BasicForm from '../../formikTLDR/forms/BasicForm'
import MetaMaskIcon from '../../atoms/logos/MetaMask'
import CardSelect from '../../atoms/inputs/CardSelect'
import Flex from '../../atoms/Flex'
import { SUPPORTED_WALLETS } from '../../../types/user'
import { connectWallet } from '../../../helpers/connectWallet'
import config, { CHAIN_IDS } from '../../../config'

const useStyles = makeStyles(theme => ({
  selectWalletError: {
   color: '#800000',
   fontSize: '1.25rem',
   fontWeight: 700,
   height: '48px',
   justifyContent: 'center',
   lineHeight: '1.25rem',
   marginTop: 0,
   position: 'relative',
   textAlign: 'center',
   width: '264px'
  }
}));

const walletOptions = [
  // {
  //  icon: <FortmaticIcon size={6} />,
  //  title:'Fortmatic',
  //  value: SUPPORTED_WALLETS.FORTMATIC,
  //  connectWallet: wallets.FORTMATIC.connectWallet
  // },
  {
    icon: <MetaMaskIcon size={6} />,
    title:'MetaMask',
    value: SUPPORTED_WALLETS.METAMASK,
    connectWallet: wallets.METAMASK.connectWallet
  }
]

export const SelectWalletError = ({errors}: any) => {
  const classes = useStyles();
  // @ts-ignore
  const chainName = CHAIN_IDS[config.CHAIN_ID]
  let displayErrors = errors && errors.wallet ? errors.wallet : '';
  displayErrors = errors && errors.providerNetwork ? `${errors.providerNetwork} Please connect your wallet to ${chainName} network` : displayErrors;

  return (
    <p className={classes.selectWalletError}>{displayErrors}</p>
  )
}

const getForm = (isValid: boolean, submit: any, close: any, errors: any) => {
  return (
    <div style={{'display': 'flex', 'justifyContent': 'center', 'padding': '0 0 16px 0'}}>
      <Form style={{'display': 'flex', 'flexDirection': 'column'}}>
        <SelectWalletError errors={errors} />
        <CardSelect name='walletType' options={walletOptions} />
        <Flex justifyContent="center">
          <Button
            onClick={() => {
              close();
            }}
            style={{marginRight: '3em'}}
            variant='outlined'
            label="Cancel" />
          <Button
            onClick={submit}
            disabled={!isValid}
            label="Connect Wallet" />
        </Flex>
      </Form>
    </div>
  )
}

const getSubmitArgs = async (values: any, setErrors: any) => {
  const args = connectWallet(values, setErrors)

  return args
}

const SelectWallet = ({setWallet, updaters}: any) => {
  const formProps = {
    defaultValues: selectWalletSchema.defaultValues,
    schema: selectWalletSchema.schema,
    getForm,
    getSubmitArgs,
    submit: setWallet,
    stateEls: {},
    updaters
  }

  return (
    <BasicForm
      {...formProps}
    />
  )
}

export default SelectWallet 
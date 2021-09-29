import React from 'react'
import { Form } from 'formik'
import { selectWalletSchema, SUPPORTED_WALLETS } from '../../schemas/wallet'
import wallets from '../../wallets'
import Button from '../atoms/inputs/buttons/Button'
import BasicForm from '../formikTLDR/forms/BasicForm'
import MetaMaskIcon from '../atoms/logos/MetaMask'
import CardSelect from '../atoms/inputs/CardSelect'
import Flex from '../atoms/Flex'
import Modal from '../atoms/Modal'
import config from '../../config'
import { getLithiumPricingInstance, getLithiumTokenInstance } from '../../helpers/contractInstances'
import { makeStyles } from '@material-ui/core'

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

const isValidProviderNetwork = (provider: any): boolean => {
  // confirm  the provider chainId matches if not fortmatic
  if (!provider.isFortmatic && parseInt(provider.chainId, 16) !== config.CHAIN_ID) {
    return false
  }

  return true
}

export const SelectWalletError = ({errors}: any) => {
  const classes = useStyles();
  let displayErrors = errors && errors.wallet ? errors.wallet : '';
  displayErrors = errors && errors.providerNetwork ? `${errors.providerNetwork} Please connect your wallet to ${errors.networkName} network and Reload.` : displayErrors;

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
            onClick={async () => {
              const success = await submit();
              if (success) {
                close()
              }
            }}
            disabled={!isValid}
            label="Connect Wallet" />
        </Flex>
      </Form>
    </div>
  )
}

const getSubmitArgs = async (values: any, setErrors: any) => {
  if (values?.walletType === '') {
    setErrors({wallet: 'Please select a wallet'})
    return
  }

  // @ts-ignore
  const [wallet, provider] = await wallets[values.walletType].connectWallet()

  const isValidNetwork = isValidProviderNetwork( provider )

  if (!isValidNetwork) {
    setErrors({providerNetwork: 'Network Mismatch.', networkName: config.NETWORK_NAME})
    return
  }

  // @ts-ignore
  const address = await wallets[values?.walletType].getAddress(wallet)
  const tokenInstance = getLithiumTokenInstance(wallet)
  const pricingInstance = getLithiumPricingInstance(wallet)
  const args = {
    walletType: values.walletType,
    wallet,
    address,
    provider,
    tokenInstance,
    pricingInstance,
  }

  return args
}

const SelectWalletForm = ({setWallet}: any) => {
  const formProps = {
    defaultValues: selectWalletSchema.defaultValues,
    schema: selectWalletSchema.schema,
    getForm: getForm,
    getSubmitArgs,
    submit: setWallet,
    stateEls: {}
  }

  return (
    <Modal 
      triggerText='Connect Wallet'
      title='Connect Your Wallet'
      contentText=''
      getForm={(cancel: any) => <BasicForm
        {...formProps}
        cancel={cancel}
      /> }
      />
    )
}

export default SelectWalletForm 
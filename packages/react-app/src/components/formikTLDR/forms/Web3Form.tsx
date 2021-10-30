import React, {useState} from 'react'
import { Formik } from 'formik'
import { callMethod } from './utils'
import { Web3FormProps, FormStateEls } from '../types'
import Loading from '../../atoms/Loading'


/*
interface CallMethodProps {
  contractMethod: any;
  connectedAddress: string;
  args: any[];
  handleTxHash: any;
  handleReceipt: any;
  handleError: any;
  resetForm: any;
  setSubmitting: any;
}

interface FormProps {
  defaultValues: any;
  schema: any;
  connectedAddress: string;
  formArgs: string[];
  staticArgs?: any[];
  contractMethod: any;
  getMethodArgs: any;
}

interface State {
  receipt: any;
  txHash: string | null;
  error: any;
}
*/

const Success = () => (
  <div>
    <h3>Transaction Success!</h3>
  </div>
)

const Error = ({error}: {error: string}) => (
  <div>
    <h3>Transaction Error!</h3>
    <div>{error}</div>
  </div>
)

const Pending = ({txHash}: {txHash: string}) => {
  return (
    <div>
      <h3>Transaction Pending</h3>
      <div>{txHash}</div>
      <Loading  />
    </div>
  )
}

const getContent = (
  getForm: any,
  state: any,
  submit: any,
  isValid: boolean,
  stateEls: FormStateEls,
  formOnSuccess: boolean,
  onSuccess: any
  ) => {
  const { SuccessEl, PendingEl, ErrorEl } = stateEls
  if (state.receipt) {
    if (onSuccess) {
      onSuccess()
    }
    return (
      <div>
        {formOnSuccess && getForm(submit)}
        {SuccessEl ? <SuccessEl receipt={state.receipt} /> : <Success />}
      </div>
    )
  } else if (state.error) {
    return ErrorEl ? <ErrorEl error={state.error} /> : <Error error={state.error} />
  } else if (state.txHash) {
    return PendingEl ? <PendingEl txHash={state.txHash} /> : <Pending txHash={state.txHash} />
  }

  return getForm(submit, isValid)
}

interface InnerFormState {
  receipt: any;
  txHash?: string;
  error: any;
}

const initialState: InnerFormState = {
  receipt: null,
  txHash: undefined,
  error: null,
}


const InnerForm = ({formikProps, formProps}: {formikProps: any, formProps: Web3FormProps}) => {
  const {
    contractMethod,
    getContractMethod,
    connectedAddress,
    methodArgs,
    getMethodArgs,
    getForm,
    stateEls,
    formOnSuccess,
    onSuccess = () => {},
    staticArgs } = formProps
  const {values, setSubmitting, resetForm, isValid} = formikProps
  const [state, setState] = useState(initialState)

  const handleTxHash = (txHash: string) => setState({...state, txHash})
  const handleReceipt = (receipt: any) => {
    setState({...state, receipt})
  }
  const handleError = (error: any) => setState({...state, error})

  const staticArgsProps = staticArgs || []
  const args = getMethodArgs ? getMethodArgs(values) : staticArgsProps.concat(methodArgs.map((arg: string) => values[arg]))
  const method = getContractMethod ? getContractMethod(values) : contractMethod
  
  const submit = () => isValid ?
    callMethod({
      contractMethod: method,
      connectedAddress,
      args,
      handleTxHash,
      handleReceipt,
      handleError,
      resetForm,
      setSubmitting
    })
      :
      () => {}
  
  return getContent(
    getForm, 
    state,
    submit,
    isValid,
    stateEls,
    formOnSuccess,
    onSuccess
    )
}

const Web3Form = ({formProps}: {formProps:Web3FormProps}) => {

  return (
    <Formik
      initialValues={formProps.defaultValues}
      validationSchema={formProps.schema}
      onSubmit={(vals) => console.log(`form was submitted ${vals}`)}
    >
      {(props) => <InnerForm formikProps={props} formProps={formProps} />}
    </Formik>
  )
}

export default Web3Form
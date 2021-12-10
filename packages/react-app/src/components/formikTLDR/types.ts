import { FormikHandlers } from 'formik';
import React from 'react'

export interface SuccessProps {
  receipt: any;
}

export interface PendingProps {
  txHash: string
}

export interface ErrorProps {
  error: any
}

export interface FormStateEls {
  SuccessEl?: React.ComponentType<SuccessProps>;
  PendingEl?: React.ComponentType<PendingProps>;
  ErrorEl?: React.ComponentType<ErrorProps>;
}

export interface FormUpdaters {
  cancel?: any;
  onSuccess?: any;
  onError?: any;
}

interface Form {
  defaultValues: any;
  schema: any;
  getForm: any;
  stateEls: FormStateEls;
  updaters: FormUpdaters;
  formOnSuccess?: boolean;
}

export interface BasicFormProps extends Form {
  submit: any;
  getSubmitArgs: any;
}

export interface Web3FormProps extends Form{
  contractMethod?: string;
  getContractMethod?: any;
  connectedAddress: string;
  methodArgs?: any;
  staticArgs?: any;
  getMethodArgs?: any;
}

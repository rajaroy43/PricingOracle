import { FormikHandlers } from 'formik';
import React from 'react'

export interface SuccessProps {
  receipt: any;
}

export interface PendingProps {
  txHash: string
}

export interface ErrorProps {
  error: string
}

export interface FormStateEls {
  SuccessEl?: React.ComponentType<SuccessProps>;
  PendingEl?: React.ComponentType<PendingProps>;
  ErrorEl?: React.ComponentType<ErrorProps>;
}

export interface FormUpdaters {
  cancel: any;
  onSuccess: any;
  onError: any;
}

export interface BasicFormProps {
  defaultValues: any;
  schema: any;
  getForm: any;
  stateEls: FormStateEls;
  submit: any;
  getSubmitArgs: any;
  updaters: FormUpdaters;
}

export interface Web3FormProps {
  defaultValues: any;
  schema: any;
  getForm: any;
  contractMethod?: string;
  getContractMethod?: any;
  connectedAddress: string;
  methodArgs?: any;
  staticArgs?: any;
  getMethodArgs?: any;
  stateEls: FormStateEls;
  formOnSuccess: boolean;
  cancelForm?: any
  onSuccess?: any
}

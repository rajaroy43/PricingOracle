export interface FormStateEls {
  successEl?: any;
  pendingEl?: any;
  errorEl?: any;
}

export interface BasicFormProps {
  defaultValues: any;
  schema: any;
  getForm: any;
  stateEls: FormStateEls;
  submit: any;
  getSubmitArgs: any;
  cancel: any;
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

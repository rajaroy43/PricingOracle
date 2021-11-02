import React from 'react'
import { Formik } from 'formik'
import { BasicFormProps } from '../types'

const InnerForm = ({formikProps, formProps}: {formikProps: any, formProps: BasicFormProps}) => {
  const {values, isValid, setErrors, errors } = formikProps
  const { getForm, getSubmitArgs, submit, updaters } = formProps
  
  const onSubmit = async () => {
    const args = await getSubmitArgs(values, setErrors)
    if (args) {
      submit(args)
      updaters.onSuccess(args)
      return true
    }
    updaters.onError(errors)
    return false
    
  }
  return getForm(isValid, onSubmit, updaters.cancel, errors)
}

const BasicForm = (formProps: BasicFormProps) => {
  return (
    <Formik
      initialValues={formProps.defaultValues}
      validationSchema={formProps.schema}
      onSubmit={(vals) => console.log(`form was submitted ${vals}`)}
    >
      {(props) => <InnerForm formikProps={props} formProps={formProps} />}
    </Formik>
  );
};

export default BasicForm
import React from 'react'
import { useField } from 'formik'
import { TimePicker } from 'antd'
import ErrorMessage from './ErrorMessage';

const Time = (props) => {
  const [field, meta] = useField(props);
  const isError = meta.touched && !!meta.error
  console.log(`time field value ${field.value} `)
  return (
    <div style={{paddingBottom: '1.25em'}}>
      <TimePicker
        {...field}
        {...props}
        error={isError} />
      <ErrorMessage
        isError={isError}
        errorMsg={meta.error} />
    </div>
  )

}

export default Time
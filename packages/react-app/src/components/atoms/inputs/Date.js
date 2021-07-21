import React from 'react'
import { useField } from 'formik'
import { DatePicker } from 'antd'
import ErrorMessage from './ErrorMessage';

const Date = (props) => {
  const [field, meta] = useField(props);
  const isError = meta.touched && !!meta.error

  return (
    <div style={{paddingBottom: '1.25em'}}>
      <DatePicker
        {...field}
        {...props}
        error={isError} />
      <ErrorMessage
        isError={isError}
        errorMsg={meta.error} />
    </div>
  )

}

export default Date
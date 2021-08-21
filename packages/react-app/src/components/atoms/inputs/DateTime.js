import React from 'react'
import { useField } from 'formik'
import DateTimePicker from 'react-datetime'
import ErrorMessage from './ErrorMessage';

const Date = (props) => {
  const [field, meta, form] = useField(props);
  const isError = meta.touched && !!meta.error
  const onChange = (m) => {
    const value = m.unix()
    form.setValue(value * 1000)
  }
  return (
    <div style={{paddingBottom: '1.25em'}}>
      <DateTimePicker
        disableCalendar={true}
        disableClock={true}
        {...field}
        {...props}
        onChange={onChange}
        />
      <ErrorMessage
        isError={isError}
        errorMsg={meta.error} />
    </div>
  )

}

export default Date
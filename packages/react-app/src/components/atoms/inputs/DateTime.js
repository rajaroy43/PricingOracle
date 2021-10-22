import React from 'react'
import { useField } from 'formik'
import DateTimePicker from 'react-datetime'
import styled from 'styled-components'
import ErrorMessage from './ErrorMessage';
import { zeroPad } from '../../../helpers/formatters'
import '../../../assets/css/react-datetime.css'

const Td = styled.td`
  &:hover {
    opacity: 50%;
  }
  text-align: left;
`
const renderDay = (props, currentDate, selectedDate) => {
  return <Td
    style={{ cursor: 'pointer' }}
    {...props}
  >
    {zeroPad(currentDate.date(), 2)}
  </Td>;
}
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
        renderDay={renderDay}
        />
      <ErrorMessage
        isError={isError}
        errorMsg={meta.error} />
    </div>
  )

}

export default Date
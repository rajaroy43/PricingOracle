import React from 'react'

const ErrorMessage = (props) => {
  const errorCss = props.className ? props.className : 'error';

  return props.isError ? (
    <div className={errorCss || ''}>{props.errorMsg}</div>
  ) : null
}

export default ErrorMessage
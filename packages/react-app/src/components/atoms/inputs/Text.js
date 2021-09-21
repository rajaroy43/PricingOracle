import React from 'react'
import { useField } from 'formik'
import TextField from '@material-ui/core/TextField'
import ErrorMessage from './ErrorMessage';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  textFieldError: {
    display: 'block',
    position: 'relative',
    bottom: '10px',
    color: '#ff0000'
  },
  followText: {
    alignSelf: 'center',
    flexShrink: 0,
    fontWeight: 500,
  }
}));

const Text = (props) => {
  const { wrapperClass, errorCss, followText, onChange, ...rest} = props;
  const [field, meta] = useField(rest);
  const isError = meta.touched && !!meta.error
  const classes = useStyles();

  const updatedRestProps = {
    ...rest,
    onChange: (e) => { onChange(e.target.value); field.onChange(e)}
  }

  return (
    <>
      <div className={wrapperClass || ''}>
        <TextField
          {...field}
          {...updatedRestProps}
          error={isError} />
          <div className={classes.followText}>{followText}</div>
      </div>
      <ErrorMessage
        className={errorCss || classes.textFieldError}
        isError={isError}
        errorMsg={meta.error} />
    </>
  )

}

export default Text
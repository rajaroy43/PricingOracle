import config from "../../../config"

export const callMethod = (props) => {
  const txType = '0x2'
  console.log(`calling tx type ${txType}\n${JSON.stringify(props)}`)
  props.setSubmitting(true)

  props.contractMethod.call(null, ...props.args).send({from: props.connectedAddress, value: '0', type: txType})
    .on('transactionHash', props.handleTxHash)
    .on('receipt', (receipt) => {
      props.handleReceipt(receipt)
      props.resetForm()
      props.setSubmitting(false)
      if (props.onSuccess) props.onSuccess()
    })
    .on('error', props.handleError)
}

export const formatAddFileVariables = (contentFields, staticValues = {}) => (values) => {
  const allValues = {...staticValues, ...values}
  const contentValues = contentFields.reduce((acc, field) => {
    acc[field] = allValues[field]
    return acc
  }, {})
  return JSON.stringify(contentValues)
}

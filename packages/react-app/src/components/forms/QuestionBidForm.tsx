import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Form } from 'formik'
import Web3Form from '../formikTLDR/forms/Web3Form'
import Button from '../atoms/inputs/buttons/Button'
import Text from '../atoms/inputs/Text'
import { SuccessProps } from '../formikTLDR/types'
import ExplorerLink from '../atoms/ExplorerLink'
import questionBidSchema from '../../schemas/questionBid'
import { parseUnits } from '../../helpers/formatters'

const useStyles = makeStyles(theme => ({
    myBidWrapper: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        whiteSpace: 'nowrap'
    },
    bidUnit: {
        marginLeft: '4px'
    },
    buttonUpdateBid: {
        marginTop: '16px'
    },
}));

const getForm = (classes: any) => (submit: any) => (
  <Form>
     <div className={classes.myBidWrapper}>
        <Text
            name="questionBidAmount"
            type="text"
            style={{width: '80px'}}
        /><span className={classes.bidUnit}>LITH</span>
    </div>
    <Button 
        label="Update Bid"
        className={classes.buttonUpdateBid}
        onClick={submit} 
    />
  </Form>
)

const Success = ({receipt}: SuccessProps) => (
  <div>
      <h3>Bid Updates!</h3>
      <h5>Tx Confirmed</h5>
      <ExplorerLink txHash={receipt.transactionHash} />
  </div>
)

const getMethodArgs = (questionId: string[]) => (values: any) => {
  const bidAmount = parseUnits(values.questionBidAmount);
  return [questionId, bidAmount]
}

const QuestionBidForm = ({ connectedWallet, question }: any) => {
  const classes = useStyles();
  const formProps = {
    defaultValues: questionBidSchema.defaultValues,
    schema: questionBidSchema.schema,
    getForm: getForm(classes),
    contractMethod: connectedWallet.pricingInstance.methods.increaseBid,
    connectedAddress: connectedWallet.address,
    getMethodArgs: getMethodArgs(question.id),
    stateEls: {
      SuccessEl: Success
    },
    formOnSuccess: false,
    updaters: {}
  }
  return (
    <Web3Form
      formProps={{...formProps}}
    />
  )
}

export default QuestionBidForm
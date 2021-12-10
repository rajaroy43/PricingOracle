import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Form } from 'formik'
import Web3Form from '../formikTLDR/forms/Web3Form'
import Button from '../atoms/inputs/buttons/Button'
import Text from '../atoms/inputs/Text'
import { ErrorProps, SuccessProps } from '../formikTLDR/types'
import BidExplorerLink from '../atoms/BidExplorerLink'
import questionBidSchema from '../../schemas/questionBid'
import { parseUnits } from '../../helpers/formatters'

const useStyles = makeStyles(theme => ({
    updateHead: {
      marginTop: '0'
    },
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
    successWrapper: {
      maxWidth: '175px',
      '& > h3': {
        fontSize: '18px',
        marginTop: '0'
      }
    }
}));

const getForm = (classes: any) => (submit: any) => (
  <Form>
     <p className={classes.updateHead}><strong>Update Bid</strong></p>
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

const Success = ({receipt}: SuccessProps) => {
  const classes = useStyles();
  return (
    <div className={classes.successWrapper}>
        <h3>Bid Updated</h3>
        <BidExplorerLink txHash={receipt.transactionHash} />
    </div>
  )
}

const Error = ({error}: ErrorProps) => {
  const classes = useStyles();
  return (
    <div className={classes.successWrapper}>
        <h3>Tx Error</h3>
        <p>{error.code}</p>
    </div>
  )
}

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
      ErrorEl: Error,
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
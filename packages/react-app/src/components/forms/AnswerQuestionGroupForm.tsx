import React from 'react'
import { Form } from 'formik'
import { answerQuestionGroupSchema } from '../../schemas/answer'
import Web3Form from '../formikTLDR/forms/Web3Form'
import Typography from "@material-ui/core/Typography"
import Button from '../atoms/inputs/buttons/Button'
import { parseUnits } from '../../helpers/formatters'
import AnswerQuestionInput from './AnswerQuestionInput'
import { QuestionView } from '../../types/question'
import { QuestionGroupView } from '../../types/questionGroup'

const Success = () => (
  <div>
    <Typography variant="h3">Question Answered!</Typography>
  </div>
)

const getForm = (questions: QuestionView[], updateStake: any) => (submit: any, isValid: boolean) => {
 
  return (
    <>
      <Form>
        {questions.map((question, idx) => <AnswerQuestionInput key={idx} idx={idx} question={question} updateStake={updateStake(idx)} />)}
        <Button
          label="Submit Answer"
          onClick={submit}
          disabled={!isValid}
        />
      </Form>
    </>
  )
} 

const getMethodArgs = (questionGroupId: string) => (values: any) => {
  const stakes = values.answers.map((v: any) => parseUnits(v.stakeAmount))
  const answerIndexes = values.answers.map((v: any) => parseInt(v.answerIndex, 10))

  return [questionGroupId, stakes, answerIndexes]
}

const AnswerQuestionGroupForm = ({ questionGroup, connectedWallet, updateStake }: {questionGroup: QuestionGroupView, connectedWallet: any, updateStake: any}) => {
  const defaultQuestionValues = questionGroup.questions.map(() => {return {...answerQuestionGroupSchema.defaultValue}})


  const formProps = {
    defaultValues: {answers: defaultQuestionValues },
    schema: answerQuestionGroupSchema.schema,
    getForm: getForm(questionGroup.questionViews, updateStake),
    // @ts-ignore    
    contractMethod: connectedWallet.pricingInstance.methods.answerQuestions,
    // @ts-ignore
    connectedAddress: connectedWallet.address,
    getMethodArgs: getMethodArgs(questionGroup.id),
    stateEls: {
      successEl: Success
    },
    formOnSuccess: false,
    onSuccess: null
  }
  
  return (
    <Web3Form
      formProps={{...formProps}}
    />
  )
}

export default AnswerQuestionGroupForm
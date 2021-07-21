import React from 'react'
import { Form } from 'formik'
import { answerQuestionSchema } from '../../schemas/answer'
import Web3Form from '../formikTLDR/forms/Web3Form'
import Text from '../atoms/inputs/Text'
import Button from '../atoms/inputs/buttons/Button'
import Modal from '../atoms/Modal'
import { parseUnits } from '../../helpers/formatters'
import Select from '../atoms/inputs/Select'

const Success = () => (
  <div>
    <h3>Question Answered!</h3>
  </div>
)

const getForm = (answerSetOptions: any) => (submit: any, isValid: boolean) => (
  <Form>
    <div style={{padding: '2em 0'}}>
      <Select
        label="Answer"
        name="answerIndex"
        options={answerSetOptions}
      />
      <Text
        label="Stake Amount "
        name="stakeAmount"
        type="number" 
      />
    </div>
    <Button
      label="Submit Answer"
      onClick={submit}
      disabled={!isValid}
    />
  </Form>
)

const getMethodArgs = (questionId: string) => (values: any) => {
  return [[questionId], [parseUnits(values.stakeAmount)], [values.answerIndex]]
}

const generateAnswerSetOptions = (answerSet: string[]) => {
  return answerSet.map((answer: string, index: number) => {
    if (index === 0) {
      return {label: `Less Than or Equal to ${answer}`, value: index}
    } else if (index === answerSet.length - 1) {
      return {label: `Greater Than ${answerSet[index-1]}`, value: index}
    } else {
      return {label: `Greater Than ${answerSet[index-1]} Less Than or Equal to ${answer}`, value: index}
    }
  })
}

const AnswerQuestionForm = ({ connectedAddress, pricingInstance, questionId, answerSet, onSuccess }: any) => {
  console.log(`contract methods ${Object.keys(pricingInstance.methods)}`)
  const formProps = {
    defaultValues: answerQuestionSchema.defaultValues,
    schema: answerQuestionSchema.schema,
    getForm: getForm(generateAnswerSetOptions(answerSet)),
    contractMethod: pricingInstance.methods.answerQuestions,
    connectedAddress,
    getMethodArgs: getMethodArgs(questionId),
    stateEls: {
      successEl: Success
    },
    formOnSuccess: false,
    onSuccess
  }
  return (
    <Modal
      triggerText='Answer Question'
      title=''
      contentText=''
      getForm={(cancelForm: any) => {
        return (
          <Web3Form
            formProps={{...formProps, cancelForm}}
          />
        )
      }}
    />
  )
}

export default AnswerQuestionForm
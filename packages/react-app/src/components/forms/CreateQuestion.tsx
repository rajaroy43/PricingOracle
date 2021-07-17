import React from 'react'
import { Form } from 'formik'
import { createQuestionSchema } from '../../schemas/question'
import Web3Form from '../formikTLDR/forms/Web3Form'
import Text from '../atoms/inputs/Text'
import Button from '../atoms/inputs/buttons/Button'
import Modal from '../atoms/Modal'
import { parseUnits } from '../../helpers/formatters'

const Success = () => (
  <div>
    <h3>Question Created!</h3>
  </div>
)

const getForm = () => (submit: any, isValid: boolean) => (
  <Form>
    <div style={{padding: '2em 0'}}>
      <Text
        label="Question"
        name="description"
        type="text" 
      />
      <Text
        label="Price Point"
        name="answerSet"
        type="number" 
      />
      <Text
        label="End Time"
        name="endTime"
        type="number" 
      />
      <Text
        label="Bounty"
        name="bounty"
        type="text" 
      />
    </div>
    <Button
      label="Submit Question"
      onClick={submit}
      disabled={!isValid}
    />
  </Form>
)

const getMethodArgs = (categoryId: string) => (values: any) => {
  return [categoryId, parseUnits(values.bounty), values.endTime, values.description, [values.answerSet]]
}

const CreateQuestionForm = ({ connectedAddress, pricingInstance, categoryId, onSuccess }: any) => {
  const formProps = {
    defaultValues: createQuestionSchema.defaultValues,
    schema: createQuestionSchema.schema,
    getForm: getForm(),
    contractMethod: pricingInstance.methods.createQuestion,
    connectedAddress,
    getMethodArgs: getMethodArgs(categoryId),
    stateEls: {
      successEl: Success
    },
    formOnSuccess: false,
    onSuccess
  }
  return (
    <Modal
      triggerText='Add Question'
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

export default CreateQuestionForm
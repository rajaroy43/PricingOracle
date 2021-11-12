import React from 'react'
// @ts-ignore
import { FieldArray } from 'formik'
import CreateQuestionForm from './CreateQuestionForm'
import DeleteIcon from '../../atoms/icons/Delete'
import { QuestionType } from '../../../types/question'

interface Props {
  name: string,
  title: string,
  defaultValues: any,
  components: any,
  values: any,
  questionType: QuestionType,
}

const CreateQuestionArray = ({ name, title, defaultValues, components, values, questionType }: Props) => {
  const { Button, FormRow, Row } = components
  return (
    <FieldArray
      name={name}
      render={arrayHelpers => (
        <div>
          <FormRow style={{ margin: '16px 0' }}>
            <label htmlFor="weeksLocked">{title}</label>
    

            <Button onClick={() => arrayHelpers.push({...defaultValues})}>
              +
            </Button>
          </FormRow>
          {
            values && values.map((_: any, index: number) => (
              <div key={index}>
                <p style={{ color: 'white', fontWeight: 700 }}>{`Question ${ index + 1 }`}</p>
                <Row>
                  <DeleteIcon onClick={() => arrayHelpers.remove(index)} color='secondary' />
                  <CreateQuestionForm id={`${name}.${index}`} questionType={questionType} />
                </Row>
              </div>
            ))
          }
          </div>
        )}
    />
  )
}

export default CreateQuestionArray
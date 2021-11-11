import React, { useState } from 'react'
// @ts-ignore
import styled from 'styled-components'
import { Form } from 'formik'
import DateTime from '../../atoms/inputs/DateTime'
import Select from '../../atoms/inputs/Select'
import Text from '../../atoms/inputs/Text'
import createQuestionGroupSchema, { groundTruthQuestionDefaults, pricingQuestionDefaults} from '../../../schemas/questionGroup'
import Web3Form from '../../formikTLDR/forms/Web3Form'
import { msToSec } from '../../../helpers/formatters'
import { QuestionType } from '../../../types/question'
import CreateQuestionArray from './CreateQuestionArray'
import config from '../../../config'

const Row = styled.div`
    display: flex;
    flex-direction: row;
`
const FormRow = styled(Row)`
    margin: 1em;
    width: 9em;
    > label {
        font-weight: 700;
        color: white;
    }
`
const Button = styled.button`
    padding: 5px;
    border-style: none;
    padding-left: 1em;
    padding-right: 1em;
    border-radius: 5px;
    margin-top: 1em;
    background-color: #E96036;
    color: white;
    font-weight: bold;
`
const FormContainer = styled.div`
    border-radius: 5px;
    padding: 1em;
    display: flex;
    background-color: #111;
    width: 50em;
    color: black;
`

const Col = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 2em;
    > label {
        font-weight: 700;
        color: white;
    }
`

const categories = [
    'preIPO',
    'crypto',
    'real estate',
    'NFT'
].map((label, idx) => {
  return {label, value:idx.toString()}
})

const components = {
  Button,
  FormRow,
  Row 
}
const getForm = () => (submit: any, isValid: boolean, values: any) => {
  console.log(`geting q create form ${JSON.stringify(values)}`)
  return (  
    <Form>
        <FormContainer>
            <div>
                <FormRow>
                    <label htmlFor="category">Category</label>
                </FormRow>
                <FormRow>
                  <Col style={{ marginRight: '4.5em' }}>
                    <Select
                      name='category'
                      options={categories}
                    />
                  </Col>
                  <Col style={{ marginRight: '2.25em' }}>
                    <Text
                      style={{color: '#fff !important',  width: '10em'}}
                      label="Minimum Required Answers"
                      name='minimumRequiredAnswers'
                      type="number" 
                    />
                  </Col>
                </FormRow>
                <FormRow style={{ marginTop: '2.5em' }}>
                    <Col style={{ marginRight: '2.25em' }}>
                        <label htmlFor="amount">Start Time</label>
                        <DateTime
                            label="Start Time"
                            name="startTime"
                        />
                    </Col>
                    <Col style={{ marginRight: '2.25em' }}>
                        <label>End Time</label>
                        <DateTime
                            label="End Time"
                            name="endTime"
                        />
                    </Col>
                    <Col>
                        <label htmlFor="weeksLocked">Pricing Time</label>
                        <DateTime
                            label="Pricing Time"
                            name="pricingTime"
                        />
                    </Col>
                </FormRow>
                <hr style={{ width: '45em' }} />
                <CreateQuestionArray
                  name='pricingQuestions'
                  title='Pricing Questions'
                  defaultValues={pricingQuestionDefaults}
                  components={components}
                  values={values.pricingQuestions}
                  questionType={QuestionType.Pricing}
                />

                <CreateQuestionArray
                  name='groundTruthQuestions'
                  title='Ground Truth Questions'
                  defaultValues={groundTruthQuestionDefaults}
                  components={components}
                  values={values.groundTruthQuestions}
                  questionType={QuestionType.GroundTruth}
                />
                <FormRow style={{ width: '100%'}} >
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button style={{ width: '10em', height: '3em', cursor: 'pointer' }} type="submit" onClick={submit}>
                            Submit
                        </Button>
                    </div>
                </FormRow>
            </div>
        </FormContainer>
    </Form>
  )
}

const getMethodArgs = () => (values: any) => {
    console.log(`inside create Q vals ${JSON.stringify(values)}`)
    const questions = values.pricingQuestions.concat(values.groundTruthQuestions)
    const questionCount = questions.length

    const questionCategories = new Array(questionCount).fill(values.category)
    const pricingTimes = new Array(questionCount).fill(values.pricingTime).map(msToSec)
    const endTimes= new Array(questionCount).fill(values.endTime).map(msToSec)
    const startTimes = new Array(questionCount).fill(values.startTime).map(msToSec)

    const questionTypes = questions.map((q: any) => q.questionType)
    const bounties = questions.map((q: any) => q.bounty)
    const answerSets = questions.map((q: any) => q.answerSet).map((as: string) => [0,as])
    const descriptions = questions.map((q: any) => q.description)
    return (
        [
            questionCategories,
            bounties,
            pricingTimes,
            endTimes,
            questionTypes,
            descriptions,
            answerSets,
            startTimes,
            values.miniumumRequiredAnswers
        ]
    )
}

const Success = ({receipt}: SuccessProps) => (
    <div>
        <h3>Question Group Created!</h3>
        <h5>Tx Confirmed</h5>
        <a href={config.getTxExplorerUrl(receipt.transactionHash)}>{receipt.transactionHash}</a>
    </div>
)
const CreateQuestionGroupForm = ({ connectedAddress, pricingInstance, categoryId, onSuccess }: any) => {
    const [selectedCategory, setSelectedCategory] = useState(categories[0])

    if ( !connectedAddress || !pricingInstance) {
        return <p style={{ color: 'white' }}>Please Connect to Metamask</p>
    }
    const formProps = {
        defaultValues: createQuestionGroupSchema.defaultValues,
        schema: createQuestionGroupSchema.schema,
        getForm: getForm(),
        contractMethod: pricingInstance.methods.createQuestionGroup,
        connectedAddress,
        getMethodArgs: getMethodArgs(),
        stateEls: {
            SuccessEl: Success
        },
        formOnSuccess: false,
        updaters: {
          onSuccess
        }
    }
    return (
        <Web3Form
            formProps={{ ...formProps}}
        />
    )
}

export default CreateQuestionGroupForm

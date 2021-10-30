import React, { useState } from 'react'
// @ts-ignore
import styled from 'styled-components'
import { Form } from 'formik'
import DateTime from '../atoms/inputs/DateTime'
import Select from '../atoms/inputs/Select'
import CreateQuestionForm from './CreateQuestionForm'
import createQuestionGroupSchema from '../../schemas/questionGroup'
import Web3Form from '../formikTLDR/forms/Web3Form'
import { msToSec, parseUnits } from '../../helpers/formatters'
import { SuccessProps } from '../formikTLDR/types'

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

const CreateQuestionGroup = () => (submit: any, isValid: boolean) => (  
    <Form>
        <FormContainer>
            <div>
                <FormRow>
                    <label htmlFor="category">Category</label>
                </FormRow>
                <FormRow>
                    <Select
                        name='category'
                        options={categories}
                    />
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
                <FormRow style={{ margin: '16px 0' }}>
                    <label htmlFor="weeksLocked">List of Questions</label>
                </FormRow>

                {[...Array(4)].map((el, i) => {
                    return (
                        <div key={i}>
                            <p style={{ color: 'white', fontWeight: 700 }}>{`Question ${ i + 1 }`}</p>
                            <Row>
                                <CreateQuestionForm key={i} index={i} />
                            </Row>
                        </div>
                    )
                })}

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

const getMethodArgs = () => (values: any) => {
    console.log(`inside create Q vals ${JSON.stringify(values)}`)
    const questionCount = 4
    const questionCategories = new Array(questionCount).fill(values.category)
    const PRICING_TYPE = 0
    const questionTypes = new Array(questionCount).fill(PRICING_TYPE)
    const bounties = [values.bounty0, values.bounty1, values.bounty2, values.bounty3].map(parseUnits)
    const pricingTimes = [values.pricingTime, values.pricingTime, values.pricingTime, values.pricingTime].map(msToSec)
    const endTimes= [values.endTime, values.endTime, values.endTime, values.endTime].map(msToSec)
    const startTimes = [values.startTime, values.startTime, values.startTime, values.startTime].map(msToSec)
    const answerSets = [values.answerSet0, values.answerSet1, values.answerSet2, values.answerSet3].map((as) => [0,as])
    const descriptions = [values.description0, values.description1, values.description2, values.description3]
    const minimumRequiredAnswers = 1
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
            minimumRequiredAnswers
        ]
    )
}

const Success = ({receipt}: SuccessProps) => (
    <div>
        <h3>Question Group Created!</h3>
        {receipt.txHash}
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
        getForm: CreateQuestionGroup(),
        contractMethod: pricingInstance.methods.createQuestionGroup,
        connectedAddress,
        getMethodArgs: getMethodArgs(),
        stateEls: {
            SuccessEl: Success
        },
        formOnSuccess: false,
        onSuccess
    }
    return (
        <Web3Form
            formProps={{ ...formProps}}
        />
    )
}

export default CreateQuestionGroupForm

import React, { useState } from 'react'
// @ts-ignore
import styled from 'styled-components'
import { Form } from 'formik'
import DateTime from '../atoms/inputs/DateTime'
import Select from '../atoms/inputs/Select'
import CreateQuestionForm from './CreateQuestionForm'
import createQuestionGroupSchema from '../../schemas/questionGroup'
import Web3Form from '../formikTLDR/forms/Web3Form'
import { parseUnits } from '../../helpers/formatters'

const Row = styled.div`
    display: flex;
    flex-direction: row;
`
const FormRow = styled(Row)`
    margin: 1em;
    width: 9em;
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
    background-color: #EEEEEE;
    width: 50em;
    color: black;
`

const Col = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 2em;
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
                        <label htmlFor="amount">Category</label>
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
                    <FormRow>
                        <label htmlFor="weeksLocked">List of Questions</label>
                    </FormRow>
                    <FormRow>
                        {[...Array(4)].map((el, i) => {
                            return (
                                <Col>
                                    <p>{`Question ${ i + 1 }`}</p>
                                    <CreateQuestionForm key={i} index={i} />
                                </Col>
                            )
                        })}
                    </FormRow>
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

    return (
        [
            [values.category, values.category, values.category, values.category],
            [parseUnits(values.bounty0), parseUnits(values.bounty1), parseUnits(values.bounty2), parseUnits(values.bounty3)],
            [values.pricingTime, values.pricingTime, values.pricingTime, values.pricingTime],
            [values.endTime, values.endTime, values.endTime, values.endTime],
            [0, 0, 0, 0],
            [values.description0, values.description1, values.description2, values.description3],
            [[0, values.answerSet0], [0, values.answerSet1], [0, values.answerSet2], [0, values.answerSet3]],
            [values.startTime, values.startTime, values.startTime, values.startTime],
            1
        ]
    )
}

const Success = () => (
    <div>
        <h3>Question Created!</h3>
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
            successEl: Success
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

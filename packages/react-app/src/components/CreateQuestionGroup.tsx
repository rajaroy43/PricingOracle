import React, { useState } from 'react'
// @ts-ignore
import styled from 'styled-components'
import { Form } from 'formik'
import DateTime from './atoms/inputs/DateTime'
import CreateQuestionForm from './CreateQuestionForm'
import createQuestionGroupSchema from '../schemas/questionGroup'
import Web3Form from './formikTLDR/forms/Web3Form'

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
const Select = styled.select`
    width: 9em;
`
const Col = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 2em;
`

const categories = [
    'crypto company',
    'digital collectible',
    'real estate',
    'private companies',
    'crypto asset'
]

const CreateQuestionGroup = (selectedCategory: string, setSelectedCategory: any) => (submit: any, isValid: boolean) => (
        <Form>
            <FormContainer>
                <div>
                    <FormRow>
                        <label htmlFor="amount">Category</label>
                    </FormRow>
                    <FormRow>
                        <Select
                            name='category'
                            value={selectedCategory}
                            onChange={(e: any) => {
                                setSelectedCategory(e.target.value)
                            }}
                        >
                            {categories.map((category, i) => (
                                <option
                                    value={String(i)}
                                    label={category}
                                    key={i}
                                >{category}</option>
                            ))}
                        </Select>
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
                                    <CreateQuestionForm index={i} />
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

const getMethodArgs = (categoryId: string, selectedCategory: string) => (values: any) => {
    console.log(`inside create Q vals ${JSON.stringify(values)}`)
    const category = categories.indexOf(selectedCategory)
    return (
        [
            [category, category, category, category],
            [values.bounty0, values.bounty1, values.bounty2, values.bounty3],
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
        getForm: CreateQuestionGroup(selectedCategory, setSelectedCategory),
        contractMethod: pricingInstance.methods.createQuestionGroup,
        connectedAddress,
        getMethodArgs: getMethodArgs(categoryId, selectedCategory),
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

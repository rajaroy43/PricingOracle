import React from 'react'
import Text from './atoms/inputs/Text'

interface CreateQuestionFormProps {
    index: number
}
const CreateQuestionForm = ({ index }: CreateQuestionFormProps) => {
  return (
    <div style={{ width: '10em' }}>
        <Text
            label="Description"
            name={`description${index}`}
            type="text" 
        />
        <Text
            label="Price Point"
            name={`answerSet${index}`}
            type="number" 
        />
        <Text
            label="Bounty"
            name={`bounty${index}`}
            type="number" 
        />
    </div>
  )
}

export default CreateQuestionForm
import React from 'react'
import { makeStyles } from '@material-ui/core'
import Select from '../../atoms/inputs/Select';
import Text from '../../atoms/inputs/Text'
import { QuestionType } from '../../../types/question';
import { GROUND_TRUTH_ASSETS } from '../../../schemas/questionGroup';
import { valueOf } from '../../../contractDeployments/rinkeby/abis/LithiumToken.bytecode';

interface CreateQuestionFormProps {
    id: string,
    questionType: QuestionType
}

const useStyles = makeStyles(theme => ({
    container: {
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
    },
    fieldWrapper: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      whiteSpace: 'nowrap',
      width: '100%'
    },
    field: {
      color: '#ffffff !important',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start !important',
      width: '100%'
    },
    input: {
      width: '100%'
    }
}));

const CreateQuestionForm = ({ id, questionType }: CreateQuestionFormProps) => {
    const classes = useStyles();
    const descriptionInput = questionType === QuestionType.Pricing ? 
      <Text
        className={classes.field}
        InputProps={{
            className: classes.input,
        }}
        label="Description"
        name={`${id}.description`}
        type="text" 
        wrapperClass={classes.fieldWrapper}
      />
      :
      <Select
        label="Asset"
        name={`${id}.description`}
        options={GROUND_TRUTH_ASSETS.map((value: string) => ({value, label: value}))}
      />
    
    const bountyInput = questionType === QuestionType.Pricing ? 
      <Text
        className={classes.field}
        InputProps={{
            className: classes.input,
        }}
        label="Bounty"
        name={`${id}.bounty`}
        type="number" 
        wrapperClass={classes.fieldWrapper}                
      />
      :
      null
    return (
        <div className={classes.container}>
            {descriptionInput}
            <Text
                className={classes.field}
                InputProps={{
                    className: classes.input,
                }}
                label="Price Point"
                name={`${id}.answerSet`}
                type="number" 
                wrapperClass={classes.fieldWrapper}                
            />
            {bountyInput}
        </div>
    )
}

export default CreateQuestionForm
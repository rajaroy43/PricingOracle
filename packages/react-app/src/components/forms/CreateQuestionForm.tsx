import React from 'react'
import { makeStyles } from '@material-ui/core'
import Text from '../atoms/inputs/Text'

interface CreateQuestionFormProps {
    index: number
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

const CreateQuestionForm = ({ index }: CreateQuestionFormProps) => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Text
                className={classes.field}
                InputProps={{
                    className: classes.input,
                }}
                label="Description"
                name={`description${index}`}
                type="text" 
                wrapperClass={classes.fieldWrapper}
            />
            <Text
                className={classes.field}
                InputProps={{
                    className: classes.input,
                }}
                label="Price Point"
                name={`answerSet${index}`}
                type="number" 
                wrapperClass={classes.fieldWrapper}                
            />
            <Text
                className={classes.field}
                InputProps={{
                    className: classes.input,
                }}
                label="Bounty"
                name={`bounty${index}`}
                type="number" 
                wrapperClass={classes.fieldWrapper}                
            />
        </div>
    )
}

export default CreateQuestionForm
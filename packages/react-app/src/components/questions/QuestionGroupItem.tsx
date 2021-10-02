import React from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import Typography from "@material-ui/core/Typography"
import { QuestionGroupView } from '../../types/questionGroup'

const useStyles = makeStyles(theme => ({
  questionGroupItem: {
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '32px'
  },
  questionGroupColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 0,
  },
  questionGroupWrapper: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'flex-start',
      flexDirection: 'column'
    },
  },
  questionGroupCategory: {
    backgroundColor:'#333333',
    borderRadius: '4px',
    color: 'white',
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '16px',
    fontWeight: 600,
    padding: '8px',
    width: 'fit-content',
    [theme.breakpoints.down('sm')]: {
      marginTop: '8px'
    }    
  },
  questionGroupLength: {
    color: 'white',
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '16px',
    fontWeight: 600,
    marginLeft: '8px',
    width: 'fit-content',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '0',
      marginTop: '8px'
    }
  },
  questionGroupTime: {
    alignSelf: 'flex-end',
    border: '2px solid #E95F36',
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '16px',
    fontWeight: 700,
    marginTop: '4px',
    justifySelf: 'end',
    textAlign: 'right',
    padding: '4px',
    width: 'fit-content'
  },
  questionGroupPool: {
    fontFamily: [
      'Rajdhani',
      'sans-serif'
    ].join(', '),
    fontSize: '24px',
    fontWeight: 500,
    marginTop: '16px',
    textAlign: 'right',
    padding: '4px',
    [theme.breakpoints.down('sm')]: {
      marginTop: '8px',
      justifySelf: 'flex-end'
    }
  },
  questionPoolValue: {
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      marginTop: '8px'
    }
  }
}));

const QuestionGroupItem = ({questionGroup}: {questionGroup: QuestionGroupView}) => {
  const classes = useStyles();

  return (
    <div className={classes.questionGroupItem}> 
      <div className={classes.questionGroupColumn}>
        <Typography variant="h3">Group #{questionGroup.id}</Typography>
        <div className={classes.questionGroupWrapper}>
          <div className={classes.questionGroupCategory}>#{questionGroup.questionViews[0].category.label}</div>
          <div className={classes.questionGroupLength}><RouterLink to={`/wisdom-node/answering/${questionGroup.id}`}>{questionGroup.questions.length} Questions</RouterLink></div>
        </div>
      </div>

      <div className={classes.questionGroupColumn}>
        { false && <div className={classes.questionGroupTime}>Time left: 00:00:00</div>}
        <div className={classes.questionGroupPool}>Total Pool: <span className={classes.questionPoolValue}>{questionGroup.totalBountyDisplay} $LITH</span></div>
      </div>
    </div>
  )
}

export default QuestionGroupItem
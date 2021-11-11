import * as Yup from 'yup'; 

export const GROUND_TRUTH_ASSETS = [
  'ethereum',
  'bitcoin'
]

export const pricingQuestionDefaults = {
  description: '',
  answerSet: '0',
  bounty: '0',
  questionType: 0
}

export const groundTruthQuestionDefaults = {
  description: GROUND_TRUTH_ASSETS[0],
  answerSet: '0',
  bounty: '0',
  questionType: 1
}

const pricingQuestionSchema = Yup.object({
  description: Yup.string().required('Required'),
  answerSet: Yup.string().required('Required'),
  bounty: Yup.string().required('Required')
})

const groundTruthQuestionSchema = Yup.object({
  description: Yup.string().oneOf(GROUND_TRUTH_ASSETS).required('Required'),
  answerSet: Yup.string().required('Required')
})

const createQuestionGroupSchema = {
  defaultValues: {
    category: '1',
    minimumRequiredAnswers: 1,
    startTime: '0',
    endTime: '0',
    pricingTime: '0',
    pricingQuestions: [{...pricingQuestionDefaults}],
    groundTruthQuestions: [{...groundTruthQuestionDefaults}]
},
  schema: Yup.object({
    category: Yup.string().required('Required'),
    minimumRequiredAnswers: Yup.number().required('Required'),
    startTime: Yup.string().required('Required'),
    endTime: Yup.string().required('Required'),
    pricingTime: Yup.string().required('Required'),
    pricingQuestions: Yup.array().of(
      pricingQuestionSchema
    ).required('Required'),
    groundTruthQuestions: Yup.array().of(
      groundTruthQuestionSchema
    ).required('Required')
  })
}

export default createQuestionGroupSchema

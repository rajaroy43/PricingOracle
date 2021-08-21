import * as Yup from 'yup'; 

const ONE_DAY = 24 * 60 * 60 * 1000
export const createQuestionSchema = {
  defaultValues: {
    description: '',
    answerSet: '1',
    endTime: new Date().getTime() + 2 * ONE_DAY,
    pricingTime: new Date().getTime() + 7 * ONE_DAY,
    bounty: '0'
  },
  schema: Yup.object({
    description: Yup.string().required('Required'),
    // TODO make answer set this an array of string
    answerSet: Yup.string().required('Required'),
    endTime: Yup.string().required('Required'),
    pricingTime: Yup.string().required('Required'),
    bounty: Yup.string().required('Required')
  })
}
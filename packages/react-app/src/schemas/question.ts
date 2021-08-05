import * as Yup from 'yup'; 

export const createQuestionSchema = {
  defaultValues: {
    description: '',
    answerSet: '1',
    endTime: new Date().getTime(),
    bounty: '0'
  },
  schema: Yup.object({
    description: Yup.string().required('Required'),
    // TODO make answer set this an array of string
    answerSet: Yup.string().required('Required'),
    endTime: Yup.string().required('Required'),
    bounty: Yup.string().required('Required')
  })
}
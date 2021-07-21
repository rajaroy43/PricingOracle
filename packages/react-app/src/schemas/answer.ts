import * as Yup from 'yup';

export const answerQuestionSchema = {
  defaultValues: {
    answerIndex: 0,
    stakeAmount: '0'
  },
  schema: Yup.object({
    answerIndex: Yup.number()
      .required('Required'),
    stakeAmount: Yup.string()
      .required('Required')
  })
}
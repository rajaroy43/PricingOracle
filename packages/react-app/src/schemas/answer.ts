import * as Yup from 'yup';

export const answerQuestionGroupSchema = {
  defaultValue: {
    answerIndex: '0',
    stakeAmount: '0'
  },
  schema: Yup.object().shape({
    answers: Yup.array().of(
      Yup.object().shape({
        answerIndex: Yup.string().required("Answer required"),
        stakeAmount: Yup.string().required("Stake required")
      })
    )
  })
}


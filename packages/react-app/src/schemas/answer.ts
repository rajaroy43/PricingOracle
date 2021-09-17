import * as Yup from 'yup';

export const answerQuestionGroupSchema = {
  defaultValue: {
    answerIndex: 0,
    stakeAmount: '0'
  },
  schema: Yup.array().of(
    Yup.object().shape({
      answerIndex: Yup.number().required("Answer required"),
      stakeAmount: Yup.string()
        .required("Stake required")
    })
  )
}


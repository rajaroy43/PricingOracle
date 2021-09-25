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
        stakeAmount: Yup.number()
                      .typeError("Stake Amount must be a number")
                      .min(0, "Stake Amount must be a positive number")
                      .required("Stake Amount is required")
      })
    )
  })
}


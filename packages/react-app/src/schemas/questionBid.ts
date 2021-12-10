import * as Yup from 'yup';

const questionBidSchema = {
  defaultValues: {
    questionBidAmount: '0'
  },
  schema: Yup.object({
    questionBidAmount: Yup.string().required('Required'),  })
}

export default questionBidSchema
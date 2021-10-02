import * as Yup from 'yup'; 

const createQuestionGroupSchema = {
  defaultValues: {
    category: '1',
    startTime: '0',
    endTime: '0',
    pricingTime: '0',
    description0: '',
    description1: '',
    description2: '',
    description3: '',
    answerSet0: '',
    answerSet1: '',
    answerSet2: '',
    answerSet3: '',
    bounty0: '',
    bounty1: '',
    bounty2: '',
    bounty3: '',
},
  schema: Yup.object({
    category: Yup.string().required('Required'),
    startTime: Yup.string().required('Required'),
    endTime: Yup.string().required('Required'),
    pricingTime: Yup.string().required('Required')
  })
}

export default createQuestionGroupSchema

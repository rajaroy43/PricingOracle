import numpy as np
from utils.ParseSchema import prepareDataSchema,returnDataSchema

def prepareValidationData(question):
  validationData={}
  validationData['questionId']=question[0]
  validationData['questionGroupId']=question[1]
  validationData['worker-id']=question[2]
  validationData['answerSet']=question[3]
  validationData['answerValue']=question[4]
  validationData['stakeAmount']=question[5]
  validationData['wisdomNodeReputation']=question[6]
  return validationData


def prepareDataPayload(data):
  formattedData=[]
  wisdomNodeAddress_AnswersValues={}
  for question in data:
    if len(question) == 0:
      raise ValueError('Empty questions/answers')
    #Schema get validated here 
    prepareDataSchema.validate(prepareValidationData(question))
    key=question[2]
    if key not in wisdomNodeAddress_AnswersValues:
      wisdomNodeAddress_AnswersValues[key]=[question[4]]
    else:
      wisdomNodeAddress_AnswersValues[key].append(question[4])
  
  #Converting dict data to 2-d array
  for wisdomNodeAddress,answerValues in wisdomNodeAddress_AnswersValues.items():
    formattedData.append([wisdomNodeAddress,np.array(answerValues)])

  return formattedData



    #below is the full deal.  in this python we only have rewards and answers. 

    # Raja -- can you convert this into a schema like above?

#    return shape of the calculate_reward endpoint {
#    answerStatus: 0 | 1 #0 = success, 1 = failure
#    questionGroupId: string,
#    questionIds: string[],
#    finalAnswerIndex: int[],
#    finalAnswerValue: int[],
#    wisdomNodeUpdates: [wisdomNodeAddress, updatedReward, updatedReputationScore][]
#    }

def returnFormattedData(rewards, answers):
  #  Need to add schema validate here on the returned data
  #returnDataSchema.validate(returnedData)
  returnData = [0, 12345, "QuestionIDs", [0, 0, 0, 0], answers, rewards ]
  return returnData
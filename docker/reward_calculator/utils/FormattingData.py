import numpy as np
from utils.ParseSchema import prepareDataSchema,returnDataSchema

def prepareValidationData(question):
  validationData={}
  validationData['questionGroupId']=question[0]
  validationData['worker-id']=question[1]
  validationData['questionId']=question[2]
  validationData['answerSet']=[int(i) for i in question[3]]
  validationData['answerValue']=int(question[4])
  validationData['stakeAmount']=int(question[5])
  validationData['wisdomNodeReputation']=int(question[6])
  return validationData


def prepareOutgoingValidationData(questionGroupId,questionIds,rewards, answers):
  validationData={}
  validationData['questionGroupId']=str(questionGroupId)
  validationData['questionIds']=questionIds
  validationData['answerStatus']=0
  finalAnswerValues=[]
  finalAnswerIndexes=[]
  for answer in answers:
    finalAnswerValues.append(float(answer[0]))
    finalAnswerIndexes.append(0)
  validationData["finalAnswerIndex"]=finalAnswerIndexes
  validationData["finalAnswerValue"]=finalAnswerValues
  wisdomNodeUpdates= []
  for reward in rewards:
    wisdomNodeUpdates.append([str(reward[0]),float(reward[1]),0.0])
  validationData["wisdomNodeUpdates"]=wisdomNodeUpdates
  return validationData

def prepareDataPayload(data):
  formattedData=[]
  wisdomNodeAddress_AnswersValues={}
  questionGroupIds=[]
  for question in data:
    if len(question) == 0:
      raise ValueError('Empty questions/answers')
    #Schema get validated here 
    prepareDataSchema.validate(prepareValidationData(question))
    key=question[1]
    questionGroupIds.append(question[0])
    if key not in wisdomNodeAddress_AnswersValues:
      wisdomNodeAddress_AnswersValues[key]=[[question[0],question[4]]]
    else:
      wisdomNodeAddress_AnswersValues[key].append([question[0],question[4]])
  #print(wisdomNodeAddress_AnswersValues)

  #validating questionGroup
  finalQuestionGroup=set(questionGroupIds)
  if(len(finalQuestionGroup) !=1 ):
    raise ValueError("More than 1 questionGroupId")
  questionGroup=list(finalQuestionGroup)[0]

  #Converting dict data to 2-d array

  for wisdomNodeAddress,answerValues in wisdomNodeAddress_AnswersValues.items():
    answers=[]
    questionIds=[]
    for answerValue in answerValues:
      questionIds.append(answerValue[0])
      answers.append(answerValue[1])
    formattedData.append([wisdomNodeAddress,answers,questionIds])
  return formattedData,questionGroup



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

def returnFormattedData(questionGroupId,questionIds,rewards, answers):
  #  Need to add schema validate here on the returned data
  #returnDataSchema.validate(returnedData)
  #returnData = [0, 12345, "QuestionIDs", [0, 0, 0, 0], answers, rewards ]
  returnData=prepareOutgoingValidationData(questionGroupId,questionIds,rewards, answers)
  print("returnFormattedData",returnData)
  returnDataSchema.validate(returnData)
  return returnData
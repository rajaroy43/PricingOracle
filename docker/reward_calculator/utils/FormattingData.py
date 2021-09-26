import numpy as np
from utils.ParseSchema import prepareDataSchema,returnDataSchema
from utils.LithClass import Metadata

# [questionGroupId, numberQuestionChoices, numberQuestions, questionGroupCategory, wisdomNodeAddess, questionId, answerSet, answerValue, answerIndex, stakeAmount, wisdomNodeReputation, totalBounty, totalStaked]

def prepareValidationData(answer):
  validationData={}
  validationData['questionGroupId']=answer[0]
  validationData['numberQuestionChoices']=int(answer[1])
  validationData['numberQuestions']=int(answer[2])
  validationData['questionGroupCategory']=int(answer[3])
  validationData['wisdomNodeAddress']=answer[4]
  validationData['questionId']=int(answer[5])
  validationData['answerSet']=[int(i) for i in answer[6]]
  validationData['answerValue']=int(answer[7])
  validationData['answerIndex']=int(answer[8])
  validationData['stakeAmount']=int(answer[9])
  validationData['wisdomNodeReputation']=int(answer[10])
  validationData['totalBounty']=int(answer[11])
  validationData['totalStake']=int(answer[12])

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

# [questionGroupId, numberQuestionChoices, numberQuestions, questionGroupCategory, wisdomNodeAddess, questionId, answerSet, answerValue, answerIndex, stakeAmount, wisdomNodeReputation, totalBounty, totalStaked]
def prepareDataPayload(data):
  metadata
  dmi_data
  num_answers
  reputation_staking

  prepped_data = [prepareValidationData(a) for a in data]

  wisdom_node_answers = {}
  user_total_stake = {}
  question_totals = {}
  user_reputation = {}
  group_totals = {
    stake: 0,
    bounty: 0
  }
  categoryId = prepped_data[0]['questionGroupCategory']

  sorted_data = sorted(prepped_data, key= lambda r: r['questionId'])


  for answer in sorted_data:
    node_address = answer['wisdomNodeAddress']
    if node_address not in wisdom_node_answers:
      wisdom_node_answers[node_address]=[ [answer['answerIndex']], answer['answerValue']], [answer['questionId']] ]
      user_total_stake[node_address] = answer['stakeAmount']
      user_reputation[node_address] = answer['wisdomNodeReputation']
    else:
      wisdom_node_answers[node_address][0].append(answer['answerIndex'])
      wisdom_node_answers[node_address][1].append(answer['answerValue'])
      wisdom_node_answers[node_address][2].append(answer['questionId'])
      user_total_stake[node_address] = user_total_stake[node_address] + answer['stakeAmount'] 

    if answer['questionId'] not in question_totals:
      question_totals[answer['questionId']] = [data[11], data[12]]

  for total in question_totals.values():
    group_totals.bounty = group_totals.bounty + total[0] 
    group_totals.stake = group_totals.stake + total[1]

  group_meta_data = Metadata(
    answer_row[0], answer_row[1], answer_row[2], answer_row[3], group_totals.bounty, group_totals.staked
  )

  answer_items = wisdom_node_answers.items()
  dmi_data = [[k, v[0], v[2]] for k,v in answer_items]
  num_answers = [[k, v[1], v[2]] for k,v in answer_items]
  reputation_staking = [[address, user_total_stake[address], user_reputation[address], categoryId] for address in user_total_stake.keys()]

  return group_meta_data, dmi_data, num_answers, reputation_staking



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
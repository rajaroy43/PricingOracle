from schema import  And,Schema

#type checking
def check_types(data,data_type):
  for i in data:
    if data_type!=type(i):
	    return False
  return True

def checkWisdomNodeData(wisdomNodeUpdates,data_type):
  if(check_types(wisdomNodeUpdates,data_type)):
    # wisdomNodeUpdates= [wisdomNodeAddress, updatedReward, updatedReputationScore][]
    for wisdomNode in wisdomNodeUpdates:
      if len(wisdomNode) != 3:
        return False
      if type(wisdomNode[0]) !=str or type(wisdomNode[1]) != float or type(wisdomNode[2]) != float:
        return False
    else:
      return True
  else:
    return False

#Incomming data from cordinator schema validation
prepareDataSchema = Schema({'questionId': str,
                 'questionGroupId':str, 
                 'worker-id':str,
                 'answerSet':And(list,lambda answerSets:check_types(answerSets,int)),
                 'answerValue':int,
                 'answerIndex':int,
                 'stakeAmount':int,
                 'wisdomNodeReputation':int
                 })

#return data to cordinator schema validation 
returnDataSchema = Schema({
                  "answerStatus":And(int,lambda answerStatus:answerStatus ==0 or answerStatus ==1),
                  "questionGroupId": str,
                  "questionIds": And(list,lambda ids: check_types(ids,str)),
                  "finalAnswerIndex": And(list,lambda finalAnswerIndex: check_types(finalAnswerIndex,int)),
                  "finalAnswerValue": And(list,lambda finalAnswerValue: check_types(finalAnswerValue,float)),
                  "wisdomNodeUpdates":And(list,lambda wisdomNodeUpdates: checkWisdomNodeData(wisdomNodeUpdates,list))
                    })
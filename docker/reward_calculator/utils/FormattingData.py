from schema import And, Schema
def check_types(data,data_type):
  for i in data:
    if data_type!=type(i):
	    return False
  return True
schema = Schema({'questionId': And(list,lambda ids: check_types(ids,int)),
                 'questionGroupId':And(list,lambda groupIds:check_types(groupIds,str)), 
                 'worker-id':And(list,lambda workerIds:check_types(workerIds,str)),
                 'answerSet':And(list,lambda answerSets:check_types(answerSets,list)),
                 'answerValue':And(list,lambda answerValues:check_types(answerValues,int)),
                 'stakeAmount':And(list,lambda stakeAmounts:check_types(stakeAmounts,int)),
                 'wisdomNodeReputation':And(list,lambda reputations:check_types(reputations,int))
                 })          
def getFormattedData(data):
  #Schema get validated here 
  schema.validate(data)
  formattedData=[]
  for i,j in data.items():
    formattedData.append(j)
  return formattedData
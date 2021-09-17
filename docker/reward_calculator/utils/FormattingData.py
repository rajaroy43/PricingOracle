from schema import  Schema
schema = Schema([str,int,str,list,int,int,int])  

def prepareDataPayload(data):
  formattedData=[]
  wisdomNodeAddress_AnswersValues={}
  for question in data:
    #Schema get validated here 
    schema.validate(question)
    key=question[2]
    if key not in wisdomNodeAddress_AnswersValues:
      wisdomNodeAddress_AnswersValues[key]=[question[4]]
    else:
      wisdomNodeAddress_AnswersValues[key].append(question[4])
  
  #Converting dict data to 2-d array
  for wisdomNodeAddress,answerValues in wisdomNodeAddress_AnswersValues.items():
    formattedData.append([wisdomNodeAddress,answerValues])

  return formattedData
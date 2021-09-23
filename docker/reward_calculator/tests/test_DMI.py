from utils.FormattingData import prepareDataPayload
import json
import pytest
from Calculate_rewards import calculate_rewards
with open('tests/mockData.json') as f:
  data = json.load(f)

def test_Should_Have_Proper_Wisdom_NodeAddress():
  n_choices, num_answers = (2,4)
  rewards=calculate_rewards(data, n_choices,num_answers)
  numberOfWisdomNode=0
  print("rewards",rewards["wisdomNodeUpdates"])
  formattedData,questionGroup = prepareDataPayload(data)
  assert(questionGroup == int(rewards["questionGroupId"]))
  for row in formattedData:
    numberOfWisdomNode += 1
  assert(len(rewards["wisdomNodeUpdates"]) == numberOfWisdomNode)
  
def test_Should_Fail_For_10_Choices():
  n_choices, num_answers = (10,4)
  with pytest.raises(ValueError,match="Insufficient number of tasks."):
    calculate_rewards(data, n_choices,num_answers)


def test_Should_Fail_Empty_Answers():
  n_choices, num_answers = (2,4)
  data=[[]]
  with pytest.raises(ValueError,match="Empty questions/answers"):
    calculate_rewards(data, n_choices,num_answers)

def test_Should_Fail_For_only_1_WisdomNodeAnswers():
  n_choices, num_answers = (2,4)
  data=[
  ["SP500",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0],
  ["DOW",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0],
  ["BITCOIN",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],0,0,0],
  ["ETHEREUM",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],0,0,0],
  ["Gamestop",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0],
  ["Tesla",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0]
  ]
  with pytest.raises(ValueError,match="Too few agents."):
    calculate_rewards(data, n_choices,num_answers)

def test_Should_Fail_For_More_Than_1_Questiongroup():
  n_choices, num_answers = (2,4)
  data=[
  ["SP500",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0],
  ["DOW",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0],
  ["BITCOIN",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],0,0,0],
  ["ETHEREUM",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],0,0,0],
  ["Gamestop",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0],
  ["Tesla",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0],
  ["SP500",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0],
  ["DOW",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0],
  ["BITCOIN",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],0,0,0],
  ["ETHEREUM",123459,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],0,0,0],
  ["Gamestop",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0],
  ["Tesla",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0]
  ]
  with pytest.raises(ValueError,match="More than 1 questionGroupId"):
    calculate_rewards(data, n_choices,num_answers)

def test_Should_Fail_For_DifferentQuestionIds():
  n_choices, num_answers = (2,4)
  data=[
  ["SP500",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0],
  ["DOW",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0],
  ["BITCOIN",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],0,0,0],
  ["ETHEREUM",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],0,0,0],
  ["Gamestop",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0],
  ["Tesla",123456,"3MYYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0],
  ["SP8500",123456,"3MYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0],
  ["DOW",123456,"3MYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0],
  ["BITCOIN",123456,"3MYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],0,0,0],
  ["ETHEREUM",123456,"3MYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],0,0,0],
  ["Gamestop",123456,"3MYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0],
  ["Tesla",123456,"3MYFCXHJ4ZLHL7L0W7P29FANGZG4A",[0, 1, 2],1,0,0]
  ]
  with pytest.raises(ValueError,match="Invalid QuestionIDs"):
    calculate_rewards(data, n_choices,num_answers)
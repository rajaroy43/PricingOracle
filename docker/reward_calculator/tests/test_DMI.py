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
  assert(questionGroup == rewards["questionGroupId"])
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
   ["0", "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65", "0", ["0", "50"], "50",1, "2", "0"], 
   ["0", "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", "0", ["0", "50"], "50",1, "49", "0"], 
   ["0", "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", "0", ["0", "50"], "0", 1,"84", "0"], 
   ["0", "0x90f79bf6eb2c4f870365e785982e1f101e93b906", "0", ["0", "50"], "50",1, "1", "0"], 
   ["0", "0x976ea74026e726554db657fa54763abd0c3a0aa9", "0", ["0", "50"], "0", 1,"50", "0"], 
   ["0", "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc", "0", ["0", "50"], "0",1, "87", "0"]
  ]
  with pytest.raises(ValueError,match="Insufficient number of tasks."):
    calculate_rewards(data, n_choices,num_answers)

def test_Should_Fail_For_More_Than_1_Questiongroup():
  n_choices, num_answers = (2,4)
  data=[
   ["0", "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65", "0", ["0", "50"], "50",1, "2", "0"], 
   ["0", "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", "0", ["0", "50"], "50",1, "49", "0"], 
   ["0", "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", "0", ["0", "50"], "0", 1,"84", "0"], 
   ["0", "0x90f79bf6eb2c4f870365e785982e1f101e93b906", "0", ["0", "50"], "50",1, "1", "0"], 
   ["0", "0x976ea74026e726554db657fa54763abd0c3a0aa9", "0", ["0", "50"], "0", 1,"50", "0"], 
   ["0", "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc", "0", ["0", "50"], "0",1, "87", "0"], 
   ["0", "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65", "0", ["0", "50"], "50",1, "2", "0"], 
   ["0", "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", "0", ["0", "50"], "50",1, "49", "0"], 
   ["1", "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", "0", ["0", "50"], "0", 1,"84", "0"], 
   ["0", "0x90f79bf6eb2c4f870365e785982e1f101e93b906", "0", ["0", "50"], "50",1, "1", "0"], 
   ["0", "0x976ea74026e726554db657fa54763abd0c3a0aa9", "0", ["0", "50"], "0", 1,"50", "0"], 
   ["0", "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc", "0", ["0", "50"], "0",1, "87", "0"], 
  ]
  with pytest.raises(ValueError,match="More than 1 questionGroupId"):
    calculate_rewards(data, n_choices,num_answers)

def test_Should_Fail_For_DifferentQuestionIds():
  n_choices, num_answers = (2,4)
  data=[
   ["0", "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65", "0", ["0", "50"], "50",1, "2", "0"], 
   ["0", "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", "0", ["0", "50"], "50",1, "49", "0"], 
   ["0", "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", "0", ["0", "50"], "0", 1,"84", "0"], 
   ["0", "0x90f79bf6eb2c4f870365e785982e1f101e93b906", "0", ["0", "50"], "50",1, "1", "0"], 
   ["0", "0x976ea74026e726554db657fa54763abd0c3a0aa9", "0", ["0", "50"], "0", 1,"50", "0"], 
   ["0", "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc", "0", ["0", "50"], "0",1, "87", "0"], 
   ["0", "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65", "1", ["0", "50"], "50",1, "2", "0"], 
   ["0", "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", "0", ["0", "50"], "50",1, "49", "0"], 
   ["0", "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", "0", ["0", "50"], "0", 1,"84", "0"], 
   ["0", "0x90f79bf6eb2c4f870365e785982e1f101e93b906", "0", ["0", "50"], "50",1, "1", "0"], 
   ["0", "0x976ea74026e726554db657fa54763abd0c3a0aa9", "0", ["0", "50"], "0", 1,"50", "0"], 
   ["0", "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc", "0", ["0", "50"], "0",1, "87", "0"], 
  ]
  with pytest.raises(ValueError,match="Invalid QuestionIDs"):
    calculate_rewards(data, n_choices,num_answers)
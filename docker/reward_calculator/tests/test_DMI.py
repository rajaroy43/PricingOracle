from utils.FormattingData import prepareDataPayload
import json
import pytest
from Calculate_rewards import calculate_rewards
with open('tests/mockData.json') as f:
  data = json.load(f)

def test_Should_Have_Proper_Wisdom_NodeAddress():
  rewards=calculate_rewards(data)
  numberOfWisdomNode = 0
  print("rewards calculated here",rewards["wisdomNodeUpdates"])
  preparedData = prepareDataPayload(data)
  formattedData = preparedData[0]
  reputation_staking = preparedData[2]
  assert(formattedData.questionGroupId == rewards["questionGroupId"])
  for row in reputation_staking:
    numberOfWisdomNode += 1
  assert(len(rewards["wisdomNodeUpdates"]) == numberOfWisdomNode)
  
def test_Should_Fail_For_10_Choices():
  modifiedData = []
  for row in data:
    row[1] ="10"
    modifiedData.append(row)

  with pytest.raises(ValueError,match="Insufficient number of tasks."):
    calculate_rewards(modifiedData)


def test_Should_Fail_Empty_Data():
  data=[[]]
  #raise issue when preparing data 
  # validationData['questionGroupId']=answer[0]
  with pytest.raises(IndexError,match="list index out of range"):
    calculate_rewards(data)

def test_Should_Fail_For_only_1_WisdomNodeAnswers():
  data=[ 
   ["0","2","4","12345", "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65", "0", ["0", "50"], "50",1, "2", "0","1000","100"], 
   ["0","2","4","12345", "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", "0", ["0", "50"], "50",1, "49", "0","1000","100"], 
   ["0","2","4","12345", "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", "0", ["0", "50"], "0", 1,"84", "0","1000","100"], 
   ["0","2","4","12345", "0x90f79bf6eb2c4f870365e785982e1f101e93b906", "0", ["0", "50"], "50",1, "1", "0","1000","100"], 
   ["0","2","4","12345", "0x976ea74026e726554db657fa54763abd0c3a0aa9", "0", ["0", "50"], "0", 1,"50", "0","1000","100"], 
   ["0","2","4","12345", "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc", "0", ["0", "50"], "0",1, "87", "0","1000","100"]
  ]
  with pytest.raises(ValueError,match="Insufficient number of tasks."):
    calculate_rewards(data)

def test_Should_Fail_For_More_Than_1_Questiongroup():
  data=[
   ["0","2","4","12345","0x15d34aaf54267db7d7c367839aaf71a00a2c6a65", "0", ["0", "50"], "50",1, "2", "0","1000","100"], 
   ["0","2","4","12345","0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", "0", ["0", "50"], "50",1, "49", "0","1000","100"], 
   ["0","2","4","12345","0x70997970c51812dc3a010c7d01b50e0d17dc79c8", "0", ["0", "50"], "0", 1,"84", "0","1000","100"], 
   ["0","2","4","12345","0x90f79bf6eb2c4f870365e785982e1f101e93b906", "0", ["0", "50"], "50",1, "1", "0","1000","100"], 
   ["0","2","4","12345","0x976ea74026e726554db657fa54763abd0c3a0aa9", "0", ["0", "50"], "0", 1,"50", "0","1000","100"], 
   ["0","2","4","12345","0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc", "0", ["0", "50"], "0",1, "87", "0","1000","100"], 
   ["0","2","4","12345","0x15d34aaf54267db7d7c367839aaf71a00a2c6a65", "0", ["0", "50"], "50",1, "2", "0","1000","100"], 
   ["0","2","4","12345","0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", "0", ["0", "50"], "50",1, "49", "0","1000","100"], 
   ["1","2","4","12345","0x70997970c51812dc3a010c7d01b50e0d17dc79c8", "0", ["0", "50"], "0", 1,"84", "0","1000","100"], 
   ["0","2","4","12345","0x90f79bf6eb2c4f870365e785982e1f101e93b906", "0", ["0", "50"], "50",1, "1", "0","1000","100"], 
   ["0","2","4","12345","0x976ea74026e726554db657fa54763abd0c3a0aa9", "0", ["0", "50"], "0", 1,"50", "0","1000","100"], 
   ["0","2","4","12345","0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc", "0", ["0", "50"], "0",1, "87", "0","1000","100"], 
  ]
  with pytest.raises(ValueError,match="Insufficient number of tasks"):
    calculate_rewards(data)

def test_Should_Fail_For_DifferentQuestionIds():
  data=[
   ["0","2","4","12345","0x15d34aaf54267db7d7c367839aaf71a00a2c6a65", "0", ["0", "50"], "50",1, "2", "0","1000","100"], 
   ["0","2","4","12345","0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", "0", ["0", "50"], "50",1, "49","0","1000","100"], 
   ["0","2","4","12345","0x70997970c51812dc3a010c7d01b50e0d17dc79c8", "0", ["0", "50"], "0", 1,"84", "0","1000","100"], 
   ["0","2","4","12345","0x90f79bf6eb2c4f870365e785982e1f101e93b906", "0", ["0", "50"], "50",1, "1", "0","1000","100"], 
   ["0","2","4","12345","0x976ea74026e726554db657fa54763abd0c3a0aa9", "0", ["0", "50"], "0", 1,"50", "0","1000","100"], 
   ["0","2","4","12345","0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc", "0", ["0", "50"], "0",1, "87", "0","1000","100"], 
   ["0","2","4","12345","0x15d34aaf54267db7d7c367839aaf71a00a2c6a65", "1", ["0", "50"], "50",1, "2", "0","1000","100"], 
   ["0","2","4","12345","0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", "0", ["0", "50"], "50",1, "49", "0","1000","100"], 
   ["0","2","4","12345","0x70997970c51812dc3a010c7d01b50e0d17dc79c8", "0", ["0", "50"], "0", 1,"84", "0","1000","100"], 
   ["0","2","4","12345","0x90f79bf6eb2c4f870365e785982e1f101e93b906", "0", ["0", "50"], "50",1, "1", "0","1000","100"], 
   ["0","2","4","12345","0x976ea74026e726554db657fa54763abd0c3a0aa9", "0", ["0", "50"], "0", 1,"50", "0","1000","100"], 
   ["0","2","4","12345","0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc", "0", ["0", "50"], "0",1, "87", "0","1000","100"], 
  ]
  with pytest.raises(ValueError,match="Insufficient number of tasks"):
    calculate_rewards(data)
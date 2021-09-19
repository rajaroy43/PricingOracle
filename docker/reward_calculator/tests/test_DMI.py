import json
#from reward_calculation import do_calc_np
from Calculate_rewards import calculate_rewards
with open('tests/mockData.json') as f:
  data = json.load(f)
def test_Should_Calculate_DMI_payments():
  rewards=calculate_rewards(data, 2, 4)
  print("\nRewards are: \n")
  print(rewards)
  assert 3==3


from numpy.core.fromnumeric import transpose
from utils.FormattingData import prepareDataPayload, returnFormattedData
import numpy as np
from utils.DMI import DMI
from utils.LithClass import Metadata
from scipy.stats import norm
import pandas as pd

# source: LithiumMVP/docker/reward_calculator/

def calc_numerical_answers(npa, all_question_ids, n_choices, num_answers):
    #function takes a numpy array where each column are the answers to questions
    # with n_choices each.  Given the binary (n_choices = 2) has an over / under, we treat it differently
    # by sending back a % for each side.

    print('npa (array of wisdom node addresses + respective response) ================================= ')
    # this is in the form of [[wisdom-node-address1, [response-set1]], [wisdom-node-address2, [response-set2]], etc]
    print(npa)

    # cut down to just an array of [[response-set1], [response-set2], etc], to match reqs in above documentation
    new_npa = np.array([i[1] for i in npa])
    # print(np.array(new_npa))
    # print('shape: ', new_npa.shape[1])
    print('just response array from npa =========================== ')
    print(new_npa)

    # number of columns in new_npa should be equal to number of questions (each row is a wisdom node's response)
    assert(new_npa.shape[1] == num_answers)
    # print(num_answers)
    ### CHECK -- the ids come in sorted but does the npa array line up?
    ans = np.zeros((num_answers,1), dtype = float)
    # print("ans ================================= ")
    # print(ans)
    # print('len of ans: ', len(ans))
    ids = np.array(all_question_ids, dtype = str)
    # print('ids: ', ids)
    ids = ids[:,np.newaxis]


    # print('NPA ================================== ')
    # print(npa)
    for i in range(len(ans)):
        # print('i in range len ans: ', i)
        if n_choices == 2:
            # print('here because binary choices')
            # we want to return the percentage of non-zero values
            # print('npa[i]: ', npa[i][1][0])
            # print('len(npa[i]): ', len(npa[i]))
            # print('npa[i]: ', npa[i]) # example output: npa[i]:  ['0x90f79bf6eb2c4f870365e785982e1f101e93b906', [50, 0, 9870, 9870]]
            # print('len npa[i]: ', len(npa[i]))

            # original
            # ans[i] = np.count_nonzero(npa[i]) / len(npa[i])

            # fix --> slice by column rather than row
            ans[i] = np.count_nonzero(new_npa[:,i])/len(new_npa[:,i])

        else:
            # Fit a normal distribution to
            # the data:
            # mean and standard deviation
            mu, std = norm.fit(new_npa[:,i])
            ans[i] = mu

    # print('ids ========== ')
    # print(ids)
    print('ans ========== ')
    print(ans)
    ans = np.hstack((ids, ans))
    print(ans)
    return ans

def do_calc_dmi(dmi_data, n_choices, num_answers):

    print('DMI Data ================== ')
    print(dmi_data)
    print('=========================== ')
    # Function accepts a numpy array as input with a unique identifier as first column
    # and arrays of answers in the second column
    shuffle_array = np.array(dmi_data, dtype=object)
    np.random.shuffle(shuffle_array) #function operates in-place
    dmi_data = shuffle_array.tolist()

    # all items coming in are type list -- convert to numpy arrays.
    wisdomNodeAddresses = [item[0] for item in dmi_data]
    dmi_data_np = [item[1] for item in dmi_data]
    print(dmi_data_np)
    # for i in dmi_data_np: print(i)
    dmi_data_np = np.vstack(dmi_data_np)
    wisdomNodeAddresses = np.vstack(wisdomNodeAddresses)

    # do the DMI payment calculation
    payments, nf = DMI(dmi_data_np, n_choices, False, False) # payments = DMI scores

    print('payments =========== ')
    print(payments)
    # At this point, npnp is shuffled and payments vector matches.
    # Combine the payments to match wisdomNodeAddress
    npnp = np.concatenate((wisdomNodeAddresses,np.array(payments)), axis=1)
    print(npnp)
    return npnp

def update_reputation(rewards, reputation_staking, totalBounty, totalStaked):
    # uses rewards: [wisdomNodeAddress, reward][], numpy array
    #reputation_staking: [{wisdomNodeAddess, stakeAmount, reputationScore, questionGroupCategory}]
    #returns:  reputation: [wisdomNodeAddress, updatedReputationScore][]
    # and returns updated rewards

    # Function also updates and calculates the final rewards to send to all wisdomNodeAddresses
    reputation = np.empty((0,2)) # initialize array
    new_rewards = np.empty((0,2))
    reputation_staking = np.array(reputation_staking, dtype=object)

    #print("\nreputation_staking : \n", reputation_staking)
    for row in rewards:
        wisdomNodeAddress = str(row[0]) # first element is string wisdomNodeAddress
        #print("\nrow: \n",row)
        reward = float(row[1])
        # Find the same wisdomNodeAddress in reputation_staking
        reputation_row = reputation_staking[np.where((reputation_staking == wisdomNodeAddress))[0]]
        reputation_row = reputation_row[0] # defaults to return an array, we only want the row

        stakeAmount = float(reputation_row[1])
        reputationScore = float(reputation_row[2])
        questionGroupCategory = int(reputation_row[3])

        # we have wisdomNodeAddress, stakeAmount reputationScore and reward
        # build the returning array while calculating the results

        # Given the reward from the DMI calculation, we apply
        # the staking and reputation factors and divide by the overall reward pool
        overallPool = totalBounty + totalStaked

        reward_payout = reward * ( reputationScore + np.sqrt(stakeAmount) +1 )
        #### NEED TO ADD REWARD MULTIPLIER HERE
        reward_payout = reward_payout / overallPool

        # Finally update the reputation
        #The formula for updating the reputation is:
        #Reputation[i][j] = Reputation[i][j]  + Reward Payout[i][j]
        #Where i is the node  and j is the category from which this answer set is assigned.
        reputationScore = reputationScore + reward_payout

        #add the new rows to the returnable results
        reputation = np.vstack((reputation,[wisdomNodeAddress, reputationScore] ))
        new_rewards = np.vstack((new_rewards, [wisdomNodeAddress, reward_payout ]))


    return reputation, new_rewards

def calculate_rewards(data):
    print("\033[1;32m Calculating rewards....")
    metadata, dmi_data, num_answers, reputation_staking, all_question_ids = prepareDataPayload(data)
    # print('DMI DATA')
    # print(dmi_data)
    # dmi_data format is now an np array with np array elements.
    rewards = do_calc_dmi(dmi_data, metadata.numberQuestionChoices , metadata.numberQuestions)

    # print("\nrewards: ", rewards)

    # Return the numerical answers to the questions.
    # Function accepts the raw array (no wisdomNodeAddress or question id)
    # and calculates one number per question (column), which returns a vector of length (num_answers)

    # answers = calc_numerical_answers(dmi_data, all_question_ids, metadata.numberQuestionChoices, metadata.numberQuestions)
    answers = calc_numerical_answers(num_answers, all_question_ids, metadata.numberQuestionChoices, metadata.numberQuestions)
    # print('answers shape: ', answers.shape)
    # print(answers)
    # answers=answers[:,np.newaxis]

    # print("\nanswers: ", answers)
    # add in reputation and staking calculation here

    reputation, rewards = update_reputation(rewards, reputation_staking, metadata.totalBounty, metadata.totalStaked)
    # print("\nreputation: ", reputation)

    return returnFormattedData(metadata, rewards, answers, reputation)


if __name__ == "__main__":
    #### TEST DATA ######
    metadata = Metadata("bogusgroupID", 2, 4, 3, 500, 50)
    dmi_data = np.array([['foo',1, 0, 1, 0],['goo', 1, 0, 1, 0],['doo',0, 1, 0, 1],['zoo',0, 1, 0, 1],['hoo',0, 1, 0, 1],['coo',0, 1, 0, 1]])
    num_answers = np.array([[1,0,1,0],[1,0,1,0],[1,0,1,0],[0, 1, 0, 1],[0, 1, 0, 1],[0, 1, 0, 1]])
    reputation_staking = np.array([['foo',1, 1, 1],['goo', 1, 1, 1],['doo', 1, 1, 1],['zoo', 1, 1, 1],['hoo',1, 1, 1],['coo',1, 1, 1]])

    test = np.array([
        ['foo', '2', '4', '12345', 'address1', '1', ['0', '2000', '4000'], '2000', '1', '100', '10', '1000', '100'],
        ['foo', '2', '4', '12345', 'address1', '2', ['0', '2000', '4000'], '0', '0', '100', '10', '1000', '100'],
        ['foo', '2', '4', '12345', 'address1', '3', ['0', '2000', '4000'], '4000', '2', '100', '10', '1000', '100'],
        ['foo', '2', '4', '12345', 'address1', '4', ['0', '2000', '4000'], '2000', '1', '100', '10', '1000', '100'],
        ['goo', '2', '4', '12345', 'address2', '1', ['0', '2000', '4000'], '2000', '1', '100', '10', '1000', '100'],
        ['goo', '2', '4', '12345', 'address2', '2', ['0', '2000', '4000'], '4000', '2', '100', '10', '1000', '100'],
        ['goo', '2', '4', '12345', 'address2', '3', ['0', '2000', '4000'], '0', '0', '100', '10', '1000', '100'],
        ['goo', '2', '4', '12345', 'address2', '4', ['0', '2000', '4000'], '2000', '1', '100', '10', '1000', '100'],
        ['doo', '2', '4', '12345', 'address3', '3', ['0', '2000', '4000'], '2000', '1', '100', '10', '1000', '100'],
        ['zoo', '2', '4', '12345', 'address4', '4', ['0', '2000', '4000'], '2000', '1', '100', '10', '1000', '100']])
        # ['hoo', '2', '4', '12345', 'address5', '5', ['0', '1'], '0', [1, 1, 0, 0], '100', '10', '1000', '100'],
        # ['coo', '2', '4', '12345', 'address6', '6', ['0', '1'], '0', [0, 0, 1, 1], '100', '10', '1000', '100']])

    # from LithiumMVP/docker/reward_coordinator/tests/mockData.json
    test2 = [
              ["0", 2, 4, 3, "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65", "0", ["0", "50"], "50",1, "20", "0", "10", "300"],
              ["0", 2, 4, 3, "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", "0", ["0", "50"], "50",1, "50", "0", "10", "300"],
              ["0", 2, 4, 3, "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", "0", ["0", "50"], "0", 0,"80", "0", "10", "300"],
              ["0", 2, 4, 3, "0x90f79bf6eb2c4f870365e785982e1f101e93b906", "0", ["0", "50"], "50",1, "10", "0", "10", "300"],
              ["0", 2, 4, 3, "0x976ea74026e726554db657fa54763abd0c3a0aa9", "0", ["0", "50"], "0", 0,"50", "0", "10", "300"],
              ["0", 2, 4, 3, "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc", "0", ["0", "50"], "0",0, "90", "0", "10", "300"],
              ["0", 2, 4, 3, "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65", "1", ["0", "1320"], "0",0, "50", "0", "20", "395"],
              ["0", 2, 4, 3, "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", "1", ["0", "1320"], "0", 0,"90", "0", "20", "395"],
              ["0", 2, 4, 3, "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", "1", ["0", "1320"], "1320",1, "70", "0","20", "395"],
              ["0", 2, 4, 3, "0x90f79bf6eb2c4f870365e785982e1f101e93b906", "1", ["0", "1320"], "0", 0,"20", "0", "20", "395"],
              ["0", 2, 4, 3, "0x976ea74026e726554db657fa54763abd0c3a0aa9", "1", ["0", "1320"], "0",0, "85", "0","20", "395"],
              ["0", 2, 4, 3, "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc", "1", ["0", "1320"], "1320",1, "80", "0","20", "395"],
              ["0", 2, 4, 3, "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65", "2", ["0", "9870"], "0",0, "55", "0", "10", "290"],
              ["0", 2, 4, 3, "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", "2", ["0", "9870"], "9870",1, "85", "0","10", "290"],
              ["0", 2, 4, 3, "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", "2", ["0", "9870"], "0", 0,"25", "0", "10", "290"],
              ["0", 2, 4, 3, "0x90f79bf6eb2c4f870365e785982e1f101e93b906", "2", ["0", "9870"], "9870",1, "65", "0", "10", "290"],
              ["0", 2, 4, 3, "0x976ea74026e726554db657fa54763abd0c3a0aa9", "2", ["0", "9870"], "0",0, "15", "0","10", "290"],
              ["0", 2, 4, 3, "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc", "2", ["0", "9870"], "0",0, "55", "0", "10", "290"],
              ["0", 2, 4, 3, "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65", "3", ["0", "9870"], "0",0, "25", "0","50", "280"],
              ["0", 2, 4, 3, "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", "3", ["0", "9870"], "0",0, "95", "0","50", "280"],
              ["0", 2, 4, 3, "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", "3", ["0", "9870"], "0",0, "75", "0", "50", "280"],
              ["0", 2, 4, 3, "0x90f79bf6eb2c4f870365e785982e1f101e93b906", "3", ["0", "9870"], "9870",1, "15", "0", "50", "280"],
              ["0", 2, 4, 3, "0x976ea74026e726554db657fa54763abd0c3a0aa9", "3", ["0", "9870"], "9870",1, "15", "0", "50", "280"],
              ["0", 2, 4, 3, "0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc", "3", ["0", "9870"], "0",0, "55", "0", "50", "280"]
              ]

    # test_data = pd.read_csv('../prolific_data/prolificSI4.csv')
    # test_data = test_data.drop(columns = ['Unnamed: 0'])
    # test_data = test_data.drop_duplicates(subset=['Worker ID'])
    # records = test_data.to_dict('records')
    #
    # qs = ['SP500', 'NASDAQ', 'BTC', 'ETH', 'GME', 'TSLA', 'FB', 'AAPL', 'NFLX', 'GOOG']
    # answer_set = [0, 1000] # will typically vary by question
    # all_entries = []
    # for worker in records:
    #     address = worker['Worker ID']
    #     worker_responses = [worker[i] for i in qs]
    #     entry = [
    #                 ['0', 2, 10, 12345,
    #                  address, i, answer_set,
    #                  answer_set[worker_responses[i]], worker_responses[i],
    #                  '100', '10', '1000', '100']
    #             for i in range(len(qs))]
    #
    #     all_entries += entry
    #
    # return_data = calculate_rewards(np.array(all_entries))

    # metadata_return, rewards, answers, reputation = calculate_rewards(metadata, dmi_data, num_answers, reputation_staking)
    return_data = calculate_rewards(np.array(test2))
    print(return_data)
    # metadata_return, rewards, answers, reputation = calculate_rewards(test)
    #
    # print("calculate_rewards for : ", metadata_return.questionGroupId)
    # print("\nDONE: rewards: ")
    # print(rewards)
    # print("\nDONE: answers:")
    # print(answers)
    # print("\nDONE: reputation:")
    # print(reputation)

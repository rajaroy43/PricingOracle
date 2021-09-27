from numpy.core.fromnumeric import transpose
from utils.FormattingData import prepareDataPayload, returnFormattedData
import numpy as np
from utils.DMI import DMI
from utils.LithClass import Metadata
from scipy.stats import norm



def calc_numerical_answers(npa, all_question_ids, n_choices, num_answers):
    #function takes a numpy array where each column are the answers to questions
    # with n_choices each.  Given the binary (n_choices = 2) has an over / under, we treat it differently
    # by sending back a % for each side.

    ### CHECK -- the ids come in sorted but does the npa array line up?
    ans = np.zeros((num_answers,1), dtype = float)
    ids = np.array(all_question_ids, dtype = str)
    ids = ids[:,np.newaxis]

    for i in range(len(ans)):
        if n_choices == 2:
            # we want to return the percentage of non-zero values
            ans[i] = np.count_nonzero(npa[i]) / len(npa[i])
        else:
            # Fit a normal distribution to
            # the data:
            # mean and standard deviation
            mu, std = norm.fit(npa[i])
            ans[i] = mu

    ans = np.hstack((ids, ans))
    return ans

def do_calc_dmi(dmi_data, n_choices, num_answers):

    # Function accepts a numpy array as input with a unique identifier as first column
    # and arrays of answers in the second column
    shuffle_array = np.array(dmi_data, dtype=object)
    np.random.shuffle(shuffle_array) #function operates in-place
    dmi_data = shuffle_array.tolist()

    # all items coming in are type list -- convert to numpy arrays.
    wisdomNodeAddresses = [item[0] for item in dmi_data]
    dmi_data_np = [item[1] for item in dmi_data]

    dmi_data_np = np.vstack(dmi_data_np)
    wisdomNodeAddresses = np.vstack(wisdomNodeAddresses)

    #print(dmi_data_np)

    # do the DMI payment calculation
    payments, nf = DMI(dmi_data_np,n_choices, False, False)

    # At this point, npnp is shuffled and payments vector matches.
    # Combine the payments to match wisdomNodeAddress
    npnp = np.concatenate((wisdomNodeAddresses,np.array(payments)), axis=1)
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

    # dmi_data format is now an np array with np array elements.
    rewards = do_calc_dmi(dmi_data, metadata.numberQuestionChoices , metadata.numberQuestions)

    print("\nrewards: ", rewards)

    # Return the numerical answers to the questions.
    # Function accepts the raw array (no wisdomNodeAddress or question id)
    # and calculates one number per question (column), which returns a vector of length (num_answers)
  
    answers = calc_numerical_answers(num_answers, all_question_ids, metadata.numberQuestionChoices, metadata.numberQuestions)
    #answers=answers[:,np.newaxis]

    print("\nanswers: ", answers)
    # add in reputation and staking calculation here

    reputation, rewards = update_reputation(rewards, reputation_staking, metadata.totalBounty, metadata.totalStaked)
    print("\nreputation: ", reputation)

    return returnFormattedData(metadata,rewards, answers, reputation)
    

if __name__ == "__main__":
    #### TEST DATA ######
    metadata = Metadata("bogusgroupID",2,4,3,500,50)
    dmi_data = np.array([['foo',1, 0, 1, 0],['goo', 1, 0, 1, 0],['doo',0, 1, 0, 1],['zoo',0, 1, 0, 1],['hoo',0, 1, 0, 1],['coo',0, 1, 0, 1]])
    num_answers = np.array([[1,0,1,0],[1,0,1,0],[1,0,1,0],[0, 1, 0, 1],[0, 1, 0, 1],[0, 1, 0, 1]])
    reputation_staking = np.array([['foo',1, 1, 1],['goo', 1, 1, 1],['doo', 1, 1, 1],['zoo', 1, 1, 1],['hoo',1, 1, 1],['coo',1, 1, 1]])

    metadata_return, rewards, answers, reputation = calculate_rewards(metadata, dmi_data, num_answers, reputation_staking)

    print("calculate_rewards for : ", metadata_return.questionGroupId)
    print("\nDONE: rewards: ")
    print(rewards)
    print("\nDONE: answers:")
    print(answers)
    print("\nDONE: reputation:")
    print(reputation)
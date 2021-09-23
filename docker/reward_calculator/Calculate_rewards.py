from numpy.core.fromnumeric import transpose
from utils.FormattingData import prepareDataPayload, returnFormattedData
import numpy as np
from utils.DMI import DMI
from scipy.stats import norm

def calc_numerical_answers(npa, n_choices, num_answers):
    #function takes a numpy array where each column are the answers to questions
    # with n_choices each.  Given the binary (n_choices = 2) has an over / under, we treat it differently
    # by sending back a % for each side.

    ans = np.zeros(num_answers, dtype = float)

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

    return ans

def do_calc_np(dmi_data, n_choices, num_answers):

    # Function accepts a numpy array as input with a unique identifier as first column
    # and arrays of answers in the second column
    np.random.shuffle(dmi_data) #function operates in-place

    # Need to remove first column as it's the worker-id
    np_to_calc_dmi = dmi_data[:,1:].astype(np.int64)
    workerids = dmi_data[:,0, None]

    # do the DMI payment calculation
    payments, nf = DMI(np_to_calc_dmi,n_choices, False, False)

    # Return the numerical answers to the questions.
    # Function accepts the raw array (no worker id or question id)
    # and calculates one number per question (column), which returns a vector of length (number of questions)
    answers = calc_numerical_answers(np_to_calc_dmi, n_choices, num_answers)
    answers=answers[:,np.newaxis]

    print(answers)  # this is an array of length num_answers

    # At this point, npnp is shuffled and payments vector matches.
    # Combine the payments to match workerIDs
    npnp = np.concatenate((workerids,np.array(payments)), axis=1)
    return npnp, answers


def calculate_rewards(data, n_choices, num_answers):
    print("\033[1;32m Calculating rewards....")
    passedData ,questionGroupId = prepareDataPayload(data)
    
    #Passed data should be like : 
    #[
    #   [wisdomNodeAddress1,[answerValue1,answerValue2,answerValue3,....]],
    #   [wisdomNodeAddress2,[answerValue1,answerValue2,answerValue3,.....]] 
    # ]

    # Convert list to 2 numpy arrays one with wisdomNodeAddress and one with array of answerValues
    wna = []
    arra = []
    i=0
    for i in range (len(passedData)-1):
        questionIds=passedData[i][2]
        if(questionIds != passedData[i+1][2]):
            raise ValueError("Invalid QuestionIDs")
        wna.append(passedData[i][0])
        arra.append(passedData[i][1])
    wna.append(passedData[i][0])
    arra.append(passedData[i][1])

    dmi_data = np.vstack(arra)
    wnanp = np.vstack(wna)
    dmi_data = np.concatenate((wnanp, dmi_data), axis=1)

    # dmi_data format is now an np array with np array elements.
    rewards, answers = do_calc_np(dmi_data, n_choices, num_answers)
    #return rewards
    return returnFormattedData(questionGroupId,questionIds,rewards, answers)
    
    
    

from utils import FormattingData
    
def calculate_rewards(data):
    print("\033[1;32m Calculating rewards....")
    passedData=FormattingData.prepareDataPayload(data)
    #define method as do_calc_np
    #Passed data should be like : 
    #[[wisdomNodeAddress1,answerValue1,answerValue2,answerValue3,....],
    #  wisdomNodeAddress2,answerValue1,answerValue2,answerValue3,.....] ]
    #return do_calc_np(passsedData)
    print("\033[1;34m")
    print(passedData)

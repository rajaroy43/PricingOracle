from utils import FormattingData
    
def calculate_rewards(data):
    print("Calculating rewards")
    #Formatting will check , if passing data is incorrect ,then it will throw an error
    #Formatted Data will be :[[questionGroupId],[questionIds],[worker-id],[answerSets],[answerValue],[stakeAmount],[wisdomNodeReputation]]
    passedData=FormattingData.getFormattedData(data)
    #define method as do_calc_np
    #return do_calc_np(passsedData)
    print(passedData)

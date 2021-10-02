class Metadata:
    "Metadata class for tagging QuestionGroups"
    questionGroupId = ""
    numberQuestionChoices = 0
    numberQuestions = 0
    questionGroupCategory = 0
    totalBounty = 0
    totalStaked = 0

    def __init__(self, questionGroupId, numberQuestionChoices, numberQuestions, questionGroupCategory, totalBounty, totalStaked):
        self.questionGroupId = questionGroupId
        self.numberQuestionChoices = numberQuestionChoices
        self.numberQuestions = numberQuestions
        self.questionGroupCategory = questionGroupCategory
        self.totalBounty = totalBounty
        self.totalStaked = totalStaked

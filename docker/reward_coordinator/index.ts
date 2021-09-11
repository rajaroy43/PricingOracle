import express from "express"
import { getEndedQuestionGroups } from "./queries/questionGroup"
require('dotenv').config()

const fetchEndedQuestions = () => {
   getEndedQuestionGroups()
}

setInterval(fetchEndedQuestions, 5000)
import { EncryptedAnswerDocument } from "../types"

interface TieredAddresses {
  tiers: string[][],
  refundsComplete: boolean,
  answerDocuments: EncryptedAnswerDocument[],
  answerPublished: string[],
  currentlyAnswering: boolean
}

const QUESTION_TIERED_ADDRESSES = (() => {
  const tieredAddresses: {[key:string]: TieredAddresses} = {}

  const areTiersCalculated = (questionId: string): boolean => {
    return tieredAddresses[questionId] != undefined
  }

  const setTieredAddresses = (questionId: string, tiers: string[][], refundsComplete: boolean): void => {
    // @ts-ignore
    tieredAddresses[questionId] = {
      tiers,
      refundsComplete,
      answerDocuments: [],
      answerPublished: [],
      currentlyAnswering: false
    }
  }

  const removeTieredAddresses = (questionId: string): void => {
    delete tieredAddresses[questionId]
  }

  const getTieredAddresses = (questionId: string): TieredAddresses => {
    return tieredAddresses[questionId]
  }

  const setAnswerDocuments = (questionId: string, answerDocuments: EncryptedAnswerDocument[]): void => {
    tieredAddresses[questionId].answerDocuments = answerDocuments
  }

  const addPublishedDate = (questionId: string, publishDate: string, currentlyAnswering: boolean): void => {
    const tiers = tieredAddresses[questionId]
    tiers.answerPublished.push(publishDate)
    tiers.currentlyAnswering =  currentlyAnswering
  }
  
  return {
    areTiersCalculated,
    setAnswerDocuments,
    addPublishedDate,
    setTieredAddresses,
    removeTieredAddresses,
    getTieredAddresses
  }
})()

export default QUESTION_TIERED_ADDRESSES
import EthCrypto from 'eth-crypto'
import { getQuestionAndBids } from '../queries/question';
import QUESTION_TIERED_ADDRESSES from '../storage/questionTieredAddresses';
import USER_PUBLIC_KEYS from '../storage/userPublicKeys';
import { Bidder,EncryptedAnswerDocument, RewardsResponseData } from '../types';
import getPublicKeyFromAddress from '../userPublicKeys/getPublicKeyFromAddress';
import getRefundsForTiers from './getRefundsForTiers';

const encryptValue = async(publicKey:string,value:string)  =>{

  const encrypted = await EthCrypto.encryptWithPublicKey(
    publicKey, // by encryping with user publicKey, only user can decrypt the payload with his privateKey
    value // value must be in string
  );

  const encryptedString = EthCrypto.cipher.stringify(encrypted);

  return encryptedString;

}

export const getEncryptedAnswerDocument = async(question: any,bidders:Bidder[],answerValue:string): Promise<EncryptedAnswerDocument> =>{
  const encryptedAnswers = await Promise.all(bidders.map(async(bidder)=> [bidder.address, await encryptValue(bidder.publicKey, answerValue)]))

  const answersAcc: {[key:string]: string} = {}
  const answers = encryptedAnswers.reduce((acc, answer) => {{ acc[answer[0]] = answer[1]}; return acc}, answersAcc)
  return {
    questionId: question.id,
    description: question.description,
    pricingTime: question.pricingTime,
    answerSet: question.answerSet,
    answers
  }
}

const getOrFetchPublicKey = async (address: string): Promise<Bidder> => {
  let publicKey
  if (USER_PUBLIC_KEYS.keyIsStored(address)) {
    publicKey = USER_PUBLIC_KEYS.getPublicKey(address)


  } else {
    publicKey = await getPublicKeyFromAddress(address)
    USER_PUBLIC_KEYS.setPublicKey(address, publicKey.slice(2))
  }
  return {
    address,
    publicKey
  }
}

export const handleNewAnswer = async (question: any, answer: string): Promise<EncryptedAnswerDocument[]> => {
  console.log(`handling new answer for question ${question.id}`)
  if (question.id == null) return []
  if (!QUESTION_TIERED_ADDRESSES.areTiersCalculated(question.id)) {
    console.log(`fetching bid tiers for question ${question.id}`)

    const questionAndBids = await getQuestionAndBids()

    const tieredAddresses = getRefundsForTiers(questionAndBids.data.metaPricingContract.revealTiers, question.bids)
    QUESTION_TIERED_ADDRESSES.setTieredAddresses(question.id, tieredAddresses, true)
  }
  const bidderTiers = await Promise.all(
    QUESTION_TIERED_ADDRESSES.getTieredAddresses(question.id).tiers
    .map(async (tier: string[]) => {
      const bidderTier = await Promise.all(
        tier.map(async (bid: any): Promise<Bidder> => {
          const bidder = await getOrFetchPublicKey(bid.user.id)
          return bidder
        }))
      return bidderTier
    })
  )


  const encryptedAnswers =  await Promise.all(
    bidderTiers.map(async(tier: Bidder[]): Promise<EncryptedAnswerDocument> => {
      const document = await getEncryptedAnswerDocument(question, tier, answer)
      return document
    })
  )
  
  return encryptedAnswers
}

export const handleQuestionAnswers = async (rewardsData: RewardsResponseData, questions: any) => {
  const { questionIds, finalAnswerIndex, finalAnswerValue } = rewardsData.rewards
  const answerDocuments = await Promise.all(questionIds.map((questionId, idx) => {
    const question = questions.find((question: any) => question.question.id === questionId)
    const answerIndex = finalAnswerIndex[idx]
    const answerValue = finalAnswerValue[idx]
    const answer = JSON.stringify({
      questionId: question.question.id,
      answerIndex,
      answerValue
    })
    return handleNewAnswer(question.question, answer)
  }))
  return answerDocuments
}





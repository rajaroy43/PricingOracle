import { BigNumber } from "ethers";

export const getTopAnswer = (answerSetTotals: BigNumber[]) => {
  const topTotals = answerSetTotals.reduce((acc, answerTotal, index) => {
    if (BigNumber.from(answerTotal) > acc.value) {
      acc.index = index
    }

    return acc
  }, {index: 0, value: BigNumber.from(0)})

  return topTotals
}
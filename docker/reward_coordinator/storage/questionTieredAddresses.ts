interface TieredAddresses {
  tiers: string[][], refundsComplete: boolean
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
      refundsComplete
    }
  }

  const removeTieredAddresses = (questionId: string): void => {
    delete tieredAddresses[questionId]
  }

  const getTieredAddresses = (questionId: string): TieredAddresses => {
    return tieredAddresses[questionId]
  }
  
  return {
    areTiersCalculated,
    setTieredAddresses,
    removeTieredAddresses,
    getTieredAddresses
  }
})()

export default QUESTION_TIERED_ADDRESSES
const QUESTION_TIERED_ADDRESSES = (() => {
  const tieredAddresses: {[key:string]: string[][]} = {}

  const areTiersCalculated = (questionId: string): boolean => {
    return tieredAddresses[questionId] != undefined
  }

  const setTieredAddresses = (questionId: string, _tieredAddresses: string[][]): void => {
    // @ts-ignore
    tieredAddresses[questionId] = _tieredAddresses
  }

  const removeTieredAddresses = (questionId: string): void => {
    delete tieredAddresses[questionId]
  }

  const getTieredAddresses = (questionId: string): string[][] => {
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
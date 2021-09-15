const CURRENTLY_CALCULATING = (() => {
  const ids: {[key:string]: boolean} = {}

  const isCalculationRequired = (questionGroupId: string): boolean => {
    return ids[questionGroupId] == undefined
  }

  const setAsCalculating = (questionGroupId: string): void => {
    ids[questionGroupId] = true
  }

  const removeAsCalculating = (questionGroupId: string): void => {
    delete ids[questionGroupId]
  }
  
  return {
    isCalculationRequired,
    setAsCalculating,
    removeAsCalculating
  }
})()

export default CURRENTLY_CALCULATING

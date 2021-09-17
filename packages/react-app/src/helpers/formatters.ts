import { utils } from 'ethers'

// transform display units to native units
export const parseUnits = (value: string, decimals = 18): string  => {
  try {
    const formatted = utils.parseUnits( value, decimals).toString()
    return formatted
  } catch {
    return value
  }
}

// transform native units to display
export const formatUnits = (value: string, decimals = 18):string => {
  try {
    const formatted = utils.formatUnits( value, decimals).toString()
    return formatted
  } catch {
    return value
  }
}


export const formatDate = (date: string) => new Date(date).toLocaleString()

export const convertToChecksum = (address: string) => utils.getAddress(address)

const pad = (int: string, digits: number) =>
    int.length >= digits
        ? int
        : new Array(digits - int.length + 1).join('0') + int

export const zeroPad = (str: string, digits: number) => {
  str = String(str)
  const nums = str.match(/[0-9]+/g)

  if (nums) {
    nums.forEach((num) => {
      str = str.replace(num, pad(num, digits))
    })
  }

  return str
}
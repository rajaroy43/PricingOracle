import { utils } from 'ethers'
import numeral from 'numeral'

//transform number to better readablity
export const formatNumber = (number: number) => number ? `${numeral(number).format("0.0a").toUpperCase()}` : "0"

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
    const formatted = utils.formatUnits( value, decimals)
    return formatted
  } catch {
    return value
  }
}

export const convertToChecksum = (address: string) => utils.getAddress(address)

export const msToSec = (value:  number) => Math.floor(value/1000)

export const secToMs = (value: number) => value * 1000

export const msToLocaleDate = (date: number) => new Date(date).toLocaleString()

export const secToLocaleDate = (date: number) => msToLocaleDate(secToMs(date))

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

export const toLowerCase = (target: string) => target.split('').map(f => f.toLowerCase()).join('')
import { utils } from 'ethers'

export const formatUnits = (value: string, decimals = 18): string  => utils.parseUnits( value, decimals).toString()

export const formatDate = (date: string) => new Date(date).toLocaleString()

export const convertToChecksum = (address: string) => utils.getAddress(address)
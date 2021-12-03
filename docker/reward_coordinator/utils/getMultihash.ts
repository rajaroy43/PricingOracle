import bs58 from 'bs58'
import { MultiHashFields } from '../types';
function getMultihashFromBytes32(inputBytes: string): MultiHashFields {
  const decoded = bs58.decode(inputBytes);

  return {
    digest: `0x${decoded.slice(2).toString('hex')}`,
    hashFunction: decoded[0],
    size: decoded[1],
  };
}

export default getMultihashFromBytes32
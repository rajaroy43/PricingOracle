interface UserPublicKey {
  address: string,
  publicKey: string
}

interface KeyIsStored {
  (address:string): boolean
}

interface SetPublicKey {
  (address: string, publicKey: string): void
}

interface RemovePublicKey {
  (address:string): void
}

interface GetPublicKey {
  (address: string): string
}

interface UserPublicKeys {
  keyIsStored: KeyIsStored;
  setPublicKey: SetPublicKey ;
  removePublicKey: RemovePublicKey,
  getPublicKey: GetPublicKey
}

const USER_PUBLIC_KEYS = ((): UserPublicKeys => {
  const userPublicKeys: {[key:string]: UserPublicKey} = {}

  const keyIsStored = (address: string): boolean => {
    return userPublicKeys[address] != undefined
  }

  const setPublicKey = (address: string, publicKey: string): void => {
    // @ts-ignore
    userPublicKeys[address] = {
      address,
      publicKey
    }
  }

  const removePublicKey = (address: string): void => {
    delete userPublicKeys[address]
  }

  const getPublicKey = (address: string): string => {
    return userPublicKeys[address].publicKey
  }
  
  return {
    keyIsStored,
    setPublicKey,
    removePublicKey,
    getPublicKey
  }
})()

export default USER_PUBLIC_KEYS
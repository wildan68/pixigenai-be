import crypto from 'crypto'

const store = new Map()
export default function RegisterStores() {
  const generateOTP = () => {
    return crypto.randomInt(1000, 9999).toString();
  }

  return {
    store,
    generateOTP
  }
}
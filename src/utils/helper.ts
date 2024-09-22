import { ValidationTypes } from '../types/types.js'
import type { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { rateLimit } from 'express-rate-limit'

export function numberFormat (value: string | number) {
  if (!value)
    return
    
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function randomCount (numberFirst: number, numberLast: number): number {
  return Math.floor(Math.random() * (numberLast - numberFirst + 1) + numberFirst)
}

export function validation (value: string, type: ValidationTypes, count?: number) {
  switch (type) {
  case 'email':
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)
  case 'number':
    return /^\d+$/.test(value)
  case 'string': 
    return /^[a-zA-Z]+$/.test(value)
  case 'url':
    return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(value)
  case 'max': 
    if (!count) return false
    return value.length <= count
  case 'min': 
    if (!count) return false
    return value.length >= count
  default:
    return false
  }
}

export function randomString (length: number): string {
  return crypto.randomBytes(length).toString('hex')
}

export function encrypt (value: string, key: WithImplicitCoercion<Buffer>) {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(value);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } 
  catch (error) {
    console.log('Encryption error: ', error)
  }
}

export function decrypt (value: string, key: WithImplicitCoercion<Buffer>) {
  try {
    const textParts = value.split(':');
    const iv = Buffer.from(textParts.shift() as string, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
  catch (error) {
    console.log('Decryption error: ', error)
  }
}

export function hashPassword (password: string, salt: string) {
  const hash = crypto.createHmac('sha256', salt);
  hash.update(password);
  return hash.digest('hex');
}

export function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

export function generateKey() {
  return crypto.randomBytes(32)
}

export function isAdmin (req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({
      status: 'error',
      message: 'Unauthorized'
    })

    return false
  }

  if (req.user.role !== 'admin') {
    res.status(401).json({
      status: 'error',
      message: 'Unauthorized'
    })

    return false
  }

  return true
}

export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    
  handler: function (req, res) {
    res.status(429).json({
      status: 'error',
      message: 'Too many requests'
    })
  },
})
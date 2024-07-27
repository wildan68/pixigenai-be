import { ValidationTypes } from '../types/types.js'

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

export function randomString (length: number) {
  return Math.random().toString(36).slice(-length)
}
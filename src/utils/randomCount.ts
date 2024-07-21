export default function randomCount (numberFirst: number, numberLast: number): number {
  return Math.floor(Math.random() * (numberLast - numberFirst + 1) + numberFirst)
}
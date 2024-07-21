export default function numberFormat (value: string | number) {
  if (!value)
    return
  
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
const capitalize = (str) => str.split('').map((s, i) => i === 0 ? s.toUpperCase() : s).join('')

export default (str) => {
  if (typeof str !== 'string') throw new Error('Must pass a string to toCamelCase')
  return str.split(' ').map((s, i) => i >= 1 ? capitalize(s) : s.toLowerCase()).join('')
}
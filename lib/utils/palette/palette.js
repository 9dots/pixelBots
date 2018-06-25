/**
 * Palette
 */

const simple = [
  { red: '#d8272d' },
  { pink: '#ff878d' },
  { orange: '#f7931e' },
  { yellow: '#fcd721' },
  { green: '#39b54a' },
  { blue: '#29a4e2' },
  { purple: '#662d91' },
  { brown: '#8c6239' },
  { grey: '#999999' },
  { black: '#000000' },
  { white: '#FFFFFF' }
]

const colors = simple.map(function (c) {
  const key = Object.keys(c)[0]
  return {
    name: key,
    value: c[key]
  }
}, [])

const blackAndWhite = colors.filter(
  c => c.name === 'black' || c.name === 'white'
)

/**
 * Exports
 */

export default colors
export { blackAndWhite }

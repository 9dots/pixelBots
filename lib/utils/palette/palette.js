/**
 * Imports
 */

import palette from 'google-material-color-palette-json'
import reduce from '@f/reduce'
import drop from 'lodash/drop'

/**
 * Palette
 */

const colors = drop(reduce(
  (arr, value, key) => [...arr, {
    name: key,
    value: value['shade_500'] || value
  }],
  [],
  palette
))

const blackAndWhite = colors.filter(c => c.name === 'black' || c.name === 'white')

/**
 * Exports
 */

export default colors
export {
  blackAndWhite
}

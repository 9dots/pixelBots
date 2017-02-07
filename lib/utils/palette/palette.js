import palette from 'google-material-color-palette-json'
import reduce from '@f/reduce'
import drop from 'lodash/drop'

export default drop(reduce(
  (arr, value, key) => [...arr, {
    name: key,
    value: value['shade_500'] || value
  }],
  [],
  palette
))

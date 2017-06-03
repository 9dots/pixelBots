/**
 * Imports
 */

const palette = require('google-material-color-palette-json')
const reduce = require('@f/reduce')
const drop = require('lodash/drop')

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

exports.blackAndWhite = blackAndWhite
exports.colors = colors

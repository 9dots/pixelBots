/**
 * Imports
 */

import rgba from '@f/rgba'

/**
 * Colors
 */

const red = '#DD665C'
const red_medium = '#E9948E'
const red_light = '#EEB2AD'

const yellow = '#EBBF2E'
const yellow_medium = '#F1D26F'
const yellow_light = '#F4DE96'

const blue = '#25A8E0'
const blue_medium = '#65C2E8'
const blue_light = '#91D2ED'

const green = '#59BD82'
const green_medium = '#8BD2A8'
const green_light = '#ACDEC1'

const grey = '#4B5257'
const grey_medium = '#B1B7BC'
const grey_light = '#DCDEE2'

const off_white = '#F9F9F9'
const white = '#FFF'

const black = '#343434'

const google_red = '#dd4b39'
const facebook_blue = '#3B5998'
const microsoft_red = '#ED4700'
const khan_green = '#96AE3A'

const placeholder_color = '#AEAEBB'
const text = '#6A6A6A'
const link_color = blue

const divider = '#DDD'

const pickerColors = [
  '#54738E', '#77B4D3', '#979AD8', '#A4789F',
  '#92A5B3', '#EAA1A1', '#F2987C', '#AFAB93',
  '#818181', '#92D2C7', '#42AD9C', '#25A8E0'
]

const error = rgba(red, 0.85)

/**
 * Exports
 */

export {
  red,
  red_medium,
  red_light,
  yellow,
  yellow_medium,
  yellow_light,
  green,
  green_medium,
  green_light,
  blue,
  blue_medium,
  blue_light,
  grey,
  grey_medium,
  grey_light,
  off_white,
  white,
  black,
  pickerColors,

  error,

  placeholder_color,
  text,
  link_color,
  google_red,
  facebook_blue,
  microsoft_red,
  divider,

  blue as primary,
  green as accent,
  red as important,

  yellow as warning,
  red as danger,
  yellow as action,
  green as done,
  grey_medium as no_action,
  blue_medium as waiting,

  green as good,
  yellow as fair,
  red as bad
}

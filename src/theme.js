import {palette} from './utils'

const baseColors = {
  ...palette,
  black: '#111',
  white: '#fff',
  grey: '#ddd',
  grey_medium: '#888',
  blue: '#2C4770',
  red: '#f52',
  orange: '#f70',
  green: '#1c7',
  offblack: '#333'
}

export default {
  colors: {
    ...baseColors,
    primary: baseColors.blue,
    secondary: baseColors.grey_medium,
    default: baseColors.black,
    info: baseColors.blue,
    success: baseColors.green,
    warning: baseColors.orange,
    error: baseColors.red,
    divider: baseColors.grey_medium,
    text: baseColors.black
  },
  fonts: {
    code: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
    ornate: 'Helvetica Neue, serif'
  },
  spinnerAnimation: 'stuff'
}

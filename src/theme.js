import {palette} from './utils'

const pal = palette.reduce((obj, {name, value}) => {
  return {
    ...obj,
    [name]: value
  }
}, {})

const baseColors = {
  ...pal,
  black: '#111',
  white: '#fff',
  grey: '#ddd',
  grey_medium: '#888',
  offblack: '#333'
}

export default {
  colors: {
    ...baseColors,
    primary: '#666',
    secondary: '#999',
    offSecondary: '#7689A9',
    light: '#c5c5c5',
    buttons: '#2C4770',
    background: '#e5e5e5',
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

import palette from 'utils/palette'
import {defaultTheme} from 'vdux-ui'

const pal = palette.reduce((obj, {name, value}) => {
  return {
    ...obj,
    [name]: value
  }
}, {})

const baseColors = {
  ...pal,
  // red: '#f52',
  black: '#111',
  white: '#fff',
  grey: '#ddd',
  grey_medium: '#888',
  offblack: '#333',
  
  red: '#ff604d',
  yellow: '#ffd24a',
  green: '#3aba70',
  blue: '#42a8ff'
}

export default {
  colors: {
    ...baseColors,
    primary: '#555',
    secondary: '#999',
    offSecondary: '#7689A9',
    light: '#c5c5c5',
    buttons: '#2C4770',
    background: '#e5e5e5',
    disabled: '#C0C0C0',
    highlightBlue: '#F6FBFF',
    link: baseColors.blue,
    default: baseColors.black,
    info: baseColors.blue,
    success: baseColors.green,
    warning: baseColors.orange,
    error: baseColors.red,
    divider: '#E0E0E0',
    text: baseColors.black
  },
  shadow: {
    ...defaultTheme.shadow,
    menu: 'rgba(52, 52, 52, 0.3) 0px 0px 15px 0px, rgba(52, 52, 52, 0.09) 0px 0px 0px 1px',
  },
  fonts: {
    code: 'Consolas, "Liberation Mono", Menlo, Courier, monospace',
    ornate: 'Helvetica Neue, serif'
  },
  spinnerAnimation: 'stuff'
}

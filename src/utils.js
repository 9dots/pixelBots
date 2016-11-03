import gPalette from 'google-material-color-palette-json'
import reduce from '@f/reduce'
import _ from 'lodash'

const icons = {
  up: 'arrow_upward',
  down: 'arrow_downward',
  left: 'arrow_back',
  right: 'arrow_forward',
  paint: 'brush'
}

const colors = {
  up: 'blue',
  right: 'yellow',
  down: 'green',
  left: 'red'
}

const directions = {
  forward: 'N',
  back: 'S',
  right: 'E',
  left: 'W'
}

const palette = _.drop(reduce(
  (arr, value, key) => [...arr, {
    name: key,
    value: value['shade_500'] || value
  }],
  [],
  gPalette
))

function nameToIcon (name) {
  return icons[name]
}

function nameToDirection (name) {
  return directions[name]
}

function nameToColor (name) {
  return colors[name] || 'white'
}

function isLocal (url) {
  return !/^(?:[a-z]+\:)?\/\//i.test(url)
}

function range (low, hi) {
  function rangeRec (low, hi, vals) {
    if (low > hi) {
      return vals
    }
    vals.push(low)
    return rangeRec(low + 1, hi, vals)
  }
  return rangeRec(low, hi, [])
}

function initGame () {
  return {
    inputType: 'icons',
    levelSize: [5, 5],
    animals: [{
      type: 'zebra',
      sequence: [],
      initial: {
        location: [4, 0],
        dir: 0,
        rot: 0
      },
      current: {
        location: [4, 0],
        dir: 0,
        rot: 0
      }
    }]
  }
}

export {
  nameToDirection,
  nameToColor,
  nameToIcon,
  initGame,
  palette,
  isLocal,
  range
}

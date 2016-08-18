const icons = {
  forward: 'arrow_upward',
  back: 'arrow_downward',
  left: 'arrow_back',
  right: 'arrow_forward',
  paint: 'brush'
}

const directions = {
  forward: 'N',
  back: 'S',
  right: 'E',
  left: 'W'
}

function nameToIcon (name) {
  return icons[name]
}

function nameToDirection (name) {
  return directions[name]
}

export {
  nameToIcon,
  nameToDirection
}

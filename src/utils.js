const icons = {
  up: 'arrow_upward',
  down: 'arrow_downward',
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

function isLocal (url) {
  return !/^(?:[a-z]+\:)?\/\//i.test(url)
}

export {
  nameToIcon,
  nameToDirection,
  isLocal
}

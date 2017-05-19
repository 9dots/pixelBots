import animalApis from 'animalApis'

/**
 * Animal utils
 */

function getNewLocation (dir, steps) {
  switch (dir) {
    case 0:
      return (loc) => [loc[0] - steps, loc[1]]
    case 1:
      return (loc) => [loc[0], loc[1] + steps]
    case 2:
      return (loc) => [loc[0] + steps, loc[1]]
    case 3:
      return (loc) => [loc[0], loc[1] - steps]
  }
}

function getInterval (animal, speed) {
  return getTimeout(animal.type) * 1 / speed
}

const getTimeout = (type) => {
  return animalApis[type].speed + 50
}

function resetAnimal (animal, levelSize) {
  return {
    ...resetAnimalPos(animal, levelSize),
    sequence: null
  }
}

function resetAnimalPos (animal, levelSize) {
  return {
    ...animal,
    current: setLocation('current'),
    initial: setLocation('initial')
  }

  function setLocation (field) {
    return {
      ...animal[field],
      rot: 0,
      location: getBottomLeftCorner(levelSize)
    }
  }
}

function getBottomLeftCorner (levelSize) {
  return [levelSize - 1, 0]
}

/**
 * Exports
 */

export {
  getNewLocation,
  getInterval,
  resetAnimal,
  resetAnimalPos
}

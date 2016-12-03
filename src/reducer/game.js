import map from '@f/map'
import splice from '@f/splice'
import setProp from '@f/set-prop'
import reduce from '@f/reduce'
import {initGame, arrayAt} from './utils'

import {setUserId, setUsername} from './middleware/auth'

import {
  initializeGame,
  setAnimalPos,
  animalPaint,
  animalTurn,
  animalMove,
  updateSize,
  setAnimal,
  swapMode,
  refresh,
  reset
} from './actions'

function reducer (state, action) {
  switch (action.type) {
    case animalMove.type:
      var {id, location} = action.payload
      return {
        ...state,
        game: arrayAt(
          setProp(`animals.${id}.current.location`, state.game, location),
         'animals'
       )
      }
    case animalTurn.type:
      var {id, rot} = action.payload
      return {
        ...state,
        game: arrayAt(
          setProp(`animals.${id}.current.rot`, state.game, rot),
          'animals'
        )
      }
    case animalPaint.type:
      var {id, color} = action.payload
      var loc = state.game.animals[id].current.location

      return {
        ...state,
        game: arrayAt(setProp(
          'painted',
          state.game,
          {...state.game.painted, [loc]: color}
        ), 'animals')
      }
    case refresh.type:
      return {
        ...state,
        running: false,
        hasRun: false,
        activeLine: -1,
        game: initGame()
      }
    case reset.type:
      return {
        ...state,
        running: false,
        hasRun: false,
        activeLine: -1,
        game: {
          ...state.game,
          painted: state.game.initialPainted,
          animals: map((animal) => ({
            ...animal,
            current: animal.initial
          }), state.game.animals)
        }
      }
    case initializeGame.type:
      return {
        ...state,
        game: action.payload
      }
    case swapMode.type:
      return {
        ...state,
        game: {
          ...state.game,
          inputType: action.payload,
          painted: state.game.initialPainted,
          animals: map((animal) => ({
            ...animal,
            current: animal.initial,
            sequence: ''
          }), state.game.animals)
        }
      }
    case updateSize.type:
      return {
        ...state,
        game: setProp('levelSize', state.game, [action.payload, action.payload])
      }
    case setAnimal.type:
      return {
        ...state,
        game: setProp('animals', state.game, state.game.animals.map((animal) => ({...animal, type: action.payload})))
      }
    case setAnimalPos.type:
      return {
        ...state,
        game: {
          ...state.game,
          animals: state.game.animals.map((animal) => {
            return {
              ...animal,
              current: {
                dir: 0,
                rot: 0,
                location: action.payload
              },
              initial: {
                dir: 0,
                rot: 0,
                location: action.payload
              }
            }
          })
        }
      }
  }
  return state
}


export default reducer

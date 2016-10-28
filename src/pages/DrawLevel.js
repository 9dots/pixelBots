/** @jsx element */

import ModalMessage from '../components/ModalMessage'
import ColorPicker from '../components/ColorPicker'
import {setUrl} from 'redux-effects-location'
import createAction from '@f/create-action'
import Button from '../components/Button'
import {Input} from 'vdux-containers'
import Level from '../components/Level'
import {firebaseSet} from 'vdux-fire'
import {createNew} from '../actions'
import element from 'vdux/element'
import setProp from '@f/set-prop'
import Hashids from 'hashids'
import animalApis from '../animalApis'
import {palette} from '../utils'
import {
  Block,
  Card,
  Text
} from 'vdux-ui'

const hashids = new Hashids(
  'Oranges never ripen in the winter',
  5,
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
)
const setFillColor = createAction('SET_FILL_COLOR')
const addPainted = createAction('ADD_PAINTED')
const showID = createAction('SHOW_ID')

const modalFooter = (
  <Block>
    <Button bgColor='secondary' onClick={createNew}>Make Another</Button>
    <Button ml='m' onClick={() => setUrl('/')}>Done</Button>
  </Block>
)

let borderColor = '#ccc'

function initialState ({props}) {
  const {newGame} = props
  const {value} = newGame
  const {levelSize} = value
  return {
    color: 'black',
    painted: {start: whiteOut(levelSize), finished: whiteOut(levelSize)},
    show: ''
  }
}

function whiteOut (size) {
  let grid = {}
  for (let i = 0; i < size[0]; i++) {
    for (let j = 0; j < size[1]; j++) {
      grid[`${i},${j}`] = 'white'
    }
  }
  return grid
}

function render ({props, state, local}) {
  const {newGame, gameID} = props
  const {color, painted, show} = state

  if (newGame.loading) {
    return <div>... loading</div>
  }

  const game = newGame.value
  const btn = (
    <Block border='2px solid #333' bgColor={color} align='center center' w='40px' h='40px' />
  )

  const url = window.location.host + '/play/'
  const canPaintColor = animalApis[game.animals[0].type].docs.paint.args
  const blackAndWhite = [
    {name: 'black', value: '#111'},
    {name: 'white', value: '#FFF'}
  ]

  return (
    <Block p='60px' column align='center center'>
      {show && <ModalMessage
        header='Link to game'
        body={<Input
          readonly
          inputProps={{p: '12px', borderWidth: '2px', border: borderColor}}
          id='url-input'
          fs='18px'
          onFocus={() => document.getElementById('url-input').children[0].select()}
          value={`http://${url}${show}`}>{`${url}${show}`}
        </Input>}
        footer={modalFooter}/>
      }
      <Card p='12px' height='100px' w='180px' right='0' top='225px' fixed>
        <Block mb='20px' align='flex-start center'>
          <Text wide fs='m' color='black'>
            Fill color
          </Text>
          <ColorPicker
            zIndex='999'
            clickHandler={local((color) => setFillColor(color))}
            palette={canPaintColor ? palette : blackAndWhite}
            btn={btn}/>
        </Block>
        <hr/>
        <Button
          mt='0px'
          wide
          h='40px'
          fs='m'
          onClick={[
            updateGame,
            () => save(generateID(gameID)),
            local(() => showID(generateID(gameID)))
          ]}>Save</Button>
      </Card>
      <Text fs='xl' fontWeight='800'>Click the squares to paint the grids</Text>
      <Block mt='20px' column align='center center' wide tall>
        <Block mt='20px' textAlign='center'>
          <Block mb='10px' fs='l' fontWeight='800'>Starting Grid</Block>
          <Level
            editMode
            painted={painted.start}
            levelSize='500px'
            w='auto'
            h='auto'
            clickHandler={local((coord) => (
              addPainted({grid: 'start', coord})
            ))}
            animals={game.animals}
            numRows={game.levelSize[0]}
            numColumns={game.levelSize[1]}/>
        </Block>
        <Block mt='20px' textAlign='center'>
          <Block mb='10px' fs='l' fontWeight='800'>Finished Grid</Block>
          <Level
            editMode
            animals={game.animals.map((animal) => convertToStar(animal))}
            painted={painted.finished}
            levelSize='500px'
            w='auto'
            h='auto'
            clickHandler={local((coord) => (
              addPainted({grid: 'finished', coord})
            ))}
            numRows={game.levelSize[0]}
            numColumns={game.levelSize[1]}/>
        </Block>
      </Block>
    </Block>
  )

  function save (playID) {
    return firebaseSet({
      method: 'set',
      ref: `/play/${playID}`,
      value: gameID
    })
  }

  function updateGame () {
    return firebaseSet({
      method: 'update',
      ref: `/games/${gameID}`,
      value: {
        initialPainted: painted.start,
        painted: painted.start,
        targetPainted: painted.finished
      }
    })
  }

  function generateID () {
    let hex = Buffer(gameID.substr(4, 5)).toString('hex').substr(0, 4)
    return hashids.encodeHex(hex)
  }
}

function convertToStar (animal) {
  return {
    type: 'star',
    current: animal.initial
  }
}

function reducer (state, action) {
  switch (action.type) {
    case setFillColor.type:
      return {
        ...state,
        color: action.payload
      }
    case addPainted.type:
      const {grid, coord} = action.payload
      return {
        ...state,
        painted: setProp(
            grid,
            state.painted,
            {...state.painted[grid], [coord]: state.color}
          )
      }
    case showID.type:
      return {
        ...state,
        show: action.payload
      }
  }
  return state
}

export default {
  initialState,
  reducer,
  render
}

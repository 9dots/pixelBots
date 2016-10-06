/** @jsx element */

import ColorPicker from '../components/ColorPicker'
import {setUrl} from 'redux-effects-location'
import createAction from '@f/create-action'
import {Block, Card, Modal, ModalBody, ModalFooter, ModalHeader, Text} from 'vdux-ui'
import Level from '../components/Level'
import {Button} from 'vdux-containers'
import {firebaseSet} from 'vdux-fire'
import element from 'vdux/element'
import setProp from '@f/set-prop'
import Hashids from 'hashids'


const hashids = new Hashids('Oranges never ripen in the winter', 5, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789')
const setFillColor = createAction('SET_FILL_COLOR')
const addPainted = createAction('ADD_PAINTED')
const showID = createAction('SHOW_ID')

function initialState () {
  return {
    color: 'black',
    painted: {start: {}, finished: {}},
    show: ''
  }
}

const overlayProps={
  fixed: true,
  left: '0',
  top:'0',
  tall: true,
  wide: true
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

  return (
    <Block p='60px' column align='center center'>
      {show && <Modal overlayProps={overlayProps} show={false}>
        <ModalHeader>Link To This Game</ModalHeader>
        <ModalBody>{url}{show}</ModalBody>
        <ModalFooter>
          <Button fs='m' p='m' onClick={() => setUrl('/')}>Save & Close</Button>
        </ModalFooter>
      </Modal>}
      <Card p='12px' height='100px' w='180px' left='0' top='225px' fixed >
        <Block mb='20px' align='flex-start center'>
          <Text wide fs='m' color='black'>
            Fill color
          </Text>
          <ColorPicker
            column
            pickerTop='138px'
            clickHandler={local((color) => setFillColor(color))}
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
              addPainted({grid: 'start', coord, color})
            ))}
            animals={game.animals}
            numRows={game.levelSize[0]}
            numColumns={game.levelSize[1]}/>
        </Block>
        <Block mt='20px' textAlign='center'>
          <Block mb='10px' fs='l' fontWeight='800'>Finished Grid</Block>
          <Level
            editMode
            painted={painted.finished}
            animals={game.animals}
            levelSize='500px'
            w='auto'
            h='auto'
            clickHandler={local((coord) => (
              addPainted({grid: 'finished', coord, color})
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
    let hex = Buffer(gameID.substr(4, 5)).toString('hex').substr(0,4)
    return hashids.encodeHex(hex)
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
      const {grid, coord, color} = action.payload
      return {
        ...state,
        painted: setProp(
            grid,
            state.painted,
            {...state.painted[grid], [coord]: color}
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

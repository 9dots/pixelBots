/** @jsx element */

import element from 'vdux/element'
import {Block, Card, Text} from 'vdux-ui'
import {Button} from 'vdux-containers'
import {setUrl} from 'redux-effects-location'
import Level from '../components/Level'
import ColorPicker from '../components/ColorPicker'
import createAction from '@f/create-action'
import setProp from '@f/set-prop'
import {firebaseSet} from 'vdux-fire'

const setFillColor = createAction('SET_FILL_COLOR')
const addPainted = createAction('ADD_PAINTED')

function initialState () {
  return {
    color: 'black',
    painted: {start: {}, finished: {}}
  }
}

function render ({props, state, local}) {
  const {newGame, gameID} = props
  const {color, painted} = state

  if (newGame.loading) {
    return <div>... loading</div>
  }

  const game = newGame.value
  const btn = (
    <Block border='2px solid #333' bgColor={color} align='center center' w='40px' h='40px' />
  )

  return (
    <Block p='60px' column align='center center'>
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
          onClick={save}>Save</Button>
      </Card>
      <Text fs='xl' fontWeight='800'>Click the squares to paint the grids</Text>
      <Block mt='20px' column align='center center' wide tall>
        <Block mt='20px' textAlign='center'>
          <Text fs='l' fontWeight='800'>Starting Grid</Text>
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
          <Text fs='l' fontWeight='800'>Finished Grid</Text>
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

  function * save () {
    yield firebaseSet({
      method: 'update',
      ref: `/games/${gameID}`,
      value: {
        initialPainted: painted.start,
        targetPainted: painted.finished
      }
    })
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
  }
  return state
}

export default {
  initialState,
  reducer,
  render
}

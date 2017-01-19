/** @jsx element */

import {addCode, aceUpdate, updateLine, removeLine} from '../reducer/editor'
import IndeterminateProgress from '../components/IndeterminateProgress'
import ColorPicker from '../components/ColorPicker'
import LinkModal from '../components/LinkModal'
import {setUrl} from 'redux-effects-location'
import {palette, createCode} from '../utils'
import Button from '../components/Button'
import {Block, Card, Icon, Text} from 'vdux-ui'
import {refMethod} from 'vdux-fire'
import animalApis from '../animalApis'
import {createNew} from '../actions'
import EditLevel from './EditLevel'
import {uploadImage} from '../storage'
import element from 'vdux/element'
import Editor from './Editor'
import reducer, {
  setFillColor,
  addPainted,
  hasSaved,
  showID,
  next,
  back
} from '../reducer/drawLevelReducer'

const modalFooter = (
  <Block>
    <Button bgColor='secondary' onClick={createNew}>Make Another</Button>
    <Button ml='m' onClick={() => setUrl('/')}>Done</Button>
  </Block>
)

function initialState ({props, local}) {
  const {newGame} = props
  const {value} = newGame
  const {levelSize} = value
  return {
    color: 'black',
    painted: {start: whiteOut(levelSize), finished: whiteOut(levelSize)},
    show: '',
    sequence: [],
    selectedLine: 0,
    hasSaved: false,
    slide: 0,
    actions: {
      displayID: local((id) => showID(id)),
      markSaved: local((draftID) => hasSaved(draftID))
    }
  }
}

function render ({props, state, local}) {
  const {newGame, draftID, user} = props
  const {color, painted, show, actions, slide, sequence} = state
  const {displayID, markSaved} = actions

  if (newGame.loading) {
    return <IndeterminateProgress />
  }

  const game = newGame.value
  const btn = (
    <Block border='2px solid #333' bgColor={color} align='center center' w='40px' h='40px' />
  )

  const canPaintColor = animalApis[game.animals[0].type].docs.paint.args
  const blackAndWhite = [
    {name: 'black', value: '#111'},
    {name: 'white', value: '#FFF'}
  ]

  const slides = [
    {type: 'level', name: 'finished', title: 'Paint the Finished Grid'},
    {type: 'level', name: 'start', title: 'Paint the Start Grid'},
    {type: 'code', name: 'add code', title: 'Add Starting Code (optional)'}
  ]

  return (
    <Block column align='center center'>
      {show && <LinkModal
        code={show}
        footer={modalFooter} />
      }
      <Block px='16px' bgColor='white' absolute left='0' top='0' borderBottom='2px solid #ccc' wide align='space-between center' py='1em' mb='1em'>
        {
          slide > 0
            ? <Button
              px='0'
              w='40px'
              align='center center'
              borderWidth='0'
              bgColor='white'
              mr='1em'
              color='#333'
              onClick={slide > 0 && local(back)}>
              <Icon name='arrow_back' />
            </Button>
            : <Block w='40px' />
        }
        <Text flex fontWeight='300' fs='xl'>{slides[slide].title}</Text>
        {
          slide < 2
            ? <Button bgColor='green' w='160px' onClick={local(next)}>NEXT</Button>
            : <Button bgColor='green' w='160px' onClick={save}>SAVE</Button>
        }
      </Block>
      <Block mt='5em'>
        <Block absolute left='20px'>
          {slides.filter((s, i) => i < slide).map((slide) => getSlide(slide, 200))}
        </Block>
        {
          getSlide(slides[slide])
        }
      </Block>
      <Block absolute top='40%' zIndex='-999'>
        <EditLevel
          game={game}
          painted={painted['finished']}
          grid='finished'
          btn={btn}
          hideBorder
          size='300px'
          id='grid-finished'
          animals={[]}
          paintMode={false} />
      </Block>
    </Block>
  )

  function * updateGame () {
    yield refMethod({
      ref: `/games/${draftID}`,
      updates: {
        method: 'set',
        value: {
          ...game,
          initialPainted: painted.start,
          painted: painted.start,
          targetPainted: painted.finished,
          startCode: sequence
        }
      }
    })
    yield refMethod({
      ref: `/users/${user.uid}/games`,
      updates: {
        method: 'push',
        value: {
          name: game.title,
          ref: draftID
        }
      }
    })
  }

  function * save () {
    yield updateGame()
    const code = yield createCode()
    yield refMethod({
      ref: `/links/${code}`,
      updates: {
        method: 'set',
        value: {
          type: 'game',
          payload: draftID
        }
      }
    })
    yield displayID(code)
    yield markSaved()
    yield uploadImage(draftID, game.levelSize[0], painted.finished)
  }

  function getSlide ({type, name, title}, size) {
    if (type === 'level') {
      return <Block mt='20px' column align='flex-start center' wide>
        {size && <Text fs='m'>{name.toUpperCase()} GRID</Text>}
        <EditLevel
          game={game}
          painted={painted[name]}
          grid={name}
          btn={btn}
          size={size}
          paintMode={!size}
          palette={canPaintColor ? palette : blackAndWhite}
          setFillColor={local(setFillColor)}
          clickHandler={size ? () => {} : local(addPainted)} />
        {
          !size && <Card p='12px' height='100px' w='180px' right='10%' top='140px' fixed>
            <Block align='flex-start center'>
              <Text wide fs='m' color='black'>
                Fill color
              </Text>
              <ColorPicker
                zIndex='999'
                clickHandler={local((color) => setFillColor(color))}
                palette={canPaintColor ? palette : blackAndWhite}
                btn={btn} />
            </Block>
          </Card>
        }
      </Block>
    }
    if (type === 'code') {
      const animals = game.animals.map((animal) => ({...animal, sequence}))
      return <Editor
        active='0'
        creatorMode
        animals={animals}
        aceUpdate={local(aceUpdate)}
        removeLine={local(removeLine)}
        updateLine={local(updateLine)}
        addCode={local(addCode)}
        inputType={game.inputType}
      />
    }
  }
}

function * onRemove ({props, state}) {
  if (state.hasSaved) {
    yield refMethod({ref: `/drafts/${props.draftID}`, updates: {method: 'remove'}})
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

export default {
  initialState,
  onRemove,
  reducer,
  render
}

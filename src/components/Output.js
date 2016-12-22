/** @jsx element */

import {runCode, abortRun} from '../middleware/codeRunner'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import ControlPanel from './ControlPanel'
import {Block, Card, Icon, Text} from 'vdux-ui'
import Button from '../components/Button'
import {setAnimalPos} from '../actions'
import element from 'vdux/element'
import {reset} from '../actions'
import Slider from './Slider'
import Level from './Level'
import Tab from './Tab'

const setOpacity = createAction('<Output/>: SET_OPACITY')
const greetings = createAction('<Output/>: GREETINGS')

const initialState = ({local}) => ({
  opacity: '0.2',
  actions: {
    setOpacity: local((val) => setOpacity(val))
  }
})

function render ({props, state, local}) {
  const {
    handleTabClick = () => {},
    targetPainted,
    inputType,
    levelSize,
    animals,
    running,
    saveLink = '',
    options,
    painted,
    hasRun,
    active,
    onRun,
    size,
    tabs,
    tab
  } = props

  const {opacity, actions} = state

  return (
    <Block
      bgColor='light'
      boxShadow='0 0 2px 1px rgba(0,0,0,0.2)'
      mr='0'>
      <Block bgColor='secondary' wide align='start center'>
        {
          tabs.map((tabName) => (
            <Tab
              name={tabName}
              bgColor='secondary'
              color='white'
              fs='s'
              active={tab === tabName}
              handleClick={handleTabClick}/>
          ))
        }
      </Block>
      {tab === 'display' && <Block relative p='10px'>
        <Block absolute top='10px' left='10px' h={size} w={size} zIndex='99' opacity={opacity}>
          <Level
            editMode
            animals={[]}
            hideBorder
            active={active}
            painted={targetPainted}
            levelSize={size}
            numRows={levelSize[0]}
            numColumns={levelSize[1]}/>
        </Block>
        <Block h={size} w={size}>
          <Level
            editMode={!running}
            animals={animals}
            running={running}
            active={active}
            painted={painted}
            levelSize={size}
            numRows={levelSize[0]}
            numColumns={levelSize[1]}/>
        </Block>
      </Block>}
      {tab === 'sandbox' && <Block p='10px'>
        <Block h={size} w={size}>
          <Level
            animals={animals}
            active={active}
            running={running}
            painted={painted}
            clickHandler={!running ? (coords) => setAnimalPos(coords) : () => {}}
            levelSize={size}
            numRows={levelSize[0]}
            numColumns={levelSize[1]}/>
        </Block>
      </Block>}
      {
        tab === 'options' && <Block mx='10px' py='10px' w='400px'>
          <ControlPanel type={animals[active].type} levelSize={levelSize[0]} inputType={inputType}/>
        </Block>
      }
      {
        tab !== 'options' && 
          <Card mx='10px' p='20px 10px'>
            {
              targetPainted && <Block wide align='space-around center' wide pb='1em'>
                <Text fontWeight='300' userSelect='none'>START</Text>
                  <Slider
                    startValue={opacity}
                    w='200px'
                    max='1'
                    step='0.1'
                    handleChange={(val) => actions.setOpacity(val)}
                    name='opacity-slider'/>
                <Text fontWeight='300' userSelect='none'>FINISH</Text>
              </Block>
            }
            <Button
              tall
              wide
              bgColor='green'
              h='60px'
              fs='l'
              color='white'
              onClick={!hasRun ? [runCode, onRun] : [reset, () => abortRun('STOP')]}>
              <Icon ml='-4px' mr='10px' name={!hasRun ? 'play_arrow' : 'replay'}/>
              {!hasRun ? 'RUN' : 'RESET'}
            </Button>
          </Card>
      }
    </Block>
  )
}

const reducer = handleActions({
  [setOpacity]: (state, opacity) => ({...state, opacity})
})

function convertToStar (animal) {
  return {
    type: 'star',
    current: animal.initial
  }
}

export default ({
  initialState,
  reducer,
  render
})
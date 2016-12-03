/** @jsx element */

import ControlPanel from './ControlPanel'
import Button from '../components/Button'
import {setAnimalPos} from '../actions'
import deepEqual from '@f/deep-equal'
import element from 'vdux/element'
import {Block, Icon} from 'vdux-ui'
import Level from './Level'
import omit from '@f/omit'
import Tab from './Tab'
import {runCode, abortRun} from '../middleware/codeRunner'
import {reset} from '../actions'

function render ({props}) {
  const {
    handleTabClick = () => {},
    targetPainted,
    inputType,
    levelSize,
    animals,
    running,
    options,
    painted,
    hasRun,
    active,
    onRun,
    size,
    tabs,
    tab
  } = props

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
      {tab === 'actual' && <Block p='10px'>
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
      {tab === 'target' && <Block p='10px'>
        <Block h={size} w={size}>
          <Level
            editMode
            animals={animals.map((animal) => convertToStar(animal))}
            active={active}
            painted={targetPainted}
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
          <Block w='200px' h='60px' px='10px' align='start center'>
            <Button
              tall
              wide
              bgColor='green'
              fs='l'
              color='white'
              onClick={!hasRun ? [runCode, onRun] : [reset, () => abortRun('STOP')]}>
              <Icon ml='-4px' mr='10px' name={!hasRun ? 'play_arrow' : 'replay'}/>
              {!hasRun ? 'RUN' : 'RESET'}
            </Button>
          </Block>
      }
    </Block>
  )
}

function convertToStar (animal) {
  return {
    type: 'star',
    current: animal.initial
  }
}

export default {
  render
}

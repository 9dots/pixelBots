/** @jsx element */

import ControlPanel from './ControlPanel'
import element from 'vdux/element'
import {Block} from 'vdux-ui'
import {setAnimalPos} from '../actions'
import Level from './Level'
import Tab from './Tab'
import deepEqual from '@f/deep-equal'
import omit from '@f/omit'

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
    active,
    size,
    tabs,
    tab
  } = props

  return (
    <Block
      minHeight='600px'
      bgColor='light'
      boxShadow='0 0 2px 1px rgba(0,0,0,0.2)'
      m='20px'
      mr='0'>
      <Block bgColor='secondary' wide align='flex-end center'>
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
      {options && <Block p='10px'>
        <ControlPanel levelSize={levelSize[0]} inputType={inputType}/>
      </Block>}
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

/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Level from './Level'
import Tab from './Tab'

function render ({props, local, state}) {
  const {
    animals,
    active,
    painted,
    size,
    tab,
    levelSize,
    running,
    targetPainted,
    handleTabClick,
    tabs
  } = props

  return (
    <Block
      minHeight='630px'
      bgColor='light'
      boxShadow='0 0 2px 1px rgba(0,0,0,0.2)'
      my='20px'
      mx='20px'>
      <Block bgColor='secondary' wide align='flex-end center'>
        {
          tabs.map((tabName) => (
            <Tab
              name={tabName}
              bgColor='secondary'
              color='white'
              fs='s'
              active={tab === tabName}
              handleClick={(name) => handleTabClick(name)}/>
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
            levelSize={size}
            numRows={levelSize[0]}
            numColumns={levelSize[1]}/>
        </Block>
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

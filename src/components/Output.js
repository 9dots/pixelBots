/** @jsx element */

import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import OpacitySlider from './OpacitySlider'
import RunWidget from './RunWidget'
import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Level from './Level'

const setOpacity = createAction('<Output/>: SET_OPACITY')

const initialState = ({local}) => ({
  opacity: '0.2',
  actions: {
    setOpacity: local((val) => setOpacity(val))
  }
})

function render ({props, state, local}) {
  const {
    targetPainted,
    levelSize,
    animals,
    running,
    painted,
    hasRun,
    active,
    speed,
    onRun,
    size
  } = props

  const {opacity, actions} = state

  return (
    <Block mr='0'>
      <Block relative p='10px'>
        <Block absolute top='10px' left='10px' h={size} w={size} zIndex='99' opacity={opacity}>
          <Level
            editMode
            animals={[]}
            active={active}
            painted={targetPainted}
            speed={speed}
            levelSize={size}
            numRows={levelSize[0]}
            numColumns={levelSize[1]} />
        </Block>
        <Block h={size} w={size}>
          <Level
            editMode={!running}
            animals={animals}
            running={running}
            active={active}
            painted={painted}
            speed={speed}
            levelSize={size}
            numRows={levelSize[0]}
            numColumns={levelSize[1]} />
        </Block>
        <Block border='1px solid #999' bgColor='white' p='10px' py='20px' wide>
          <OpacitySlider
            opacity={opacity}
            game={props}
            onChange={actions.setOpacity}/>
        </Block>
        <RunWidget animal={animals[active]} hasRun={hasRun} speed={speed} onRun={onRun}/>
      </Block>
    </Block>
  )
}

const reducer = handleActions({
  [setOpacity]: (state, opacity) => ({...state, opacity})
})

export default ({
  initialState,
  reducer,
  render
})

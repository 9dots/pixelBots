/** @jsx element */

import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import OpacitySlider from './OpacitySlider'
import RunWidget from './RunWidget'
import element from 'vdux/element'
import {Block} from 'vdux-containers'
import Level from './Level'
import setProp from '@f/set-prop'
import {incrementalPaint} from '../actions'

const setFillColor = createAction('<OpacitySlider/>: SET_COLOR')
const setPaintMode = createAction('<Output/>: SET_PAINT_MODE')
const setOpacity = createAction('<Output/>: SET_OPACITY')
const RUN_BUTTON = 'Run Button'

const initialState = ({local, props}) => ({
  paintMode: false,
  opacity: props.permissions.indexOf(RUN_BUTTON) === -1 ? '0.5' : '0.2',
  color: 'black',
  actions: {
    setOpacity: local((val) => setOpacity(val)),
    setPaintMode: local(setPaintMode),
    setFillColor: local(setFillColor)
  }
})

function render ({props, state, local}) {
  const {
    targetPainted,
    permissions,
    levelSize,
    completed,
    animals,
    running,
    painted,
    hasRun,
    active,
    speed,
    onRun,
    size
  } = props

  const {opacity, paintMode, actions, color} = state
  const hidePaint = permissions.indexOf(RUN_BUTTON) === -1

  return (
    <Block mr='0'>
      <Block onMouseLeave={() => actions.setPaintMode(false)} relative p='10px' pt='0'>
        <Block relative zIndex='10' border={paintMode ? '1px solid red' : '1px solid transparent'}>
          <Block
            absolute
            top='0'
            left='0px'
            h={size}
            w={size}
            zIndex='5'
            opacity={opacity}>
            <Level
              editMode
              animals={[]}
              paintMode={paintMode}
              clickHandler={hidePaint && !paintMode ? () => {} : addPaint}
              color={color}
              active={active}
              painted={targetPainted}
              speed={speed}
              levelSize={size}
              numRows={levelSize[0]}
              numColumns={levelSize[1]} />
          </Block>
          <Block h={size} w={size}>
            <Level
              hasRun={hasRun}
              animals={hidePaint ? animals.map(animalToInitial) : animals}
              running={running}
              active={active}
              painted={!hidePaint && painted}
              speed={speed}
              levelSize={size}
              numRows={levelSize[0]}
              numColumns={levelSize[1]} />
          </Block>
          <Block border='1px solid #999' bgColor='white' p='10px' py='20px' wide>
            <OpacitySlider
              opacity={opacity}
              color={color}
              setPaintMode={actions.setPaintMode}
              setFillColor={actions.setFillColor}
              game={props}
              onChange={actions.setOpacity}/>
          </Block>
        </Block>
        <RunWidget
          steps={props.game.steps}
          animal={animals[active]}
          running={running}
          completed={completed}
          hasRun={hasRun}
          canRun={permissions.indexOf(RUN_BUTTON) > -1}
          speed={speed}
          onRun={onRun}/>
      </Block>
    </Block>
  )

  function * addPaint (coord) {
    yield incrementalPaint({color, coord, grid: 'targetPainted'})
  }
}

function animalToInitial (animal) {
  return {
    ...animal,
    current: animal.initial
  }
}

const reducer = handleActions({
  [setOpacity.type]: (state, opacity) => ({...state, opacity}),
  [setPaintMode.type]: (state, payload) => ({...state, paintMode: payload}),
  [setFillColor.type]: (state, payload) => ({...state, color: payload})
})

export default ({
  initialState,
  reducer,
  render
})

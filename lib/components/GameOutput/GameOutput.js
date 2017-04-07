/**
 * Imports
 */

import ColorPicker from 'components/ColorPicker'
import ReadWidget from 'components/ReadWidget'
import RunWidget from 'components/RunWidget'
import OpacitySlider from './OpacitySlider'
import {component, element} from 'vdux'
import {Block} from 'vdux-containers'
import Grid from 'components/Grid'

/**
 * <Game Output/>
 */

const RUN_BUTTON = 'Run Button'

export default component({
	initialState ({props}) {
		return {
			paintMode: false,
  		opacity: props.permissions.indexOf(RUN_BUTTON) === -1 ? '0.5' : '0.2',
  		paintColor: 'black',
		}
	},
  render ({props, state, actions}) {
	  const {
	    targetPainted,
	    gameActions,
	    permissions,
	    frameNumber,
	    correctness,
	    levelSize,
	    completed,
	    readOnly,
	    animals,
	    running,
	    painted,
	    frames,
	    hasRun,
	    active,
	    steps,
	    speed,
	    size
	  } = props

	  const hidePaint = permissions.indexOf(RUN_BUTTON) === -1
	  const {opacity, paintMode, paintColor} = state

	  return (
	    <Block mr='0'>
	      <Block onMouseLeave={actions.setPaintMode(false)} relative pr='10px' pt='0'>
	        <Block relative zIndex='10' border={paintMode ? '1px solid red' : '1px solid transparent'}>
	          <Block
	            absolute
	            top='0'
	            left='0px'
	            h={size}
	            w={size}
	            zIndex='5'
	            opacity={opacity}>
	            <Grid
	              animals={[]}
	              paintMode={paintMode}
	              active={active}
	              painted={targetPainted}
	              speed={speed}
	              levelSize={size}
	              numRows={levelSize[0]}
	              numColumns={levelSize[1]} />
	          </Block>
	          <Block h={size} w={size}>
	            <Grid
	              id='pixel-art'
	              mode='read'
	              animalTurn={gameActions.animalTurn}
	              animalMove={gameActions.animalMove}
	              hasRun={hasRun}
	              animals={hidePaint ? animals.map(animalToInitial) : animals}
	              running={running}
	              active={active}
	              painted={hidePaint ? {} : painted}
	              speed={speed}
	              levelSize={size}
	              numRows={levelSize[0]}
	              numColumns={levelSize[1]} />
	          </Block>
	          <Block border='1px solid divider' borderTopWidth={0} bgColor='white' p='10px' py='20px' wide align='space-around center'>
		          <OpacitySlider
	              opacity={opacity}
	              permissions={permissions}
	              onChange={actions.setOpacity}/>
              {
              	// permissions.indexOf('Tracer Paint') !== -1 &&
		              <ColorPicker 
			              setPaintMode={actions.setPaintMode}
			              setFillColor={actions.setFillColor}
			              animalType={animals[active].type}
			             	paintColor={paintColor}
		              	ml />
	            }
	          </Block>
	        </Block>
          {
          	readOnly
          		? <ReadWidget 
          				gameActions={gameActions} 
          				frameNumber={frameNumber}
          				correctness={correctness}
          				frames={frames}
          				w={size} />
			        : <RunWidget
				          steps={steps}
				          running={running}
				          completed={completed}
				          hasRun={hasRun}
				          gameActions={gameActions}
				          hasCode={animals[active].sequence && animals[active].sequence.length > 0}
				          canRun={permissions.indexOf(RUN_BUTTON) > -1}
				          speed={speed} />
	          }
	      </Block>
	    </Block>
	  )
  },
  controller: {
  	* addPaint ({props, state}, coord) {
  		const {paintColor} = state
  		yield props.gameActions.incrementalPaint({paintColor, coord, grid: 'targetPainted'})
  	}
  },
  reducer: {
  	setOpacity: (state, opacity) => ({opacity}),
  	setPaintMode: (state, paintMode) => ({paintMode}),
  	setFillColor: (state, paintColor) => ({paintColor})
  }
})

function animalToInitial (animal) {
  return {
    ...animal,
    current: animal.initial
  }
}

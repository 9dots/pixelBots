/**
 * Imports
 */

import TurnSelector from 'components/TurnSelector'
import ErrorTracker from 'components/ErrorTracker'
import ColorPicker from 'components/ColorPicker'
import PaintButton from 'components/PaintButton'
import ReadWidget from 'components/ReadWidget'
import RunWidget from 'components/RunWidget'
import OpacitySlider from './OpacitySlider'
import {component, element} from 'vdux'
import {Block} from 'vdux-containers'
import Grid from 'components/Grid'
import {Icon} from 'vdux-ui'

/**
 * <Game Output/>
 */


export default component({
	initialState ({props}) {
		return {
			paintMode: false,
  		opacity: props.type === 'read' ? '0' : '0.2',
  		paintColor: 'black',
		}
	},
  render ({props, state, actions}) {
	  const {
	    targetPainted,
	    errorMessage,
	    prevAnimals,
	    gameActions,
	    permissions,
	    frameNumber,
	    correctness,
	    levelSize,
	    completed,
	    readOnly,
	    animals,
	    invalid,
	    running,
	    painted,
	    frames,
	    hasRun,
	    active,
	    steps,
	    speed,
	    size,
	    type
	  } = props

	  const isRead = type === 'read'
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
	            pointerEvents={isRead ? 'none' : 'default'}
	            zIndex='999'
	            opacity={opacity}>
	            <Grid
	              animals={[]}
	              enableColorTips={!isRead}
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
	              animalMove={gameActions.animalMove}
	              prevAnimals={prevAnimals}
	              hasRun={hasRun}
	              animals={animals}
	              running={running}
	              invalid={invalid}
	              active={active}
	              painted={painted}
	              speed={speed}
	              levelSize={size}
	              numRows={levelSize[0]}
	              numColumns={levelSize[1]} />
	          </Block>
          	<Block border='1px solid divider' borderTopWidth={0} bgColor='white' p='10px' py='20px' wide align='space-around center' hide={isRead}>
		          <OpacitySlider
	              opacity={opacity}
	              permissions={permissions}
	              onChange={actions.setOpacity}/>
	          </Block>
	          {
	          	isRead &&
		          	<Block align='center center' bgColor='white' border='1px solid divider' mt='0.5em' wide p>
		          		<ColorPicker
			              dropdownHandler={actions.setFillColor}
			              animalType={animals[active].type}
			             	paintColor={paintColor}
	              		{...btnProps('green')}
	              		borderColor='rgba(black, .1)'
	              		borderRadius='3px 0 0 3px'
	              		borderWidth='0 1px 0 0'
	              		mr={0}
	              		swatchSize={30} />
							    <PaintButton
							    	onClick={gameActions.animalPaint(paintColor)}
							    	{...btnProps('green')}
							    	borderRadius='0 3px 3px 0'
							    	flex />
		          		<TurnSelector
		          			clickHandler={gameActions.animalTurn}
		          			animals={animals}
		          			{...btnProps('#F6F6F6')}
		          			borderColor='#CCC'
	              		borderWidth='1'
		          			color='primary'
		          			w={60}
		          			ml
		          			flex />
	  	          </Block>
  	        }
	        </Block>
          {
          	readOnly ||
			        <RunWidget
				          steps={steps}
				          running={running}
				          completed={completed}
				          hasRun={hasRun}
				          gameActions={gameActions}
				          hasCode={animals[active].sequence && animals[active].sequence.length > 0}
				          canRun={!isRead}
				          speed={speed} />
	          }
	      </Block>
	      <ErrorTracker invalid={invalid} errorMessage={errorMessage} />
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

function btnProps (color) {
	return {
		boxShadow: `0 4px rgba(black, .3), 0 4px rgba(${color}, 1)`,
		borderWidth: 0,
    color: 'white',
  	bgColor: color,
    fs: 'xl',
    w: 100,
    h: 55,
    mb: 4
	}
}

function animalToInitial (animal) {
  return {
    ...animal,
    current: animal.initial
  }
}

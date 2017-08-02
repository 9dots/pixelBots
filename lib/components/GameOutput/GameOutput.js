/**
 * Imports
 */

import ResetBoardButton from 'components/ResetBoardButton'
import GridBlock from 'components/GridOptions/GridBlock'
import DebugStats from 'components/DebugStats'
import PixelInspector from 'components/PixelInspector'
import {Block, Icon, Button, Toggle} from 'vdux-containers'
import TurnSelector from 'components/TurnSelector'
import ErrorTracker from 'components/ErrorTracker'
import ColorPicker from 'components/ColorPicker'
import PaintButton from 'components/PaintButton'
import RunWidget from 'components/RunWidget'
import OpacitySlider from './OpacitySlider'
import {component, element} from 'vdux'
import Canvas from 'components/Canvas'
import {throttle} from 'redux-timing'
import Grid from 'components/Grid'
import Tabs from 'components/Tabs'
import marked from 'marked'
import omit from '@f/omit'

/**
 * <Game Output/>
 */


export default component({
	initialState ({props}) {
		return {
			paintMode: false,
			paintColor: 'black',
			mode: props.type === 'project' ? 'paint' : '',
			inspectMode: false
		}
	},
	render ({props, state, actions, context}) {
		const {
			targetPainted,
			errorMessage,
			invalidCount,
			capabilities,
			userAnimal,
			prevAnimals,
			gameActions,
			permissions,
			frameNumber,
			correctness,
			description,
			animalMove,
			animalTurn,
			savedGame,
			levelSize,
			isProject,
			completed,
			readOnly,
			canPaint,
			isDraft,
			palette,
			animals,
			invalid,
			running,
			painted,
			frames,
			hasRun,
			active,
			paint,
			reset,
			steps,
			speed,
			size,
			type
		} = props

		const isRead = type === 'read'
		const spacer = type === 'project' ? 68 : 0
		const {opacity, paintMode, paintColor, mode, view = 'grid', inspectorData, inspectMode} = state
		const html = description ? marked(description) : ''
		const gridBlockActions = {...gameActions, ...actions}

		return (
			<Block mr='10px'>
				<Block relative pt='0' align='top' height='100%' mb>
					<Block column align='stretch center' border='1px solid divider' mr={12} bg='white' relative w={200}>
						<Block h={46} minHeight='46px' wide align='space-around center' px='20' borderBottom='1px solid divider'>
							<IconTab icon='grid_on' name='grid' setView={actions.setView} current={view} color='green'/>
							<IconTab icon='info' name='info' setView={actions.setView} current={view} color='blue'/>
							<IconTab icon='bug_report' name='debugStats' setView={actions.setView} current={view} color='red'/>
						</Block>
						<Block overflowY='auto' p sq='100%'>
							<Block hide={view !== 'grid'}>
								<Block pb='s' mt='-6' fs='xs'>GOAL:</Block>
								<Canvas 
									id='mini-target'
									h={166} 
									w={166} 
									painted={targetPainted} 
									numRows={levelSize[0]}
									numColumns={levelSize[1]} />
								<Toggle mt label='Show Layover' onChange={actions.toggleLayover} checked={!!opacity} />
								<PixelInspector
									mt
									inspectMode={inspectMode}
									data={inspectorData} /> 
							</Block>
							<Block 
								hide={view !== 'info'} 
								innerHTML={html} 
								lh='1.4em'/>
							<DebugStats type={type} game={savedGame} hide={view !== 'debugStats'} />
						</Block>
					</Block>
					<Block >
						<Block relative zIndex='10'>
							<Block
								relative
								h={parseInt(size, 10) + spacer}
								w={size}
								>
								<GridBlock
									{...gridBlockActions}
									gridState={{mode, color: paintColor, painted: targetPainted}}
									id='target'
									animals={null}
									userAnimal={userAnimal}
									enableMove={false}
									enableSize={false}
									color={paintColor}
									mode={mode}
									painted={targetPainted}
									size='350px'
									palette={palette}
									capabilities={capabilities}
									isProject={type === 'project'}
									enableColorTips={!isRead}
									setCanvasContext={props.setCanvasContext}
									active={active}
									speed={speed}
									onClick={
										inspectMode
											? actions.inspectPixel
											: isRead && animalMove(active)
									}
									levelSize={levelSize}
									numRows={levelSize[0]}
									numColumns={levelSize[1]} />
							</Block>
							<Block
								absolute top left
								z={999}
								pointerEvents='none'
								mt={spacer}>
								<Canvas
									id='solution'
									mode='read'
									opacity={1 - opacity}
									name='solution'
									userAnimal={userAnimal}
									animals={animals}
									hasRun={hasRun}
									running={running}
									invalid={invalid}
									active={active}
									setCanvasContext={props.setCanvasContext}
									painted={painted}
									h={350}
									w={350}
									speed={speed}
									levelSize={size}
									numRows={levelSize[0]}
									numColumns={levelSize[1]} />
							</Block>
							{
								canPaint &&
									<Block align='center center' bgColor='white' border='1px solid divider' mt='0.5em' wide p>
										<ResetBoardButton
											{...btnProps('red')}
											onClick={props.reset}
											borderWidth='1'
											w={60}
											mr='s'
											/>
										<ColorPicker
											clickHandler={actions.setColor('')}
											animalType={animals[active].type}
											colors={palette}
											paintColor={paintColor}
											{...btnProps('green')}
											borderColor='rgba(black, .1)'
											borderRadius='3px 0 0 3px'
											borderWidth='0 1px 0 0'
											mr={0}
											w={60}
											swatchSize={30} />
										<PaintButton
											onClick={paint(active, paintColor)}
											{...btnProps('green')}
											borderRadius='0 3px 3px 0'
											flex />
										<TurnSelector
											clickHandler={actions.animalTurn(active)}
											animal={userAnimal}
											{...btnProps('#F6F6F6')}
											borderColor='#CCC'
											borderWidth='1'
											color='primary'
											w={60}
											ml='s'
											 />
									</Block>
							}
							{
								readOnly ||
									<RunWidget
										{...omit('painted', props)}
										steps={steps}
										running={running}
										teacherBotRunning={animals.some(a => {
											return a.type === 'teacherBot' && a.hidden === false
										})}
										isProject={isProject}
										completed={completed}
										hasRun={hasRun}
										hasCode={animals[active].sequence && animals[active].sequence.length > 0}
										canRun={!canPaint}
										speed={speed} />
							}
						</Block>
					</Block>
				</Block>
				<Block my relative minHeight={24} hide={!readOnly}>
					<ErrorTracker invalid={invalidCount} errorMessage={errorMessage} />
				</Block>
			</Block>
		)
	},
	middleware: [
    throttle('inspectPixel', 100)
  ],
	controller: {
		* animalTurn ({props}, active, turn) {
			const nextTurn = -props.animals[active].current.rot + turn
			yield props.animalTurn(active, nextTurn)
		},
		* setPainted ({props, state}, grid, coordinates) {
			const {paintColor} = state

			yield props.gameActions.setPainted('targetPainted', coordinates, paintColor)
		},
		* erase ({props}, grid, coordinates) {
			yield props.gameActions.setPainted('targetPainted', coordinates, 'white')
		},
		* clearInspection ({props}) {
			const {targetCanvas, solutionCanvas} = props
			targetCanvas.clearSelection()
			solutionCanvas.clearSelection()
		},
		* initInspectMode ({props, state, actions}, inspect) {

			if (inspect) {
				yield actions.inspectPixel([0, 0])
			} 

			yield actions.clearInspection()
			yield actions.setInspectorData(null)
			yield actions.setInspectMode(inspect)
		},
		* inspectPixel ({props, actions}, coordinates) {
			const {targetCanvas, solutionCanvas, painted, targetPainted, levelSize} = props
			targetCanvas.select(coordinates.slice().reverse())
			solutionCanvas.select(coordinates.slice().reverse())
			if (!!coordinates) {
				yield actions.setInspectorData({
					current: props.painted[coordinates] || 'white',
					target: props.targetPainted[coordinates] || 'white',
					coordinates: [coordinates[1], levelSize[0] - 1 - coordinates[0]]
				})
			}
		},
		* toggleLayover ({props, actions, state}) {
			const showLayover = !state.opacity
			yield actions.setOpacity( !showLayover ? 0 : 0.2)
			yield actions.initInspectMode(showLayover)
		}
	},
	reducer: {
		setOpacity: (state, opacity) => ({opacity}),
		setMode: (state, grid, mode) => ({mode}),
		setColor: (state, grid, paintColor) => ({paintColor}),
		setPaintMode: (state, grid, paintMode) => ({paintMode}),
		setView: (state, view) => ({view}),
		turn: (state, turn) => console.log('turn'),
		setSize: () => console.log('set size'),
		setInspectorData: (state, inspectorData) => ({inspectorData}),
		setInspectMode: (state, inspectMode) => ({inspectMode})
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

const IconTab = component({
	render({props, context}) {
		const {icon, name, setView, current, color = 'blue'} = props
		const active = name === current

		return (
			<Icon 
				p='10'
				userSelect='none'
				color={active ? color : '#BBB'}
				onClick={setView(name)}  
				name={icon} 
				pointer
				fs='m' />
		)
	}
})
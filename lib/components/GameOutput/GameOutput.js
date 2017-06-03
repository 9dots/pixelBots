/**
 * Imports
 */

import GridBlock from 'components/GridOptions/GridBlock'
import TurnSelector from 'components/TurnSelector'
import ErrorTracker from 'components/ErrorTracker'
import ColorPicker from 'components/ColorPicker'
import PaintButton from 'components/PaintButton'
import RunWidget from 'components/RunWidget'
import OpacitySlider from './OpacitySlider'
import {component, element} from 'vdux'
import {Block} from 'vdux-containers'
import Grid from 'components/Grid'
import Tabs from 'components/Tabs'
import marked from 'marked'

/**
 * <Game Output/>
 */


export default component({
	initialState ({props}) {
		return {
			paintMode: false,
			opacity: props.type === 'read' ? '0' : '0.2',
			paintColor: 'black',
			mode: props.type === 'project' ? 'paint' : ''
		}
	},
	render ({props, state, actions}) {
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
			levelSize,
			isProject,
			completed,
			readOnly,
			canPaint,
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
		const spacer = type === 'project' ? 73 : 0
		const {opacity, paintMode, paintColor, mode, view = 'grid'} = state
		const isGridView = view === 'grid'
		const html = description ? marked(description) : ''

		return (
			<Block mr='0'>
				<Block onMouseLeave={actions.setPaintMode(false)} relative pr='10px' pt='0' align='stretch center' column display={isGridView ? 'block' : 'flex'} h='100%'>
					<Block border='1px solid divider' borderBottomWidth={0} bgColor='white' px wide align='center stretch' zIndex='11' relative minHeight='52px'>
						<Tabs tabs={['Grid', 'Directions']} onClick={actions.setView} active='grid' borderBottomWidth={0} tabProps={{flex: true}} />
					</Block>
					<Block h='100%' lh='1.4em' relative zIndex='10' hide={isGridView} w={350} px py='s' bg='white' border='1px solid divider' overflowY='auto' boxShadow='rgba(black, 0.2) 0px 2px 3px -2px inset' innerHTML={html} />
					<Block relative zIndex='10' hide={!isGridView}>
						<Block
							relative
							h={parseInt(size, 10) + spacer}
							w={size}
							z={998}>
							<GridBlock
								animals={animals}
								userAnimal={userAnimal}
								gridState={{mode, color: paintColor, painted: targetPainted}}
								enableMove={false}
								enableSize={false}
								size='350px'
								palette={palette}
								capabilities={capabilities}
								isProject={type === 'project'}
								enableColorTips={!isRead}
								paintMode={paintMode}
								active={active}
								speed={speed}
								onClick={isRead && animalMove(active)}
								actions={{...gameActions, ...actions}}
								levelSize={levelSize}
								numRows={levelSize[0]}
								numColumns={levelSize[1]} />
						</Block>
						<Block
							absolute top left
							z={999}
							pointerEvents='none'
							mt={spacer}
							sq={size}>
							<Grid
								id='pixel-art'
								mode='read'
								userAnimal={userAnimal}
								opacity={1 - opacity}
								animals={animals}
								hasRun={hasRun}
								running={running}
								invalid={invalid}
								active={active}
								painted={painted}
								speed={speed}
								levelSize={size}
								numRows={levelSize[0]}
								numColumns={levelSize[1]} />
						</Block>
						<Block border='1px solid divider' borderTopWidth={0} bgColor='white' p='10px' py='20px' wide align='space-around center' hide={canPaint}>
							<OpacitySlider
								opacity={opacity}
								permissions={permissions}
								onChange={actions.setOpacity}/>
						</Block>
						{
							canPaint &&
								<Block align='center center' bgColor='white' border='1px solid divider' mt='0.5em' wide p>
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
						{
							readOnly ||
								<RunWidget
										{...props}
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
						<ErrorTracker invalid={invalidCount} errorMessage={errorMessage} />
					</Block>
				</Block>
			</Block>
		)
	},
	controller: {
		* animalTurn ({props}, active, turn) {
			const nextTurn = -props.animals[active].current.rot + turn
			yield props.animalTurn(active, nextTurn)
		},
		* setPainted ({props, state}, grid, coord) {
			const {paintColor} = state
			yield props.gameActions.setPainted('targetPainted', coord, paintColor)
		},
		* erase ({props}, grid, coord) {
			yield props.gameActions.setPainted('targetPainted', coord, 'white')
		}
	},
	reducer: {
		setOpacity: (state, opacity) => ({opacity}),
		setMode: (state, grid, mode) => ({mode}),
		setColor: (state, grid, paintColor) => ({paintColor}),
		setPaintMode: (state, grid, paintMode) => ({paintMode}),
		setView: (state, view) => ({view}),
		turn: (state, turn) => console.log('turn'),
		setSize: () => console.log('set size')
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

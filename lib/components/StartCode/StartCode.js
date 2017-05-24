/**
 * Imports
 */

import {updateAnimal, getLastTeacherFrame, isEqualSequence, getIterator} from 'utils/frameReducer'
import createApi, {capabilities, teacherBot, createDocs} from 'animalApis'
import GridSizeSelector from 'components/GridSizeSelector'
import initialGameState from 'utils/initialGameState'
import GameEditor from 'components/GameEditor'
import {resetAnimalPos} from 'utils/animal'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import deepEqual from '@f/deep-equal'
import {debounce} from 'redux-timing'
import Grid from 'components/Grid'
import setProp from '@f/set-prop'
import {Block} from 'vdux-ui'
import srand from '@f/srand'

/**
 * Constants
 */

const btnProps = {
	bgColor: '#FAFAFA',
	border: '1px solid #CACACA',
	sq: 40,
	color: 'black'
}

/**
 * <StartCode/>
 */

export default component({
	initialState: ({props}) => ({
		...initialGameState,
		...props,
		rand: srand(Math.random() * 1000),
		active: 0
	}),

	* onCreate ({state, actions}) {
		yield actions.gameDidInitialize(state)
	},

  render ({props, state, actions}) {
  	const {initialData, animals, painted, levelSize, capabilities, active} = state
  	const {inputType, advanced} = props

		return (
			<Block hide={props.hide} maxWidth={1200} flex m='0 auto'>
				{
					advanced ||
						<Block pt textAlign='center'>
							<Block fs='m'color='blue'>Start Code</Block>
							<Block fs='xs' my>
								Students will use the start code to draw the resulting picture on the grid.
							</Block>
						</Block>
				}
				<Block flex wide h='600px'>
					<Block tall align='start' wide>
						{
							!props.hideGrid && <Block mr>
								<Block bgColor='white' p='1em' border='1px solid divider' borderBottomWidth={0} align='space-between center'>
									<GridSizeSelector size={levelSize[0]} setSize={actions.setSize} {...btnProps} />
									{
										advanced &&
											<Button {...btnProps} w='auto' px color='white' onClick={actions.generateStartGrid} bgColor='blue' fs='xs'>
												Generate Start Grid
											</Button>
									}
								</Block>
								<Block maxWidth='900px'>
									<Grid
										mode='edit'
										paintMode
										animals={animals}
										painted={painted}
										levelSize='400px'
										numRows={levelSize[0]}
										numColumns={levelSize[1]}
										/>
									</Block>
							</Block>
						}
						<GameEditor
              docs={createDocs(capabilities, active)}
              active={active}
              animals={animals}
              levelSize={levelSize}
              inputType={inputType}
              sequence={state.animals[state.active].sequence}
              onChange={actions.setSequence(state.active)}
              gameActions={actions}
              initialData={initialData}
              canCode
              hideApi />
					</Block>
				</Block>
			</Block>
		)
	},

	middleware: [
    debounce('save', 1000)
  ],

	* onUpdate (prev, {props, state, actions}) {
		if (prev.props.levelSize[0] !== props.levelSize[0]) {
			yield actions.gameDidInitialize({
				...state,
				animals: props.animals.map((a, i) => ({...a, sequence: state.animals[i].sequence || '', current: a.initial})),
				levelSize: props.levelSize
			})
		}

		if (!isEqualSequence(prev.state.animals, state.animals)) {
			yield actions.save()
		}
	},

	controller: {
		* setSize ({context, props, state}, size) {
			const animals = state.animals.map(a => resetAnimalPos(a, size))
			const solution = (props.solution || []).map(a => resetAnimalPos(a, size))
			yield props.updateGame({
				levelSize: [size, size],
				animals,
				solution
			})
		},
		* save ({state, props}) {
			const {animals} = state
			yield props.save({
				animals: props.animals.map((a, i) => ({
					...a,
					sequence: animals[i].sequence || null
				}))
			})
		}
	},

	reducer: {
		reset: (state) => ({
			animals: state.animals.map(animal => ({...animal, current: animal.initial}))
		}),
		gameDidInitialize: (state, game) => ({initialData: game, ...game}),
		setSequence: (state, id, sequence) => ({
			animals: updateAnimal(state.animals, 'sequence', id, sequence)
		}),
		generateStartGrid: (state) => ({painted: generateStartGrid({...state, painted: {}})})
	}
})

function generateStartGrid (state) {
	const animal = state.animals[0]
	const it = getIterator(animal.sequence, createApi(capabilities, 0))
	return getLastTeacherFrame(state, it)
}

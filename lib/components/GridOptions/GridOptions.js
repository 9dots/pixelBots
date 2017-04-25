/**
 * Imports
 */

import StartCode from 'components/StartCode'
import filterPaint from 'utils/filterPaint'
import {component, element} from 'vdux'
import mapValues from '@f/map-values'
import GridBlock from './GridBlock'
import setProp from '@f/set-prop'
import Options from './Options'
import filter from '@f/filter'
import {Block} from 'vdux-ui'

/**
 * <Grid Options/>
 */

export default component({
	initialState ({props}) {
		return {
			targetPainted: {
				painted: props.targetPainted,
				mode: 'paint',
				color: 'black'
			},
			initialPainted: {
				painted: props.initialPainted,
				mode: 'paint',
				color: 'black'
			},
			targetGrid: true
		}
	},
  render ({props, state, actions, children}) {
  	const {type, animals, levelSize, ...restProps} = props
  	const {targetPainted, initialPainted, targetGrid, startGrid, startCode} = state
  	
  	const btnProps = {
  		bgColor: '#FAFAFA', 
  		border: '1px solid #CACACA', 
  		sq: 40,
  		color: 'black'
  	}

    return (
      <Block tall wide>
      	<Block minWidth='1132' align='start center' column>
          <Block mb wide pb borderBottom='1px solid divider'>
            <Options {...actions} {...state} />
      		</Block>
      		<Block align='center start' flexWrap='wrap' wide maxWidth='1132'>
      			<GridBlock 
      				{...props}
      				gridState={initialPainted}
      				grid='initialPainted'
      				info={'The student\'s grid will start like the grid below.'}
      				title='Paint Your Start Grid'
      				actions={actions} 
      				mr={startGrid && targetGrid ? 40 : 10} 
      				maxWidth='50%'
      				hide={!startGrid} />
      			<GridBlock 
      				{...props} 
      				gridState={targetPainted}
      				grid='targetPainted'
      				info='Students will use code to create the grid below.'
      				title='Paint Your Target Grid'
      				actions={actions}
      				mr={10}
      				maxWidth='50%'
      				enableMove={false}
      				hide={!targetGrid} />
	    			<StartCode 
	    				hideGrid
	    				wide
	    				{...props}
              hide={!startCode} />
    			</Block>
        </Block>
        {children}
      </Block>
    )
  },
  * onRemove ({actions, props, context, state}) {
  	yield props.save({
  		targetPainted: filterPaint(state.targetPainted.painted) || null,
  		initialPainted: filterPaint(state.initialPainted.painted) || null
  	})
  },
  controller: {
  	* setSize ({props, state, context, actions}, size) {
      const {animals} = props
  		yield context.firebaseUpdate(props.ref, {
  			levelSize: [size, size],
        animals: animals.map((a) => ({
          ...a,
          current: {...a.current, location: [size - 1, 0]},
          initial: {...a.initial, location: [size - 1, 0]}
        }))
      })
  		yield actions.setBulkPainted('targetPainted', filter((val, key) => (
        key.split(',').every((v) => v <= size - 1)
      ), state.targetPainted.painted))
  		yield actions.setBulkPainted('initialPainted', filter((val, key) => (
        key.split(',').every((v) => v <= size - 1)
      ), state.initialPainted.painted))

  	},
    * moveAnimal ({state, context, props}, grid, location) {
      const {animals, ref} = props
      yield context.firebaseUpdate(ref, {
        animals: animals.map((a) => ({
          ...a,
          current: {...a.current, location},
          initial: {...a.initial, location}
        }))
      })
    },
    * turn ({state, context, props}, grid, rot) {
      const {animals, ref} = props
      yield context.firebaseUpdate(ref, {
        animals: animals.map((a) => ({
          ...a,
          current: {...a.current, rot},
          initial: {...a.initial, rot}
        }))
      })
    }
  },
  reducer: {
  	setBulkPainted: (state, grid, painted) => setProp(`${grid}.painted`, state, painted),
  	setPainted: (state, grid, location) => (
  		setProp(`${grid}.painted.${location}`, state, state[grid].color)
  	),
  	setMode: (state, grid, mode) => (
  		setProp(`${grid}.mode`, state, mode)
  	),
  	setColor: (state, grid, color) => (
  		setProp(`${grid}.color`, state, color)
  	),
  	erase: (state, grid, location) => (
  		setProp(`${grid}.painted.${location}`, state, null)
  	),
  	toggleTarget: (state) => ({targetGrid: !state.targetGrid}),
  	toggleStart: (state) => ({startGrid: !state.startGrid}),
  	toggleCode: (state) => ({startCode: !state.startCode})
  }
})
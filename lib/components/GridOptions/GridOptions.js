/**
 * Imports
 */

import AdvancedEditor from 'components/AdvancedEditor'
import StartCode from 'components/StartCode'
import filterPaint from 'utils/filterPaint'
import {component, element} from 'vdux'
import GridBlock from './GridBlock'
import setProp from '@f/set-prop'
import Options from './Options'
import filter from '@f/filter'
import {Block} from 'vdux-ui'

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
 * <GridOptions/>
 */

export default component({
	initialState: ({props}) => ({
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
	}),
  render ({props, state, actions, children}) {
  	const {type, animals, levelSize, advanced, ...restProps} = props
  	const {targetPainted, initialPainted, targetGrid, startGrid, startCode} = state

    return (
      <Block tall wide>
      	<Block minWidth='1045' wide align='start center' column>
          <Block mb wide pb borderBottom='1px solid divider'>
            <Options {...actions} {...state} {...props} />
          </Block>
          {
            advanced
              ? <Block align='center start' flexWrap='wrap' wide maxWidth='1132'>
                  <AdvancedEditor {...props}/>
                </Block>
              : <Block align='center start' flexWrap='wrap' wide maxWidth='1132' hide={advanced}>
                  <GridBlock
                    {...props}
                    gridState={initialPainted}
                    grid='initialPainted'
                    info={'The student\'s grid will start like the grid below.'}
                    title='Start Grid'
                    actions={actions}
                    mr={startGrid && targetGrid ? 40 : 10}
                    maxWidth='50%'
                    hide={!startGrid} />
                  <GridBlock
                    {...props}
                    gridState={targetPainted}
                    grid='targetPainted'
                    info='Students will use code to create the grid below.'
                    title='Target Grid'
                    actions={actions}
                    mr={10}
                    maxWidth='50%'
                    enableMove={false}
                    hide={!targetGrid} />
                  <StartCode
                    hideGrid
                    wide
                    save={props.updateGame}
                    {...props}
                    hide={!startCode} />
                </Block>
          }
        </Block>
        {children}
      </Block>
    )
  },

  * onRemove ({actions, props, context, state}) {
    if (!props.advanced) {
      yield props.updateGame({
        targetPainted: filterPaint(state.targetPainted.painted) || null,
        initialPainted: filterPaint(state.initialPainted.painted) || null
      })
    }
  },

  controller: {
  	* setSize ({props, state, context, actions}, size) {
      const {animals} = props

  		yield props.updateGame({
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

      yield props.updateGame({
        animals: animals.map((a) => ({
          ...a,
          current: {...a.current, location},
          initial: {...a.initial, location}
        }))
      })
    },
    * turn ({state, context, props}, grid, rot) {
      const {animals, ref} = props

      yield props.updateGame({
        animals: animals.map((a) => ({
          ...a,
          current: {...a.current, rot},
          initial: {...a.initial, rot}
        }))
      })
    },
    * toggleAdvanced ({props, state}) {
      yield props.updateGame({advanced: !props.advanced})
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

/**
 * Imports
 */

import AdvancedEditor from 'components/AdvancedEditor'
import StartCode from 'components/StartCode'
import {resetAnimal} from 'utils/animal'
import {component, element} from 'vdux'
import GridBlock from './GridBlock'
import Options from './Options'
import filter from '@f/filter'
import {Block} from 'vdux-ui'
import sleep from '@f/sleep'

/**
 * <GridOptions/>
 */

export default component({
  initialState ({props}) {
    return {
      targetGrid: props.type !== 'project',
      startGrid: props.type === 'project',
      startCode: props.type === 'debug'
    }
  },
  render ({props, state, actions, children}) {
  	const {advanced, target, initial} = props
  	const {targetGrid, startGrid, startCode} = state

    return (
      <Block tall wide>
      	<Block minWidth='1045' wide align='start center' column>
          <Block mb wide pb borderBottom='1px solid divider'>
            <Options {...actions} {...state} {...props} />
          </Block>
          {
            advanced
              ? <Block align='center start' flexWrap='wrap' wide maxWidth='1132'>
                  <AdvancedEditor {...props} />
                </Block>
              : <Block align='center start' flexWrap='wrap' wide maxWidth='1132' hide={advanced}>
                  <GridBlock
                    {...props}
                    {...actions}
                    {...props.actions}
                    name='initial'
                    gridState={initial}
                    grid='initial'
                    info={'The student\'s grid will start like the grid below.'}
                    title='Start Grid'
                    mr={startGrid && targetGrid ? 40 : 10}
                    maxWidth='50%'
                    hide={!startGrid} />
                  <GridBlock
                    {...props}
                    {...actions}
                    {...props.actions}
                    gridState={target}
                    name='target'
                    grid='target'
                    hideAnimals
                    info='Students will use code to create the grid below.'
                    title='Target Grid'
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

  controller: {
  	* setSize ({props, state, context, actions}, size) {
      const {animals} = props

      const targetPainted = filter((val, key) => (
        key.split(',').every((v) => v <= size - 1)
      ), props.target.painted)
      const initialPainted = filter((val, key) => (
        key.split(',').every((v) => v <= size - 1)
      ), props.initial.painted)

      yield props.actions.setBulkPainted('target', targetPainted)
      yield props.actions.setBulkPainted('initial', initialPainted)

  		yield props.updateGame({
  			levelSize: [size, size],
        animals: animals.map((a) => ({
          ...a,
          current: {...a.current, location: [size - 1, 0]},
          initial: {...a.initial, location: [size - 1, 0]}
        })),
        targetPainted,
        initialPainted
      })

      // yield sleep(500)
  	},
    * moveAnimal ({state, context, props}, grid, location) {
      const {animals} = props

      yield props.updateGame({
        animals: animals.map((a) => ({
          ...a,
          current: {...a.current, location},
          initial: {...a.initial, location}
        }))
      })
    },
    * turn ({state, context, props}, grid, rot) {
      const {animals} = props

      yield props.updateGame({
        animals: animals.map((a) => ({
          ...a,
          current: {...a.current, rot},
          initial: {...a.initial, rot}
        }))
      })
    },
    * toggleAdvanced ({props, state, actions}) {
      const {advanced, animals, levelSize} = props
      const size = levelSize[0]
      yield props.updateGame({
        advanced: !advanced,
        targetPainted: null,
        initialPainted: null,
        imageUrl: '/animalImages/teacherBot.png',
        painted: null,
        animals: animals.map((a) => resetAnimal(a, size))
      })
      yield props.actions.setBulkPainted('targetPainted', {})
      yield props.actions.setBulkPainted('initialPainted', {})
    }
  },
  reducer: {
  	toggleTarget: (state) => ({targetGrid: !state.targetGrid}),
  	toggleStart: (state) => ({startGrid: !state.startGrid}),
  	toggleCode: (state) => ({startCode: !state.startCode})
  }
})

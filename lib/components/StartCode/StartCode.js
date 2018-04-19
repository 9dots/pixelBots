/**
 * Imports
 */

import createApi, { teacherBot, createDocs } from 'animalApis'
import GridBlock from 'components/GridOptions/GridBlock'
import initialGameState from 'utils/initialGameState'
import GameEditor from 'components/GameEditor'
import { resetAnimalPos } from 'utils/animal'
import { component, element } from 'vdux'
import { Button } from 'vdux-containers'
import { debounce } from 'redux-timing'
import diffKeys from '@f/diff-keys'
import { Block } from 'vdux-ui'
import filter from '@f/filter'
import range from '@f/range'
import srand from '@f/srand'
import {
  updateAnimal,
  getLastTeacherFrame,
  isEqualSequence,
  getIterator
} from 'utils/frameReducer'

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
  initialState: ({ props }) => ({
    ...initialGameState,
    ...props,
    rand: srand(Math.random() * 1000),
    docs: createDocs(props.capabilities, props.palette),
    active: 0
  }),

  * onCreate ({ state, actions }) {
    yield actions.gameDidInitialize(state)
    yield { type: 'INITIALIZE_BLOCK_EDITOR' }
  },

  render ({ props, state, actions }) {
    const { inputType, advanced, userAnimal, type, cursorPosition } = props
    const { initialData, animals, painted, levelSize, active, docs } = state

    return (
      <Block hide={props.hide} maxWidth={1200} flex m='0 auto'>
        {!advanced &&
          type !== 'read' && (
            <Block textAlign='center'>
              <Block fs='m' color='blue'>
                Start Code
              </Block>
              <Block fs='xs' my>
                Students will use the start code to draw the resulting picture
                on the grid.
              </Block>
            </Block>
          )}
        <Block flex wide h='600px'>
          <Block tall align='start' wide>
            {!props.hideGrid && (
              <Block mr>
                <GridBlock
                  {...actions}
                  {...props.actions}
                  userAnimal={userAnimal}
                  grid='initial'
                  moreActions={
                    advanced && (
                      <Button
                        {...btnProps}
                        w='auto'
                        px
                        color='white'
                        onClick={actions.generateStartGrid}
                        bgColor='blue'
                        fs='xs'>
                        Generate Start Grid
                      </Button>
                    )
                  }
                  enableMove={type === 'read'}
                  enablePaint={!props.advanced}
                  palette={state.palette}
                  levelSize={levelSize}
                  id='initial'
                  animals={animals}
                  gridState={{
                    ...props.initial,
                    mode: advanced ? null : props.initial.mode
                  }}
                  painted={painted} />
              </Block>
            )}
            <GameEditor
              startCode={true}
              docs={docs}
              active={active}
              animals={animals}
              levelSize={levelSize}
              inputType={inputType}
              setCursorPosition={props.actions.setCursorPosition}
              sequence={state.animals[state.active].sequence}
              onChange={actions.setSequence(state.active)}
              gameActions={actions}
              cursorPosition={cursorPosition}
              addCapability={actions.addCapability}
              removeCapability={actions.removeCapability}
              editCapability={actions.editCapability}
              initialData={initialData}
              canCode
              hideApi />
          </Block>
        </Block>
      </Block>
    )
  },

  middleware: [debounce('save', 1000)],

  * onUpdate (prev, { props, state, actions }) {
    if (prev.props.levelSize[0] !== props.levelSize[0]) {
      yield actions.gameDidInitialize({
        ...state,
        animals: props.animals.map((a, i) => ({
          ...a,
          sequence: state.animals[i].sequence || '',
          current: a.initial
        })),
        levelSize: props.levelSize
      })
    }

    if (!isEqualSequence(prev.state.animals, state.animals)) {
      yield actions.save()
    }

    if (prev.state.docs !== state.docs) {
      yield actions.saveDocs(state.docs)
    }

    if (prev.props.animals !== props.animals) {
      yield actions.updateAnimals(props.animals)
    }

    if (props.initialCanvas && prev.state.painted !== state.painted) {
      const newKeys = diffKeys(prev.state.painted, state.painted)
      newKeys.forEach(key => {
        const [y, x] = key.split(',').map(Number)
        const place = x + state.levelSize[0] * y
        props.initialCanvas.updateShapeColor(
          place,
          state.painted[key] || 'white'
        )
      })
      if (!props.advanced) {
        yield actions.save()
      }
    }
  },

  controller: {
    * setSize ({ context, props, state }, size) {
      const animals = state.animals.map(a => resetAnimalPos(a, size))
      const solution = (props.solution || []).map(a => resetAnimalPos(a, size))
      yield props.updateGame({
        levelSize: [size, size],
        animals,
        solution
      })
    },
    * saveDocs ({ state, props }, userDocs) {
      yield props.save({
        userDocs
      })
    },
    * save ({ state, props }, data = {}) {
      const { animals, painted } = state
      yield props.save({
        animals: props.animals.map((a, i) => ({
          ...a,
          sequence: animals[i].sequence || null
        })),
        initialPainted: painted,
        painted
      })
    },
    * moveAnimal ({ state, context, props }, grid, location) {
      const { animals } = props

      yield props.updateGame({
        animals: animals.map(a => ({
          ...a,
          current: { ...a.current, location },
          initial: { ...a.initial, location }
        }))
      })
    },
    * turn ({ state, context, props }, grid, rot) {
      const { animals } = props

      yield props.updateGame({
        animals: animals.map(a => ({
          ...a,
          current: { ...a.current, rot },
          initial: { ...a.initial, rot }
        }))
      })
    }
  },

  reducer: {
    reset: state => ({
      animals: state.animals.map(animal => ({
        ...animal,
        current: animal.initial
      }))
    }),
    gameDidInitialize: (state, game) => ({ initialData: game, ...game }),
    setSequence: (state, id, sequence) => ({
      animals: updateAnimal(state.animals, 'sequence', id, sequence)
    }),
    updateAnimals: (state, animals) => ({
      animals: animals.map((a, i) => ({
        ...a,
        sequence: state.animals[i].sequence
      }))
    }),
    editCapability: (state, name, args) => ({
      docs: {
        ...state.docs,
        [name]: {
          ...state.docs[name],
          args: args.map(
            arg =>
              arg.type === 'string'
                ? {
                  ...arg,
                  name: 'color',
                  default: {
                    type: 'string',
                    value: 'black'
                  },
                  values: state.palette
                }
                : { ...arg, default: 1, values: range(1, 10) }
          )
        }
      }
    }),
    generateStartGrid: state => ({
      painted: generateStartGrid({ ...state, painted: {} })
    }),
    setPainted: (state, grid, coord, color) => ({
      painted: { ...state.painted, [coord]: state.paintColor }
    }),
    erase: (state, grid, coord) => ({
      painted: { ...state.painted, [coord]: 'white' }
    }),
    addCapability: (state, name, payload, prevName = '') => ({
      docs: {
        ...filter((val, key) => key !== prevName, state.docs),
        [name]: payload
      }
    }),
    removeCapability: (state, name) => ({
      docs: filter((val, key) => key !== name, state.docs)
    })
  }
})

function generateStartGrid (state) {
  const animal = state.animals[0]
  const it = getIterator(animal.sequence, createApi(teacherBot, 0))
  return getLastTeacherFrame(state, it)
}

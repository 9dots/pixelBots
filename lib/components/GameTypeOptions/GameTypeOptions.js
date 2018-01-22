/**
 * Imports
 */

import CreateLayout from 'pages/Create/CreateLayout'
import GridOptions from 'components/GridOptions'
import StartCode from 'components/StartCode'
import { component, element } from 'vdux'
import diffKeys from '@f/diff-keys'
import setProp from '@f/set-prop'
import Switch from '@f/switch'
import { Block } from 'vdux-ui'
import reduce from '@f/reduce'

/**
 * <Grid Options/>
 */

function getPainted (state) {
  return {
    ...state,
    initialPainted: removeEmpty(state.initial.painted),
    targetPainted: removeEmpty(state.target.painted)
  }
}

function removeEmpty (paint) {
  return reduce(
    (acc, val, key) => (val ? { ...acc, [key]: val } : acc),
    {},
    paint
  )
}

export default component({
  initialState: ({ props }) => ({
    target: {
      painted: props.targetPainted || {},
      mode: 'paint',
      color: 'black'
    },
    initial: {
      painted: props.initialPainted || {},
      mode: 'paint',
      color: 'black'
    }
  }),
  render ({ props, actions, children, state }) {
    const { type = 'write', advanced } = props
    const paintState = !advanced ? getPainted(state) : {}

    return (
      <CreateLayout {...props} {...paintState} step='create'>
        {Switch({
          write: () => (
            <GridOptions
              actions={actions}
              save={props.updateGame}
              {...props}
              {...state}>
              {children}
            </GridOptions>
          ),
          read: () => (
            <StartCode
              actions={actions}
              save={props.updateGame}
              {...props}
              {...state}>
              {children}
            </StartCode>
          ),
          debug: () => (
            <GridOptions
              actions={actions}
              save={props.updateGame}
              {...props}
              {...state}>
              {children}
            </GridOptions>
          ),
          project: () => (
            <GridOptions
              actions={actions}
              isProject
              save={props.updateGame}
              {...props}
              {...state} />
          ),
          default: () => <div> invalid </div>
        })(type)}
      </CreateLayout>
    )
  },
  * onUpdate (prev, { state, props }) {
    if (
      prev.state.target.painted &&
      prev.state.target.painted !== state.target.painted
    ) {
      const newKeys = diffKeys(prev.state.target.painted, state.target.painted)
      newKeys.forEach(key => {
        const [y, x] = key.split(',').map(Number)
        const place = x + props.levelSize[0] * y
        state.targetCanvas.updateShapeColor(
          place,
          state.target.painted[key] || 'white'
        )
      })
    }

    if (prev.state.initial.painted !== state.initial.painted) {
      const newKeys = diffKeys(
        prev.state.initial.painted,
        state.initial.painted
      )
      newKeys.forEach(key => {
        const [y, x] = key.split(',').map(Number)
        const place = x + props.levelSize[0] * y
        state.initialCanvas.updateShapeColor(
          place,
          state.initial.painted[key] || 'white'
        )
      })
    }
  },
  reducer: {
    setBulkPainted: (state, grid, painted) =>
      setProp(`${grid}.painted`, state, painted),
    setPainted: (state, grid, coordinates) =>
      setProp(`${grid}.painted.${coordinates}`, state, state[grid].color),
    setMode: (state, grid, mode) => {
      return setProp(`${grid}.mode`, state, mode)
    },
    setColor: (state, grid, color) => setProp(`${grid}.color`, state, color),
    erase: (state, grid, coordinates) =>
      setProp(`${grid}.painted.${coordinates}`, state, null),
    setCanvasContext: (state, canvas, name) => ({ [`${name}Canvas`]: canvas })
  }
})

/**
* Imports
*/

import middleware, {initCanvas, updateCanvas} from './middleware/drawMiddleware'
import {component, element, decodeRaw, Window} from 'vdux'
import Animal from 'components/Animal'
import mapValues from '@f/map-values'
import diffKeys from '@f/diff-keys'
import forEach from '@f/foreach'
import reduce from '@f/reduce'
import {Block} from 'vdux-ui'
import C2S from 'pb-canvas2svg'
import range from '@f/range'
import sleep from '@f/sleep'
import find from '@f/find'


/**
* <Canvas/>
*/


export default component({
  initialState: {
    node: false
  },
  * afterRender ({state, actions}, node) {
    if (!state.node) {
      yield actions.setNode(node)
    }
  },
  render ({props, state, actions}) {
    const {id, h, w, numRows, animals, opacity} = props
    const {svg} = state
    const size = Math.floor(350 / numRows)
    const gridSize = Math.floor(350 / numRows) * numRows + 1
    const offset = 350 / gridSize

    return (
      <Block left w='350px' h='350px' relative>
        {
          animals.map((animal, i) => (
            <Animal
              {...props}
              offset={350 / (size * numRows)}
              cellSize={size}
              animal={animal}
              id={i} />
          ))
        }
        <Block bgColor='white' relative>
          <Block
            class='svg-container'
            onMouseMove={[actions.dragStart, decodeRaw(actions.onDrag)]}
            onMouseDown={[actions.mouseDown, decodeRaw(actions.handleClick)]}
            onMouseUp={actions.dragEnd}
            innerHTML={svg} />
        </Block>
        {
          state.mouseDown && <Window onMouseUp={actions.dragEnd} />
        }
      </Block>
    )
  },
  middleware: [
    middleware
  ],
  * onUpdate (prev, {props, context, state, actions, children}) {
    const {painted, numColumns, numRows, name, animals, onClick = () => {}} = props
    const size = Math.floor(350 / numRows)
    const gridSize = size * numRows
    const offset = 350 / gridSize

    if (!prev.state.node && state.node) {
      if (state.canvasState) {
        state.canvasState.clear()
      }
      yield initCanvas(getOpts())
    }
    if (prev.props.numRows !== props.numRows) {
      yield updateCanvas(getOpts())
    }

    function getOpts () {
      return {
        ctx: new C2S(350, 350, {viewBox: `-0.5 -0.5 ${gridSize + 0.5} ${gridSize + 0.6}`}),
        cellSize: size,
        gridSize,
        numRows,
        painted,
        offset,
        name
      }
    }
  },
  controller: {
    * handleClick ({props, state}, e) {
      const {canvasState} = state
      const target = state.canvasState.handleMouseDown.call(canvasState, e)
      if (props.onClick) {
        yield props.onClick(target, canvasState)
      }
    },

    * onDrag ({props, state, actions}, e) {
      if (state.dragging && props.onDrag) {
        yield actions.handleClick(e)
      } 
    },

    * setCanvasContext ({props}, ctx) {
      if (props.setCanvasContext) {
        yield props.setCanvasContext(ctx, props.name)
      }
    }
  },
  reducer: {
    setNode: (state, node) => ({node}),
    setCanvas: (state, canvasState) => ({canvasState}),
    dragStart: ({mouseDown, dragging}) => {
      if (mouseDown && !dragging) {
        return {dragging: true}
      }
    },
    dragEnd: () => ({dragging: false, mouseDown: false}),
    mouseDown: () => ({mouseDown: true}),
    setSvg: (state, svg) => ({svg})
  }
})


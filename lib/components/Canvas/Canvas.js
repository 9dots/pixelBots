/**
 * Imports
 */

import { component, element, decodeRaw, Window } from 'vdux'
import Animal from 'components/Animal'
import forEach from '@f/foreach'
import { Block } from 'vdux-ui'
import C2S from 'pb-canvas2svg'
import middleware, {
  initCanvas,
  updateCanvas
} from './middleware/drawMiddleware'

function applyAttrs (element, attrs) {
  forEach((val, key) => element.setAttribute(key, val), attrs)
}

/**
 * <Canvas/>
 */

export default component({
  initialState: {
    node: false
  },
  * afterRender ({ state, actions }, node) {
    if (!state.node) {
      yield actions.setNode(node)
    }
  },
  render ({ props, state, actions }) {
    const { h, w, numRows, animals = [], opacity, type, speed, running } = props
    const { svg } = state
    const size = Math.floor(w / numRows)

    return (
      <Block left w={w} h={h} relative>
        <Block bgColor='white' relative opacity={opacity}>
          <Block
            class='svg-container'
            onMouseMove={[actions.dragStart, decodeRaw(actions.onDrag)]}
            onMouseDown={[actions.mouseDown, decodeRaw(actions.handleClick)]}
            onMouseUp={actions.dragEnd}
            innerHTML={svg} />
        </Block>
        {!(running && speed > 8) &&
          animals.map((animal, i) => (
            <Animal
              key={i}
              {...props}
              offset={w / (size * numRows)}
              isRead={type === 'read'}
              cellSize={size}
              animal={animal}
              id={i} />
          ))}
        {state.mouseDown && <Window onMouseUp={actions.dragEnd} />}
      </Block>
    )
  },
  middleware: [middleware],
  * onUpdate (prev, { props, context, state, actions, children }) {
    const { painted, palette, numRows, id, w, h, hideGrid } = props
    const size = Math.floor(w / numRows)
    const gridSize = size * numRows
    const offset = w / gridSize

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
        ctx: new C2S(w, h, {
          defs: getDefs(id, size),
          viewBox: `-0.5 -0.5 ${gridSize + 1} ${gridSize + 1}`
        }),
        cellSize: size,
        gridSize,
        numRows,
        hideGrid,
        palette,
        painted,
        offset,
        name: id
      }
    }
  },
  controller: {
    * handleClick ({ props, state }, e) {
      const { canvasState } = state
      const target = state.canvasState.handleMouseDown.call(canvasState, e)
      if (props.onClick) {
        yield props.onClick(target, canvasState)
      }
    },

    * onDrag ({ props, state, actions }, e) {
      if (state.dragging && props.onDrag) {
        yield actions.handleClick(e)
      }
    },

    * setCanvasContext ({ props }, ctx) {
      if (props.setCanvasContext) {
        yield props.setCanvasContext(ctx, props.id)
      }
    }
  },
  reducer: {
    setNode: (state, node) => ({ node }),
    setCanvas: (state, canvasState) => ({ canvasState }),
    dragStart: ({ mouseDown, dragging }) => {
      if (mouseDown && !dragging) {
        return { dragging: true }
      }
    },
    dragEnd: () => ({ dragging: false, mouseDown: false }),
    mouseDown: () => ({ mouseDown: true }),
    setSvg: (state, svg) => ({ svg })
  }
})

function getDefs (name, size) {
  const patternAttrs = {
    id: `${name}-img1`,
    patternUnits: 'userSpaceOnUse',
    width: size,
    height: size
  }
  const imageAttrs = {
    'xlink:href': '/images/togglePixel.png',
    x: '0',
    y: '0',
    width: size,
    height: size
  }

  const defs = document.createElement('defs')
  const pattern = document.createElement('pattern')
  const image = document.createElement('image')
  applyAttrs(pattern, patternAttrs)
  applyAttrs(image, imageAttrs)
  pattern.appendChild(image)
  defs.appendChild(pattern)
  return defs
}

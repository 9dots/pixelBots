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
import {Button} from 'vdux-containers'
import {Block, Icon} from 'vdux-ui'
import C2S from 'pb-canvas2svg'
import range from '@f/range'
import sleep from '@f/sleep'
import find from '@f/find'

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
  * afterRender ({state, actions}, node) {
    if (!state.node) {
      yield actions.setNode(node)
    }
  },
  render ({props, state, actions}) {
    const {id, h, w, numRows, animals = [], opacity, type, turn} = props
    const {svg} = state
    const size = Math.floor(w / numRows)
    const gridSize = Math.floor(w / numRows) * numRows + 1
    const offset = w / gridSize

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
        {
          animals.map((animal, i) => (
            <Animal
              {...props}
              offset={w / (size * numRows)}
              isRead={type === 'read'}
              cellSize={size}
              animal={animal}
              id={i}>
              {
               // type === 'read' && animal.type !== 'teacherBot' &&
               //  <Block> 
               //    <TurnButton onClick={turn(animal.current.rot - 90)} size={size} icon='rotate_left' />
               //    <TurnButton onClick={turn(animal.current.rot + 90)} size={size} icon='rotate_right' right />
               //  </Block>
              } 
            </Animal>
          ))
        }
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
    const {painted, palette, numColumns, numRows, id, animals, w, h, onClick = () => {}} = props
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
        ctx: new C2S(w, h, {defs: getDefs(id, size), viewBox: `-0.5 -0.5 ${gridSize + 1} ${gridSize + 1}`}),
        cellSize: size,
        gridSize,
        numRows,
        palette,
        painted,
        offset,
        name: id
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
        yield props.setCanvasContext(ctx, props.id)
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

const TurnButton = component({
  render({props}) {
    const {icon, size, ...rest} = props

    return (
      <Button 
        hoverProps={{opacity: 1}}
        align='center center' 
        pointerEvents='all' 
        borderRadius={2}
        sq={size / 3.6}
        bgColor='blue' 
        color='white' 
        opacity={.7}
        absolute 
        fs='xs' 
        p={0} 
        top
        {...rest}>
          <Icon name={icon} fs={size / 4 } />
      </Button>

    )
  }
})


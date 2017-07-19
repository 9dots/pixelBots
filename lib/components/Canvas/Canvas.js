/**
* Imports
*/
const gPalette = require('google-material-color-palette-json')
import {component, element} from 'vdux'
const forEach = require('@f/foreach')
const reduce = require('@f/reduce')
import {Block} from 'vdux-ui'
import range from '@f/range'
const _ = require('lodash')
import find from '@f/find'
import mapValues from '@f/map-values'
import firebase from 'firebase'
import diffKeys from '@f/diff-keys'

const palette = _.drop(reduce(
 (arr, value, key) => [...arr, {
   name: key,
   value: value['shade_500'] || value
 }],
 [],
 gPalette
))

const pal = palette.reduce((obj, {name, value}) => {
  obj[name] = value
  return obj
}, {})

const baseColors = _.merge(pal, {
  red: '#f52',
  black: '#111',
  white: '#fff',
  grey: '#ddd',
  grey_medium: '#888',
  offblack: '#333'
})

/**
* <Canvas/>
*/

function createEmptySquares (width, height) {
  return range(width * height).reduce((obj, val, i) => {
    const coords = [Math.floor(val / width), val % width]
    return {
      ...obj,
      [coords]: 'white'
    }
  }, {})
}

export default component({
  initialState: {
    node: false
  },
  * afterRender ({state, actions}, node) {
    if (!state.node) {
      yield actions.setNode(node)
    }
  },
  render ({props, state}) {
    const {id, h, w} = props
    return (
      <Block w='350px' h='350px' absolute>
        <Block w='350px' transform='scale(1)' transformOrigin='0 0' imageRendering='pixelated'>
          <canvas class='large' height={h} width={w} id={id} />
          {/* <img height='1px' width='1px' hidden src='/animalImages/chameleontop.png' id='test' /> */}
        </Block>
      </Block>
    )
  },
  * onUpdate (prev, {props, context, state, actions, children}) {
    const {painted, numColumns, numRows} = props
    const size = 350 / numRows
    if (!prev.state.node && state.node) {
      console.log('update start')
      const canvas = document.getElementById(props.id)
      const newCanvasState = new CanvasState(canvas.getContext('2d'), 350)
      canvas.addEventListener('mousedown', newCanvasState.handleMouseDown)
      forEach((val, key) => {
        const [x, y] = key.split(',')
        newCanvasState.addShape(new Rect(x * size, y * size, 350 / numRows, 350 / numRows, val))
      }, {...createEmptySquares(numColumns, numRows), ...painted})
      newCanvasState.draw()
      yield actions.setCanvas(newCanvasState)
    }
    if (prev.props.painted !== props.painted) {
      // const newKeys = diffKeys(prev.props.painted, props.painted)
      // newKeys.forEach(key => {
      //   const [x, y] = key.split(',').map(val => Number(val))
      //   const place = x + numRows * y
      //   state.canvasState.setShapeColor(place, props.painted[key] || 'white')
      //   state.canvasState.drawShape(place)
      // })
      // state.canvasState.draw()
    }
  },
  reducer: {
    setNode: (state, node) => ({node}),
    setCanvas: (state, canvasState) => ({canvasState})
  }
})

class Rect {
  constructor (x = 0, y = 0, w = 1, h = 1, fill = 'white') {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.coordinates = [this.x / this.w, this.y / this.h]
    this.fill = fill
  }
  draw (ctx) {
    ctx.beginPath()
    ctx.fillStyle = baseColors[this.fill]
    ctx.lineWidth = '0.5'
    ctx.rect(this.x, this.y, this.w, this.h)
    ctx.strokeRect(this.x, this.y, this.w, this.h)
    ctx.fill()
  }
  setColor (fill) {
    this.fill = fill
  }
  contains (x, y) {
    const withinX = x >= this.x && x <= this.x + this.w
    const withinY = y >= this.y && y <= this.y + this.h
    if (withinX && withinY) return true
    return false
  }
}

class CanvasState {
  constructor (ctx, size) {
    this.valid = false
    this.shapes = []
    this.dragoffx = 0
    this.dragoffy = 0
    this.ctx = ctx
    this.size = size
  }
  draw () {
    this.shapes.forEach(shape => {
      const [x, y] = shape.coordinates
      if (this.contains(x, y)) {
        shape.draw(this.ctx)
      }
    })
  }
  clear () {
    this.shapes = []
  }
  contains (x, y) {
    const withinX = x >= 0 && x <= this.size
    const withinY = y >= 0 && y <= this.size
    if (withinX && withinY) return true
    return false
  }
  addShape (shape) {
    this.shapes.push(shape)
  }
  setShapeColor (location, color) {
    this.shapes[location].setColor(color)
  }
  drawShape (place) {
    this.shapes[place].draw(this.ctx)
  }
  handleMouseDown (e) {
    console.log(e)
    const {offsetX, offsetY} = e
    const target = find(this.shapes, (shape) => shape.contains(offsetX, offsetY))
    console.log(target.coordinates)
  }
}

// function handleChunk (responseArray, w, h) {
//   var canvasArray = new Uint8Array(w * h)
//   // Each byte in the responseArray represents two values in the canvas
//   for (var i = 0; i < responseArray.byteLength; i++) {
//     canvasArray[2 * i] = responseArray[i] >> 4
//     canvasArray[2 * i + 1] = responseArray[i] & 15
//   }
//   return canvasArray
// }

// range(numRows).forEach((val, row) => {
//   range(numRows).forEach((c, column) => {
//     canvasState.addShape(
//       new Rect(row * size, column * size, size, size)
//     )
//   })
// })
// forEach((color, key) => {
//   const coords = key.split(',').map((coord) => parseInt(coord))
//   canvasState.addShape(
//     new Rect((coords[1] * size), (coords[0] * size), size, size, color)
//   )
// }, painted)

// var colorArray = range(16).map(val => {
//   return '0x' + range(4).map(() => Math.floor(Math.random() * 256).toString(16).toUpperCase()).join('')
// })

// const animalLocation = [0, 2]
//
// const gameSize = 100
// var buffer = new ArrayBuffer(gameSize * gameSize * 4)
// var readBuffer = new Uint8ClampedArray(buffer)
// var writeBuffer = new Uint32Array(buffer)
//
// function setBufferState (color, i) {
//   writeBuffer[i] = colorArray[parseInt(color, 16)]
// }

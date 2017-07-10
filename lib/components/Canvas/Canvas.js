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

var colorArray = range(16).map(val => {
  return '0x' + range(4).map(() => Math.floor(Math.random() * 256).toString(16).toUpperCase()).join('')
})

console.log(colorArray)

const animalLocation = [0, 2]

const gameSize = 100
var buffer = new ArrayBuffer(gameSize * gameSize * 4)
var readBuffer = new Uint8ClampedArray(buffer)
var writeBuffer = new Uint32Array(buffer)

function setBufferState (color, i) {
  writeBuffer[i] = colorArray[parseInt(color, 16)]
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
      <Block w='500px' h='500px' absolute>
        <Block w='500px' transform='scale(1)' transformOrigin='0 0' imageRendering='pixelated'>
          <canvas class='large' height={h} width={w} id={id} />
          <img height='1px' width='1px' hidden src='/animalImages/chameleontop.png' id='test' />
        </Block>
      </Block>
    )
  },
  * onUpdate (prev, {props, context, state, actions, children}) {
    if (!prev.state.node && state.node) {
      const canvas = document.getElementById(props.id)
      canvas.addEventListener('mousemove', e => {
        const {offsetX, offsetY} = e
        const x = Math.floor(offsetX / 5)
        const y = Math.floor(offsetY / 5)
        const location = y * 100 + x
        writeBuffer[location] = colorArray[1]
        // console.log(location, colorArray[1])
        let imageData = new ImageData(readBuffer, props.w, props.h)
        canvas.getContext('2d').putImageData(imageData, 0, 0)
      })
      const ctx = canvas.getContext('2d')
      const {value} = yield context.fetch('http://localhost:3000')
      const canvasArray = handleChunk(new Uint8Array(value), props.w, props.h)
      canvasArray.forEach(setBufferState)
      // mapValues(setBufferState, value)
      // value.forEach(setBufferState)
      var imageData = new ImageData(readBuffer, props.w, props.h)
      ctx.putImageData(imageData, 0, 0)
      // ctx.drawImage(document.getElementById('test'), animalLocation[0], animalLocation[1], 10, 10)
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
  contains (x, y) {
    const withinX = x >= 0 && x <= this.size
    const withinY = y >= 0 && y <= this.size
    if (withinX && withinY) return true
    return false
  }
  addShape (shape) {
    this.shapes.push(shape)
  }
  handleMouseDown (e) {
    const {offsetX, offsetY} = e
    const target = find(this.shapes, (shape) => shape.contains(offsetX, offsetY))
    console.log(target.coordinates)
  }
}

function handleChunk (responseArray, w, h) {
  var canvasArray = new Uint8Array(w * h)
  // Each byte in the responseArray represents two values in the canvas
  for (var i = 0; i < responseArray.byteLength; i++) {
    canvasArray[2 * i] = responseArray[i] >> 4
    canvasArray[2 * i + 1] = responseArray[i] & 15
  }
  return canvasArray
}

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

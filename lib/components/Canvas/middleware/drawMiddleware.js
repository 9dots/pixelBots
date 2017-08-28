import createAction from '@f/create-action'
import forEach from '@f/foreach'
import reduce from '@f/reduce'
import range from '@f/range'
import _ from 'lodash'


function getBaseColors (pal) {
  if (!Array.isArray(pal)) return pal
  return pal.reduce((obj, {name, value}) => {
    obj[name] = value
    return obj
  }, {})
}


const selectAttributes = {
	stroke: 'red',
	'stroke-width': 2
}

const baseAttributes = {
	stroke: '#CACACA',
	'stroke-width': 1
}

const initCanvas = createAction('<Canvas/>: INIT_CANVAS')
const updateCanvas = createAction('<Canvas/>: UPDATE_CANVAS')

function middleware ({dispatch, actions, getState}) {
	return next => action => {
		if (action.type === initCanvas.type) {
			const {numRows, cellSize, painted, palette} = action.payload
			const newCanvasState = new CanvasState(action.payload)
      dispatch(actions.setCanvas(newCanvasState))
      dispatch(actions.setCanvasContext(newCanvasState, action.payload.name))
      forEach((val, key) => {
        const [y, x] = key.split(',').map(n => Number(n))
        newCanvasState.addShape(new Rect(x * cellSize, y * cellSize, cellSize, cellSize, [x, y], newCanvasState.ctx, val))
      }, {...createEmptySquares(numRows, numRows), ...painted})
      const svg = newCanvasState.draw().getSvg()
      dispatch(actions.setSvg(svg))
		}
		if (action.type === updateCanvas.type) {
			const {numRows, cellSize, painted, palette} = action.payload
			const {canvasState} = getState()
			canvasState.updateOpts(action.payload)
			forEach((val, key) => {
        const [y, x] = key.split(',').map(n => Number(n))
        canvasState.addShape(new Rect(x * cellSize, y * cellSize, cellSize, cellSize, [x, y], canvasState.ctx, val))
      }, {...createEmptySquares(numRows, numRows), ...painted})
      dispatch(actions.setSvg(canvasState.draw().getSvg()))
		}
		return next(action)
	}
}

export default middleware
export {
	initCanvas,
	updateCanvas
}

function createEmptySquares (width, height) {
  return range(width * height).reduce((obj, val, i) => {
    const coords = [Math.floor(val / width), val % width]
    return {
      ...obj,
      [coords]: 'white'
    }
  }, {})
}

class Rect {
  constructor (x = 0, y = 0, w = 1, h = 1, coords, ctx, fill = 'white') {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.coordinates = coords
    this.ctx = ctx
    this.fill = fill
  }
  draw (ctx = this.ctx, rows, name, palette) {
    ctx.beginPath({
    	id: `${name}-rect-${this.coordinates[1] * rows + this.coordinates[0]}`,
    	'vector-effect': 'non-scaling-stroke',
    })
    ctx.rect(this.x, this.y, this.w, this.h) 
    ctx.fillStyle = this.fill === 'toggle'
      ? `url(#${name}-img1)`
      : palette[this.fill || 'white'] || 'white'
    ctx.fill()
    ctx.lineWidth = 1
    ctx.strokeStyle = '#CACACA'
    ctx.stroke()
  }
  updateColor (color, name, location, palette) {
    const fillColor = color === 'toggle'
      ? `url(#${name}-img1)`
      : palette[color]
    document.getElementById(`${name}-rect-${location}`).setAttribute('fill', fillColor)
  }
  addOutline (element) {
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.strokeRect(this.x, this.y, this.w, this.h)
  }
  contains (x, y) {
    const withinX = x >= this.x && x <= this.x + this.w
    const withinY = y >= this.y && y <= this.y + this.h
    if (withinX && withinY) return true
    return false
  }
}

class CanvasState {
  constructor (opts) {
    this.shapes = []
    this.selected = null
    this.colorPalette = getBaseColors(opts.palette)

    forEach((val, key) => this[key] = val, opts)
    this.ctx.imageSmoothingEnabled = false
  }
  updateOpts (opts) {
    this.clear()
    this.colorPalette = getBaseColors(opts.palette)
    forEach((val, key) => this[key] = val, opts)
  }
  draw (shapes = this.shapes) {
    shapes.forEach(shape => {
      const [x, y] = shape.coordinates
      if (this.contains(x, y)) {
        shape.draw(this.ctx, this.numRows, this.name, this.colorPalette)
      }
    })
    return this
  }
  clear () {
    const size = 350
    this.shapes = []
    this.ctx.clearRect(0, 0, size, size)
  }
  getSvg () {
    return this.ctx.getSerializedSvg()
  }
  contains (x, y) {
    const withinX = x >= 0 && x <= this.gridSize
    const withinY = y >= 0 && y <= this.gridSize
    if (withinX && withinY) return true
    return false
  }
  select (location, color) {
  	this.clearSelection()
    this.selected = location
    const [x, y] = location
    const element = document.getElementById(`${this.name}-rect-${y * this.numRows + x}`)
    forEach((val, key) => element.setAttribute(key, val), selectAttributes)
  	element.parentElement.appendChild(element) 
  }
  clearSelection () {
  	if (this.selected) {
      const [prevX, prevY] = this.selected || []
    	const element = document.getElementById(`${this.name}-rect-${prevY * this.numRows + prevX}`)
    	forEach((val, key) => element.setAttribute(key, val), baseAttributes)
    }
  }
  addShape (shape) {
    this.shapes.push(shape)
  }
  updateShapeColor (location, color) {
    this.shapes[location].updateColor(color, this.name, location, this.colorPalette)
  }
  drawShape (place) {
    this.shapes[place].draw(this.ctx)
  }
  handleMouseDown (e) {
    const {offsetX, offsetY} = e
    const x = Math.floor(offsetX / (this.cellSize * this.offset))
    const y = Math.floor(offsetY / (this.cellSize * this.offset))
    return [clamp(y, 0, this.numRows - 1), clamp(x, 0, this.numRows - 1)]
  }
  getShapeByCoordinates (coordinates) {
    const [x, y] = coordinates
    if (this.contains(x, y)) {
      return this.shapes[y * this.numRows + x]
    }
    return null
  }
}

function clamp (val, min, max) {
	return Math.min(Math.max(min, val), max)
}
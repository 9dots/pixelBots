const gPalette = require('google-material-color-palette-json')
const gm = require('gm').subClass({imageMagick: true})
const forEach = require('@f/foreach')
const reduce = require('@f/reduce')
const Promise = require('bluebird')
const Canvas = require('canvas-prebuilt')
const _ = require('lodash')
const fs = require('fs')

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

function getBaseColors (pal) {
  if (!Array.isArray(pal)) return pal
  return pal.reduce((obj, {name, value}) => {
    obj[name] = value
    return obj
  }, {})
}

function shrinkImage (path, size) {
  return new Promise((resolve, reject) => {
    gm(path)
      .thumb(size, size, path, 100, (err) => {
        if (err) { return reject(err) }
        return resolve(path)
      })
  })
}

function shrinkImages (imgs) {
  return new Promise((resolve, reject) => {
    if (typeof (imgs) === 'string') {
      shrinkImage(imgs, 150)
        .then(() => resolve())
        .catch((e) => reject(e))
    } else {
      const shrinkPromises = imgs.map((img) => shrinkImage(img, 150 / 2))
      Promise.all(shrinkPromises)
        .then((res) => { console.log('done shrinking'); return resolve(res) })
        .catch((e) => reject(e))
    }
  })
}

function append (imgs, file, ltr = false) {
  return new Promise((resolve, reject) => {
    gm(0, 0)
      .append(imgs, ltr)
      .write(file, (err) => {
        if (err) return reject(err)
        return resolve(file)
      })
  })
}

function playlistImage (name, imgs) {
  return new Promise((resolve, reject) => {
    const path = `/tmp/${name}`
    if (imgs.length < 4) {
      return resolve(imgs[0])
    }
    const column1 = append(imgs.filter((img, i) => i % 2 === 0), path + '/column1.png')
    const column2 = append(imgs.filter((img, i) => i % 2 === 1), path + '/column2.png')
    Promise.all([column1, column2])
      .then((res) => {
        const file = `${path}/${name}.png`
        append(res, file, true)
          .then(() => resolve(file))
          .catch((e) => reject(e))
      })
      .catch((e) => reject(e))
  })
}

function drawFrame (size, targetPainted, writePath, file, canvas, palette = baseColors) {
  const thisPalette = getBaseColors(palette)
  return new Promise((resolve, reject) => {
    forEach((color, key) => {
      const coords = key.split(',').map((coord) => parseInt(coord))
      file.beginPath()
      file.rect(
        (coords[1] * size),
        (coords[0] * size),
        size,
        size
      )
      file.fillStyle = thisPalette[color] || 'white'
      file.fill()
    }, targetPainted)
    const writeStream = fs.createWriteStream(writePath)
    canvas
      .pngStream()
      .on('data', (data) => writeStream.write(data))
      .on('end', () => resolve(writePath))
  })
}

function levelThumb (name, gridSize, targetPainted, dir = '', palette) {
  const size = Math.floor(300 / gridSize)
  const imageSize = Number(size * gridSize)
  let canvas = new Canvas(imageSize, imageSize)
  const ctx = canvas.getContext('2d')
  ctx.rect(0, 0, imageSize, imageSize)
  ctx.fillStyle = 'white'
  ctx.fill()
  const writePath = `/tmp${dir ? `/${dir}` : ''}/${name}.png`

  return drawFrame(size, targetPainted, writePath, ctx, canvas, palette)
}

function gifFrame (name, size, imageSize, targetPainted, dir = '', palette) {
  let canvas = new Canvas(imageSize, imageSize)
  const ctx = canvas.getContext('2d')
  ctx.rect(0, 0, imageSize, imageSize)
  ctx.fillStyle = 'white'
  ctx.fill()
  const writePath = `/tmp${dir ? `/${dir}` : ''}/${name}.png`

  return drawFrame(size, targetPainted, writePath, ctx, canvas, palette)
}

exports.shrinkImages = shrinkImages
exports.playlistImage = playlistImage
exports.levelThumb = levelThumb
exports.gifFrame = gifFrame

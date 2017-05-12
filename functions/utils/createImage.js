const gPalette = require('google-material-color-palette-json')
const gm = require('gm').subClass({imageMagick: true})
const forEach = require('@f/foreach')
const reduce = require('@f/reduce')
const Promise = require('bluebird')
const _ = require('lodash')

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
    console.log('playlist image', imgs)
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

function drawFrame (size, targetPainted, writePath, file) {
  return new Promise((resolve, reject) => {
    console.log('target painted', targetPainted, 'size', size)
    forEach((color, key) => {
      const coords = key.split(',').map((coord) => parseInt(coord))
      file.fill(baseColors[color])
      file.drawRectangle(
        (coords[1] * size) + coords[1],
        (coords[0] * size) + coords[0],
        (coords[1] + 1) * size + coords[1],
        (coords[0] + 1) * size + coords[0]
      )
    }, targetPainted)
    console.log('write path', writePath, file)
    file.write(writePath, function (err) {
      if (err) {
        console.warn(err)
        return reject(err)
      }
      return resolve(writePath)
    })
  })
}

function levelThumb (name, gridSize, targetPainted, dir = '') {
  const size = Math.floor(300 / gridSize)
  const imageSize = Number(size * gridSize) + Number(gridSize) - 1
  let file = gm(imageSize, imageSize, '#ffffff').limit('memory', '1448MB')
  const writePath = `/tmp${dir ? `/${dir}` : ''}/${name}.png`

  return drawFrame(size, targetPainted, writePath, file)
}

function gifFrame (name, size, imageSize, targetPainted, dir = '') {
  let file = gm(imageSize, imageSize, 'none').limit('memory', '1448MB')
  const writePath = `/tmp${dir ? `/${dir}` : ''}/${name}.miff`

  return drawFrame(size, targetPainted, writePath, file)
}

exports.shrinkImages = shrinkImages
exports.playlistImage = playlistImage
exports.levelThumb = levelThumb
exports.gifFrame = gifFrame

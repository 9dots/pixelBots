import hexToRgb from 'hex-to-rgb'

function colorArrayToObj (arr) {
  return arr.reduce((acc, next, i) => {
    if (i === 0) return ({...acc, r: next})
    if (i === 1) return ({...acc, g: next})
    return ({...acc, b: next})
  }, {})
}

export default function(color1, color2) {
  const c1 = colorArrayToObj(hexToRgb(color1))
  const c2 = colorArrayToObj(hexToRgb(color2))
  return Math.sqrt(Math.pow(c1.r - c2.r,2) + Math.pow(c1.g - c2.g,2) + Math.pow(c1.b - c2.b,2))
}

function getRotation (rot) {
  const circles = Math.floor(Math.abs(rot) / 360)
  if (rot < 0) {
    return rot + (360 * (circles + 1))
  } else {
    return rot - (360 * circles)
  }
}

export default rot => (getRotation(rot) / 90) % 4

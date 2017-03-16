export default (val, arr = []) => {
  if (arr.indexOf(val) > -1) {
    return arr.filter((item) => item !== val)
  } else {
    return arr.concat(val)
  }
}

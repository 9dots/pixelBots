export default function (fn, obj = {}) {
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    if (fn(obj[keys[i]], i, obj)) {
      return keys[i]
    }
  }
  return -1
}

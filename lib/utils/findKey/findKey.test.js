import findKey from '.'
import test from 'tape'

test('it should find the key', t => {
  const obj = {
    a: 1,
    b: 2,
    c: 3
  }
  const res = findKey((val, i) => val === 1, obj)
  t.equal(res, 'a')
  t.end()
})

test('it should return -1 if there is no match', t => {
  const obj = {
    a: 1,
    b: 2,
    c: 3
  }
  const res = findKey((val, i) => val === 4, obj)
  t.equal(res, -1)
  t.end()
})

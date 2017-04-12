const test = require('blue-tape')
const sinon = require('sinon')

functions = require('firebase-functions');
configStub = sinon.stub(functions, 'config').returns({
  firebase: {
    databaseURL: 'https://not-a-project.firebaseio.com',
    storageBucket: 'not-a-project.appspot.com',
  }
})
const createIterator = require('../lib/autoYield')

test('createIterator', (t) => {
  const req = { body: {code: `right()\nright(`, id: 0, api: {right: 'stuff'}} }
  const send = (code) => console.log(code)
  const res = { status: (code) => ({ send }), send }

  createIterator(req, res)
  t.end()
})
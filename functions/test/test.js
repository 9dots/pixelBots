const myFunctions = require('../index')
const test = require('blue-tape')
const sinon = require('sinon')

admin =  require('firebase-admin');
adminInitStub = sinon.stub(admin, 'initializeApp')
functions = require('firebase-functions');
configStub = sinon.stub(functions, 'config').returns({
  firebase: {
    databaseURL: 'https://not-a-project.firebaseio.com',
    storageBucket: 'not-a-project.appspot.com',
  }
})

test('toggle showcase', (t) => {
  // [START fakeEvent]
  const fakeEvent = {
    data: new functions.database.DeltaSnapshot(null, null, null, 'input'),
  };
  // [END fakeEvent]

  // [START stubDataRef]
  const 
  const childParam = 'uppercase';
  const setParam = 'INPUT';
  // Stubs are objects that fake and/or record function calls.
  // These are excellent for verifying that functions have been called and to validate the
  // parameters passed to those functions.
  const onceStub = sinon.stub()
  const refStub = sinon.stub()
  const childStub = sinon.stub()
  const setStub = sinon.stub()
  // The following 4 lines override the behavior of event.data.ref.parent.child('uppercase')
  // .set('INPUT') to return true
  Object.defineProperty(fakeEvent.data, 'ref', { get: refStub })
  refStub.returns({ parent: { once: onceStub }, })
  onceStub.returns()
  setStub.withArgs(setParam).returns(true)
  // [END stubDataRef]

  // [START verifyDataWrite]
  // All non-HTTPS cloud functions return a promise that resolves with the return value of your
  // code. In this case, we've stubbed it to return true if
  // event.data.ref.parent.child(childParam).set(setParam) was called with the parameters we
  // expect. We assert that makeUppercase returns a promise that eventually resolves with true.
  return assert.eventually.equal(myFunctions.makeUppercase(fakeEvent), true);
  // [END verifyDataWrite]
})
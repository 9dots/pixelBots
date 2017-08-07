'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var firebase = require('firebase-admin');
var Hashids = require('hashids');

var hashids = new Hashids('Oranges --neverripen in the=winter_because this is the way that it i5', 5, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789');

var generateRands = function generateRands() {
  return [0, 1, 2, 3, 4].map(function () {
    return Math.round(Math.random() * 100000);
  });
};

function generateID() {
  return hashids.encode(generateRands()).substr(0, 5);
}

function checkForExisting(ref, id) {
  return new _promise2.default(function (resolve, reject) {
    firebase.database().ref(ref).orderByKey().equalTo(id).once('value').then(function (snap) {
      return resolve(snap.val());
    }).catch(reject);
  });
}

function createCode() {
  var ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/links';

  return new _promise2.default(function (resolve, reject) {
    var id = generateID();
    checkForExisting(ref, id).then(function (val) {
      return val ? resolve(createCode(ref)) : resolve(id);
    }).catch(reject);
  });
}

module.exports = createCode;

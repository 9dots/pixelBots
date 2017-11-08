const config = require('./lib/client/firebaseConfig')
const firebase = require('firebase')
const fs = require('fs-extra')
const path = require('path')

firebase.initializeApp(config)
const versionRef = firebase.database().ref('/versionNumber')

fs
  .readFile(path.resolve(__dirname, 'public', 'index.html'), 'utf8')
  .then(html => html.match(/(?:[a-z1-9]*)(?=\.app)/))
  .then(match => (match ? versionRef.set(match[0]) : Promise.resolve()))
  .then(() => firebase.app().delete())
  .then(() => console.log('done'))

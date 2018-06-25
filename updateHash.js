const config = require('./lib/client/firebaseConfig')
const firebase = require('firebase')
const fs = require('fs-extra')
const path = require('path')

const ref = process.env.VERSION === 'V1' ? '/v1Version' : '/versionNumber'
firebase.initializeApp(config)
const versionRef = firebase.database().ref(ref)

fs
  .readFile(path.resolve(__dirname, 'public', 'index.html'), 'utf8')
  .then(html => html.match(/(?:[a-zA-Z0-9]*)(?=\.app)/))
  .then(match => (match ? versionRef.set(match[0]) : Promise.resolve()))
  .then(() => firebase.app().delete())
  .then(() => console.log('done'))

const autoYield = require('auto-yield-delegate')
const functions = require('firebase-functions')
const fs = require('node-fs-extra')
const cors = require('cors')()
const _eval = require('eval')

module.exports = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		const {code, api} = req.body
  	res.set({'Cache-Control': 'no-cache'})
		let wrappedCode
	  try {
	    wrappedCode = autoYield(code, api)
	  } catch (e) {
	  	res.status(200).send(Object.assign({}, e, {name: e.name}))
	  }
	  res.status(200).send(wrappedCode)
	})
})
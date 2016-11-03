var fs = require('fs')

const setups = {
	production: {
		apiKey: 'AIzaSyAj07kPi_C4eGAZBkV7ElSLEa_yg3sHoDc',
		authDomain: 'artbot-26016.firebaseapp.com',
		databaseURL: 'https://artbot-26016.firebaseio.com',
		storageBucket: 'artbot-26016.appspot.com',
		messagingSenderId: '493804710533'
	},
	dev: {
		apiKey: 'AIzaSyAQ7YJxZruXp5RhMetYq1idFJ8-y0svN-s',
		authDomain: 'artbot-dev.firebaseapp.com',
		databaseURL: 'https://artbot-dev.firebaseio.com',
		storageBucket: 'artbot-dev.appspot.com',
		messagingSenderId: '1001646388415'
	}
}

fs.writeFileSync('src/firebaseConfig.js', 'module.exports = ' + JSON.stringify(setups[process.env.NODE_ENV]))

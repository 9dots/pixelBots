// webpack --config webpack.config.test.js

var TapWebpackPlugin = require('tap-webpack-plugin')
var path = require('path')
var glob = require('glob')
var fs = require('fs')

const folders = fs.readdirSync(path.resolve(__dirname, 'lib'))
  .reduce((cur, next) => (
    Object.assign(
      {},
      cur,
      {[next]: path.resolve(__dirname, `lib/${next}/`)}
    )
  ), {})

module.exports = {
	target: 'node',
	entry: {
		// test: glob.sync('./lib/utils/**/*.test.js')
		test: './lib/utils/frameReducer/frameReducer.test.js'
	},
	resolve: {
		alias: folders
	},
	module: {
		loaders: [
			{
				test: /.js$/,
				exclude: /\/node_modules\//,
				loader: 'babel-loader'
			}
		]
	},
	output: {
		filename: 'test.js'
	},
	plugins: [
		new TapWebpackPlugin({reporter: 'tap-spec'})
	]
}
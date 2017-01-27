var webpack = require('webpack')
var path = require('path')
var nodeExternals = require('webpack-node-externals')

module.exports = {
	entry: {
		app: './src/index.js'
	},
	output: {
		filename: 'bundle.js',
		path: __dirname + '/public'
	},
	resolve: {
    extensions:[".js",".jsx",".json"]
  },
	module: {
    loaders: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  target: 'web',
  externals: [nodeExternals()]
}
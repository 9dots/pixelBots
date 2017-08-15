var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var segmentKey = require('./segmentKey')
var webpack = require('webpack')
var marked = require('marked')
var path = require('path')
var net = require('net')
var fs = require('fs')

const renderer = new marked.Renderer()


console.log('prod config')

const folders = fs.readdirSync(path.resolve(__dirname, 'lib'))
  .reduce((cur, next) => (
    Object.assign(
      {},
      cur,
      {[next]: path.resolve(__dirname, `lib/${next}/`)}
    )
  ), {})

function config (env) {
  return {
    entry: {
      main: [
        './lib/client/index.js'
      ],
      vendor: [
        'lodash',
        'brace',
        'firebase',
        'auto-yield-delegate',
        'js-analyse'
      ]
    },
    output: {
      filename: '[hash].[name].js',
      path: path.resolve(__dirname, 'public'),
      publicPath: '/'
    },
    resolve: {
      alias: folders,
      modules: [path.resolve(__dirname, 'lib'), 'node_modules']
    },
    module: {
      loaders: [
        {
          test: /\.worker.js$/,
          loaders: ['worker-loader', 'babel-loader']
        },
        {
          test: /.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
        },
        {
          test: /\.md$/,
          loaders: [
            "html-loader",
            "markdown-loader"
          ],
        }
      ]
    },
    target: 'web',
    plugins: [
      new webpack.NamedModulesPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest'] // Specify the common bundle's name.
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': '"production"',
          'TRACKING_CODE': segmentKey
        }
      }),
      new HtmlWebpackPlugin({
        title: 'pixelBots',
        template: 'my-index.html' // Load a custom template (ejs by default see the FAQ for details)
      })
    ],
    node: {
      module: 'empty',
      console: 'mock'
    },
    externals: {
      net: net,
      fs: fs
    }
  }
}

module.exports = config

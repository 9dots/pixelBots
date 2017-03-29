/**
 * Imports
 */

import 'regenerator-runtime/runtime'
import vdux from 'vdux/dom'
import {element} from 'vdux'
let Boot = require('components/Boot').default

/**
 * Hot module replacement
 */

const {forceRerender} = vdux(() => <Boot />)

if (module.hot) {
  module.hot.accept(['components/Boot'], () => {
  	console.log('reload')
    Boot = require('components/Boot').default
    forceRerender()
  })
}

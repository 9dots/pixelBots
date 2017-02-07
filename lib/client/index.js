/**
 * Imports
 */

import 'regenerator-runtime/runtime'
import vdux from 'vdux/dom'
import {element} from 'vdux'
import Boot from 'components/Boot'

/**
 * Hot module replacement
 */

const {forceRerender} = vdux(() => <Boot />)

if (module.hot) {
  module.hot.accept(['components/Boot'], () => {
    require('components/Boot').default
    forceRerender()
  })
}

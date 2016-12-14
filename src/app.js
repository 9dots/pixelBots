/** @jsx element */

import element from 'vdux/element'
import Router from './router'
import omit from '@f/omit'

function render (props) {
  return (
    <Router {...omit('ui', props)}/>
  )
}

export default render

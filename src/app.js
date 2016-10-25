/** @jsx element */

import element from 'vdux/element'
import Router from './router'
import omit from '@f/omit'



function render (props) {
	const newProps = omit('ui', props)
  return (
    <Router {...newProps}/>
  )
}

export default render

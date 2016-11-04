import LineNumber from './LineNumber'
import element from 'vdux/element'
import {Block, Icon} from 'vdux-ui'
import {Input} from 'vdux-containers'
import {removeLine} from '../actions'


function render ({props}) {
	const {
		shouldTransition,
		newElement,
		numLines,
		lineNum,
		animal
	} = props

  const shouldFlash = !shouldTransition && newElement

	return (
    <Block relative wide>
      <Block
        relative
        {...props}
        class={[shouldFlash && 'flash']}
        fs='18px'
        align='center center'>
      </Block>
    </Block>
	)
}

export default {
	render
}

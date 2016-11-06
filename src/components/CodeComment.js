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
        <Block color='white'>//</Block>
        <Input
        		m='0'
        		h='90%'
        		onClick={(e) => e.stopPropagation()}
        		inputProps={{bgColor: 'transparent', h: '100%', borderWidth: '0px', color: 'white'}}/>
      </Block>
      <Block align='center center' absolute right='0' top='5px'>
        <Icon
          color='#666'
          name='delete'
          onClick={[(e) => e.stopPropagation(), () => removeLine(animal, lineNum)]}/>
      </Block>
    </Block>
	)
}

export default {
	render
}

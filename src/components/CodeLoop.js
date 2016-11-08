import LineNumber from './LineNumber'
import element from 'vdux/element'
import {Block, Icon} from 'vdux-ui'
import {Input} from 'vdux-containers'
import {removeLine, updateLine} from '../actions'


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
        tall
        {...props}
        class={[shouldFlash && 'flash']}
        fs='18px'
        align='center center'>
        <Icon name='loop' color='white'/>
        <Input
        		autofocus
        		absolute
        		right='0'
		        mb='0'
		        fs='12px'
		        maxWidth='300px'
		        h='20px'
		        color='#333'
		        p='10px'
		        inputProps={{textAlign: 'center', w: '60px'}}
		        onClick={(e) => e.stopPropagation()}
		        onKeyup={(e) => updateLine(animal, lineNum, `loop(${e.target.value || 1}, function () {`)}/>
      </Block>
      <Block align='center center' absolute right='0' top='5px'>
        <Icon
          color='#666'
          name='delete'
          onClick={[(e) => e.stopPropagation(), () => removeLine(animal, lineNum, 'block')]}/>
      </Block>
    </Block>
	)
}

export default {
	render
}

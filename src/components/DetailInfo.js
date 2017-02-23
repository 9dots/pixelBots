import {Block} from 'vdux-containers'
import {Icon, Text} from 'vdux-ui'
import element from 'vdux/element'

function render ({props}) {
	const {icon, label, onClick} = props
	return (
    <Block
    	mx='1em'
    	ml='0'
    	fs='xs'
    	onClick={onClick && onClick}
    	transition='color .1s ease-in-out'
    	hoverProps={onClick && {color: 'link', cursor: 'pointer'}}
    	fontWeight='300'
    	align='center center'>
      <Icon textDecoration='none' fs='xs' name={icon}/>
      <Text ml='4px'>{label}</Text>
    </Block>
	)
}

export default {
	render
}
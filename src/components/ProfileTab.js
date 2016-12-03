import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Tab from './Tab'

function render ({props}) {
	const {underlineColor, handleClick, active, title} = props
	return (
		<Tab
			name={title}
			fs='s'
			relative
			bgColor='#f5f5f5'
			lineHeight='2.6em'
			active={active}
			fontWeight='800'
			highlight='false'
			color={active ? '#333' : '#666'}
			hoverProps={active && {color: '#666'}}
			p='0'
			handleClick={handleClick}>
			{active && <Block absolute bgColor={underlineColor} wide  bottom='-1px' h='6px'/>}
		</Tab>
	)
}

export default {
	render
}

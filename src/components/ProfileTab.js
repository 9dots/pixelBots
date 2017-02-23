import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Tab from './Tab'

function render ({props}) {
	const {underlineColor, handleClick, active, name, label} = props
	return (
		<Tab
			name={name}
			label={label}
			fs='s'
			relative
			bgColor='#f5f5f5'
			lineHeight='2.6em'
			active={active}
			fontWeight='500'
			highlight='false'
			color={active ? '#333' : '#999'}
			hoverProps={active && {color: '#666'}}
			handleClick={handleClick}>
			{active && <Block absolute bgColor={underlineColor} left='0' wide  bottom='-1px' h='6px'/>}
		</Tab>
	)
}

export default {
	render
}

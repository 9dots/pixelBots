import {Block, Box, Flex, Menu, Text} from 'vdux-ui'
import {MenuItem} from 'vdux-containers'
import {toCamelCase} from '../utils'
import element from 'vdux/element'

function render ({props, children}) {
	const {navItems, active, onClick} = props
	return (
		<Flex px='20px'>
			<Box>
				<Menu column spacing='2px' overflowY='auto'>
					{
						navItems.map(toCamelCase).map((item, i) => (
							<MenuItem
		            relative
		            w='240px'
		            h='65px'
		            column
		            bgColor={compare(active, item) ? '#e5e5e5' : '#FAFAFA'}
		            align='space-around'
		            p='10px 20px'
		            onClick={() => onClick(item)}
	            	color='#767676'>
	            	<Text fs='m' fontWeight='300'>{navItems[i]}</Text>
	            </MenuItem>
						))
					}
				</Menu>
			</Box>
			<Box flex>
				{children}
			</Box>
		</Flex>
	)
}

function compare (a, b) {
	if (typeof (a) !== 'string' || typeof (b) !== 'string') {
		throw new Error('Arguments must be strings.')
	}
	return a.toLowerCase() === b.toLowerCase()
}

export default {
	render
}
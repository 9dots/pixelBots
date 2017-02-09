import {Block, Box, Flex, Menu, Text} from 'vdux-ui'
import {MenuItem} from 'vdux-containers'
import element from 'vdux/element'

function render ({props, children}) {
	const {navItems, active, onClick} = props
	return (
		<Flex px='20px'>
			<Box>
				<Menu column spacing='2px' mt='2px' h='calc(100% - 1px)' overflowY='auto'>
					{
						navItems.map((item) => (
							<MenuItem
		            relative
		            w='240px'
		            h='65px'
		            column
		            bgColor='#e5e5e5'
		            align='space-around'
		            highlight={compare(active, item)}
		            p='10px 20px'
		            onClick={() => onClick(item)}
	            	color='#333'>
	            	<Text fs='m' fontWeight='300'>{item}</Text>
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
/**
 * Imports
 */

import {Block, Box, Flex, Menu, Text} from 'vdux-ui'
import {MenuItem} from 'vdux-containers'
import {component, element} from 'vdux'
import toCamelCase from 'utils/toCamelCase'



/**
 * <Left Nav/>
 */

export default component({
	render ({props, children}) {
		const {navItems, active, onClick} = props
		return (
			<Flex tall>
				<Box borderRight='1px solid grey'>
					<Menu column spacing='2px' overflowY='auto'>
						{
							navItems.filter(item => !!item).map(toCamelCase).map((item, i) => (
								<MenuItem
			            relative
			            w='180px'
			            column
			            bgColor={compare(active, item) ? '#e5e5e5' : '#FAFAFA'}
			            align='space-around'
			            p='12px 20px'
			            onClick={onClick(item)}
		            	color='#767676'>
		            	<Text fs='s' >{navItems[i]}</Text>
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
})

function compare (a, b) {
	if (typeof (a) !== 'string' || typeof (b) !== 'string') {
		throw new Error('Arguments must be strings.')
	}
	return a.toLowerCase() === b.toLowerCase()
}
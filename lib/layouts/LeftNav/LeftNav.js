/**
 * Imports
 */

import {Block, Box, Flex, Menu, Text, Icon} from 'vdux-ui'
import {MenuItem} from 'vdux-containers'
import Link from 'components/Link'
import {component, element} from 'vdux'


/**
 * <Left Nav/>
 */

export default component({
	render ({props, children}) {
		const {thisProfile, isMine} = props
		const {username} = thisProfile.value

		return (
			<Flex tall flex>
				<Box borderRight='1px solid grey'>
					<Menu column overflowY='auto' w={210} pt='s' px='s'>
						<Item color='red' icon='collections' href={`/${username}/gallery`}>
							Showcase
						</Item>
						<Block hide={!isMine}>
							<Block px mt='s' pt pb='s' fs='xxs' borderTop='1px solid divider'>Play</Block>
							<Item color='blue' icon='access_time' href={`/${username}/studio/inProgress`}>
								In Progress
							</Item>
							<Item color='green' icon='check_circle' href={`/${username}/studio/completed`}>
								Completed
							</Item>
						</Block>
						<Block hide={!isMine} px mt='s' pt pb='s' fs='xxs' borderTop='1px solid divider'>Create</Block>
						<Item color='blue' href={`/${username}/authored/playlists`} icon='view_list'>
							Playlists
						</Item>
						<Item color='green' icon='stars' href={`/${username}/authored/challenges`}>
							Challenges
						</Item>
						<Item hide={!isMine} color='yellow' icon='edit' href={`/${username}/authored/drafts`}>
							Drafts
						</Item>
					</Menu>
				</Box>
				<Box flex bg='#F0F0F0'>
					{children}
				</Box>
			</Flex>
		)
	}
})

const Item = component({
	render({props, children, context}) {
		const {icon, color, ...rest} = props

		return (
			<Link bgColor='#FAFAFA' color='primary' fs='xs' align='start center' ui={MenuItem} currentProps={{bgColor: '#EEE'}} {...rest}>
				{ icon && <Icon name={icon} mr color={color} /> }
				{ children }
			</Link>
		)
	}
})
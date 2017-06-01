/**
 * Imports
 */

import {Menu, Text, Icon, Block} from 'vdux-ui'
import {MenuItem, Avatar, Button} from 'vdux-containers'
import CreateModal from 'components/CreateModal'
import ImagePicker from 'components/ImagePicker'
import {component, element} from 'vdux'
import Link from 'components/Link'


/**
 * <Left Nav/>
 */

export default component({
	render ({props, children, context}) {
		const {thisProfile, isMine} = props
		const {username, displayName, drafts = {}, photoURL} = thisProfile.value
		const numDrafts = Object.keys(drafts).length
		const imgProps = isMine 
			? {
					onClick: context.openModal(() => <ImagePicker/>),
					pointer: true, 
					transition: 'opacity .25s', 
					hoverProps: {opacity: .2}
				}
			: {}
		const imageSize = '80px'

		return (
			<Block tall align='start'>
				<Block borderRight='1px solid grey'>
					<Menu column overflowY='auto' w={180} pt='s' px='s'>
						<Block py={10} borderBottom='1px solid divider'>
							<Block bgColor='blue' circle={imageSize} m='0 auto 6px' relative>
								<Icon name='edit' color='white' fs='28' textAlign='center' lh={imageSize}  circle={imageSize}/>
								<Avatar absolute top left display='block' circle={imageSize} src={photoURL} {...imgProps} />
							</Block>
							<Block whiteSpace='nowrap' ellipsis textAlign='center'>
								<Block ellipsis mb='s'>{displayName}</Block>
								<Block color='blue' ellipsis fs={11} fontFamily='"Press Start 2P"'>{username}</Block>
							</Block>
						</Block>
						<Item color='red' mt='s' icon='collections' href={`/${username}/gallery`}>
							Showcase
						</Item>
						<Item color='blue' href={`/${username}/stats`} icon='show_chart'>
							Stats
						</Item>
						<Item color='green' href={`/${username}/playlists`} icon='view_list'>
							My Challenges
						</Item>
						<Item hide={!isMine} color='yellow' icon='edit' href={`/${username}/drafts`}>
							Drafts 
							<Block italic ml='s' color='#888' fs='13' lh='17px'>
								({numDrafts})
							</Block>
						</Item>
						<Block align='center center' mt hide={!isMine}>
							<Button onClick={context.openModal(() => <CreateModal/>)} fs='xs' w={140} bgColor='blue'>
								<Icon name='add' fs='s' ml={-6} mr={6} /> Create
							</Button>
						</Block>
					</Menu>
				</Block>
				<Block flex bg='#F0F0F0'>
					{children}
				</Block>
			</Block>
		)
	}
})

const Item = component({
	render({props, children, context}) {
		const {icon, color, ...rest} = props

		return (
			<Link bgColor='#FAFAFA' color='primary' fs='xs' align='start center' ui={MenuItem} currentProps={{bgColor: '#EEE'}} {...rest}>
				{ icon && <Icon name={icon} mr={10} color={color} /> }
				{ children }
			</Link>
		)
	}
})
/**
 * Imports
 */

import {Menu, Text, Icon, Block} from 'vdux-ui'
import {MenuItem, Avatar, Button} from 'vdux-containers'
import CreateModal from 'components/CreateModal'
import ImagePicker from 'components/ImagePicker'
import {component, element} from 'vdux'
import Tab from 'components/Tab'
import Link from 'components/Link'


/**
 * <Profile Nav/>
 */

export default component({
	render ({props, children, context}) {
		const {thisProfile, isMine, ...rest} = props
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
		const imageSize = '100px'

		return (
			<Block
        borderBottom='1px solid divider' 
        align='center center' column pt='s' px relative {...rest}>
				<Button absolute top={12} right={12} bgColor='blue' fs='s' p='6px 24px' onClick={context.openModal(() => <CreateModal/>)}>
					<Icon name='add' fs='m' mr='s' /> Create
				</Button>
        <Block py align='start center' flex>
					<Block bgColor='blue' circle={imageSize} mr relative>
						<Icon name='edit' color='white' fs='28' textAlign='center' lh={imageSize}  circle={imageSize}/>
						<Avatar absolute top left display='block' circle={imageSize} src={photoURL} {...imgProps} />
					</Block>
					<Block whiteSpace='nowrap' ellipsis maxWidth={600} fs='m'>
						<Block ellipsis mb='m'>{displayName}</Block>
						<Block color='blue' ellipsis fs='s' fontFamily='"Press Start 2P"'>{username}</Block>
					</Block>
				</Block>
				<Block align='center end'>
					<Item label='Showcase' underlineColor='red' tab='gallery'/>
					<Item label='Stats' underlineColor='blue' tab='stats'/>
					<Item label='Challenges' underlineColor='green' tab='playlists'/>
					<Item hide={!isMine} label={`Drafts (${numDrafts})`} underlineColor='yellow' tab='drafts'/>
				</Block>
				<Block flex />

    	</Block>
		)
	}
})

const Item = component({
	render({props, context}) {
		const {tab, ...rest} = props
		const username = context.url.split('/')[1]
		const url = `/${username}/${tab}`

		return (
			<Tab 
				handleClick={context.setUrl(url)} 
				active={context.url === url} 
				{...rest} />
		)
	}
})
/**
 * Imports
 */

import PixelGradient from 'components/PixelGradient'
import PlaylistItem from 'components/PlaylistItem'
import {Button, MenuItem} from 'vdux-containers'
import EmptyState from 'components/EmptyState'
import {Block, Icon, Menu} from 'vdux-ui'
import {component, element} from 'vdux'
import UpNext from 'components/UpNext'
import mapValues from '@f/map-values'
import orderBy from 'lodash/orderBy'
import Link from 'components/Link'
import fire from 'vdux-fire'

/**
 * <Progress/>
 */

const btnProps = {
	fs: 'l',
	p: '12px 24px',
	bgColor: 'blue',
	boxShadow: '0px 1px 3px rgba(0,0,0,.5)'
}

export default fire((props) => ({
  coursesVal: '/courses#bindAs=object'
}))(component({
  render ({props, context}) {
  	const {userProfile: {lists}, coursesVal} = props
  	const {value, loading} = coursesVal

  	if (loading) return <span />

  	const items = mapValues((p) => ({...p, type: 'playlist'}), lists)
  	const orderedItems = orderBy(items, 'lastEdited', 'desc')
  	const next = orderedItems[0]

    return (
    	<Block tall wide bg='#f0f0f0' align='start' overflowY='auto'>
				<Block p='l' pt flex>
					<UpNext playlistKey={next.playlistKey} current={next.current} />
					<Block align='start'>
						<Sidebar mr items={value} />
						<Block flex>
							{
								items && Object.keys(items).length
					    		? orderedItems.map((item) => 
					    				<PlaylistItem
							          key={item.playlistKey}
							          clickHandler={context.setUrl(`/playlist/${item.playlistKey}`)}
							          lastEdited={item.lastEdited}
							          playlistRef={item.playlistKey} />
				    				)
					    		: <EmptyState icon='access_time' title='In Progress Projects' description={'You don\'t currently have any projects in progress. In progress projects will appear here so you can continue where you left off. '} />
							}
						</Block>
					</Block>
				</Block>
    	</Block>
    )
  }
}))

const Sidebar = component({
	render({props}) {
		const {items, ...rest} = props

		return (
			<Block tall w={200} pb border='1px solid grey' bg='white' {...rest}>
				<Block color='blue' textAlign='center' p>Possibly something goes here</Block>
				<Menu column overflowY='auto' wide pt='s' px='s'>
					<Block m='s' fs='xxs'>Courses</Block>
					{
						mapValues((course) => <Item title={course.title}/>, items)
					}
				</Menu>
			</Block>
		)
	}
})


const Item = component({
	render({props, context}) {
		const {icon, title, ...rest} = props

		return (
			<Link bgColor='white' color='primary' fs='xs' align='start center' ui={MenuItem} currentProps={{bgColor: '#EEE'}} ellipsis {...rest}>
				<Block circle='24' bgColor='green' color='white' align='center center' mr='s'>
					{title[0]}
				</Block>
				{ title }
			</Link>
		)
	}
})
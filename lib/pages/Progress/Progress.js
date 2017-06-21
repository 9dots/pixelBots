/**
 * Imports
 */

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
  coursesVal: '/courses#bindAs=object',
	inProgress: {
		ref: `/playlistsByUser/${props.uid}/inProgress#orderByChild=lastEdited`,
		join: {
			ref: '/playlistInstances',
			child: 'playlistValue',
			childRef: (val, ref) => val.map(v => ref.child(v.key))
		}
	},
	completed: {
		ref: `/playlistsByUser/${props.uid}/completed#orderByChild=lastEdited`,
		join: {
			ref: '/playlistInstances',
			child: 'playlistValue',
			childRef: (val, ref) => val.map(v => ref.child(v.key))
		}
	}
}))(component({
  render ({props, context}) {
  	const {userProfile, inProgress, coursesVal, completed} = props
  	const {value, loading} = coursesVal
		const {value: inProgressValue, loading: inProgressLoading} = inProgress
		const {value: completedValue, loading: completedLoading} = completed

  	if (loading || inProgressLoading || completedLoading) return <span />

  	const orderedLists = (inProgressValue || []).reverse()
  	const orderedCompleted = (completedValue || []).reverse() 
  	const next = orderedLists[0]
  	const length = orderedLists.length + orderedCompleted.length

    return (
    	<Block tall bg='#f0f0f0' align='center' overflowY='auto'>
				<Block p='l' pt flex maxWidth='1100' mt={orderedLists.length === 1 ? 75 : 0}>
					{
						next && <UpNext
							playlistRef={next.playlistRef}
							instanceRef={next.key}
							current={next.playlistValue.current}
							uid={context.uid} />
					}
					<Block align='start'>
						<Block flex>
							{
								length 
									? <Block>
											<Lists lists={orderedLists.slice(1)} />
											<Lists lists={orderedCompleted}>
												<Block borderBottom='1px solid divider' my='l' />
											</Lists>
										</Block>
									: <EmptyState icon='access_time' title='In Progress Projects' description={'You don\'t currently have any projects in progress. In progress projects will appear here so you can continue where you left off. '} />
							}

						</Block>
					</Block>
				</Block>
    	</Block>
    )
  }
}))


const Lists = component({
	render ({props, context, children}) {
		const {lists} = props

		if(!lists.length) return <span />

		return (
			<Block>
				{children}
				{
					lists.map((list) =>
	  				<PlaylistItem
		          key={list.key}
							uid={context.uid}
							instanceRef={list.key}
							myProgress={list}
		          lastEdited={list.lastEdited}
		          playlistRef={list.playlistRef} />
      		)
	      }
      </Block>
		)
	}
})

const Item = component({
	render({props, context}) {
		const {icon, title, ...rest} = props

		return (
			<Link bgColor='white' color='primary' fs='xs' py='10' align='start center' ui={MenuItem} currentProps={{bgColor: '#EEE'}} ellipsis {...rest}>
				<Block circle='24' bgColor='green' color='white' align='center center' mr='s'>
					{title[0]}
				</Block>
				<Block flex>{ title }</Block>
				{Math.floor(Math.random() * 100)}%
			</Link>
		)
	}
})

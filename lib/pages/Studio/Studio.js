/**
 * Imports
 */

import EmptyState from 'components/EmptyState'
import Challenges from 'components/Challenges'
import Playlists from 'components/Playlists'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import LeftNav from 'layouts/LeftNav'
import {Block} from 'vdux-ui'
import enroute from 'enroute'

const router = enroute({
  'inProgress': function (params, props) {
  	const items = props.profile.inProgress
    return (
    	items && items.length 
    		? <Challenges items={items} />
    		: <EmptyState icon='access_time' title='In Progress Projects' description={'You don\'t currently have any projects in progress. In progress projects will appear here so you can continue where you left off. '} />
  	)
  },
  'completed': function (params, props) {
  	const items = props.profile.completed
    return (
    	items && items.length 
    		? <Challenges items={items} />
    		: <EmptyState icon='check_circle' title='Completed Projects' description='All the projects you complete will show up here. Complete your first project to get your list started!' />
  	)
  },
  'playlists': function (params, props) {
  	const items = props.profile.playlists
    return (
    	items && items.length 
    		? <Playlists items={items} />
    		: <EmptyState icon='view_list' title='In Progress Playlists' description={'You don\'t currently have any playlists in progress. In progress playlists will appear here so you can continue where you left off. '} />
  	)
  },
})

/**
 * <Studio/>
 */

export default component({
	* onCreate ({props, context}) {
		const {category, username, subcategory, mine} = props
	  if (!mine) {
	    return yield context.setUrl(`/${username}`)
	  }
	  if (!subcategory) {
	    return yield context.setUrl(`/${username}/${category}/inProgress`)
	  }
	},
  render ({props, actions}) {
	  const {category, username, subcategory} = props
	  if (!subcategory) {
	    return <span />
	  }
	  return (
	    <LeftNav
	      active={subcategory}
	      onClick={actions.handleClick}
	      navItems={['In Progress', 'Completed', 'Playlists']}>
	      <Block column wide tall>
	      	{router(subcategory, props)}
	      </Block>
	    </LeftNav>
  	)
	},
	controller: {
		* handleClick ({props, context}, key) {
			yield context.setUrl(`/${context.username}/${props.category}/${key}`)
		}
	}
})

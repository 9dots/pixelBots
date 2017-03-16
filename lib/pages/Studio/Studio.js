/**
 * Imports
 */

import Challenges from 'components/Challenges'
import Playlists from 'components/Playlists'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import LeftNav from 'layouts/LeftNav'
import enroute from 'enroute'

const router = enroute({
  'inProgress': (params, props) => (
    <Challenges items={props.profile.inProgress} />
	),
  'completed': (params, props) => (
    <Challenges items={props.profile.completed} />
	),
  'playlists': (params, props) => (
    <Playlists items={props.profile.lists} />
	)
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
	      {router(subcategory, props)}
	    </LeftNav>
  	)
	},
	controller: {
		* handleClick ({props, context}, key) {
			yield context.setUrl(`/${context.username}/${props.category}/${key}`)
		}
	}
})

/**
 * Imports
 */

import EmptyState from 'components/EmptyState'
import CardFeed from 'components/CardFeed'
import {component, element} from 'vdux'
import {Block} from 'vdux-ui'

/**
 * <Gallery/>
 */

export default component({
  render ({props}) {
    	const items = props.profile.showcase
    return (
  		items && items.length 
  			? <CardFeed items={items} {...props} />
  			: <EmptyState icon='collections' title='No Gallery Items' description='There are currently no gallery items.  When this user shares some of their work, it will appear here!' />
    )
  }
})

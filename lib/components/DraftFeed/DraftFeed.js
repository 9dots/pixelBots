/**
 * Imports
 */

import DraftItem from 'components/DraftItem'
import {component, element} from 'vdux'
import mapValues from '@f/map-values'
import {Block} from 'vdux-ui'

/**
 * <Draft Feed/>
 */

export default component({
	* onCreate ({props, context}) {
		if (!props.mine) {
			yield context.setUrl(`/${props.profileName}/authored`)
		}
	},
  render ({props}) {
		const {drafts = {}} = props
	  return (
	    <Block wide bgColor='white' mb='l'>
	      {mapValues(toItems, drafts)}
	    </Block>
	  )

	  function toItems (draft, key) {
		  return <DraftItem draftKey={key}/>
		}
  }
})

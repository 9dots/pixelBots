/**
 * Imports
 */

import IndeterminateProgress from 'components/IndeterminateProgress'
import {component, element, stopPropagation} from 'vdux'
import {MenuItem} from 'vdux-containers'
import {Icon} from 'vdux-ui'
import fire from 'vdux-fire'

/**
 * <Draft Item/>
 */

export default fire((props) => ({
  draft: `/drafts/${props.draftRef}`
}))(component({
  render ({props, context, actions}) {
	  const {draft, draftRef, draftKey} = props
	  const {uid} = context
	  if (draft.loading) return <IndeterminateProgress/>

	  const draftVal = draft.value
	  if (!draftVal) return <div/>
	  return (
	    <MenuItem
	      fs='m'
	      py='m'
	      fontWeight='300'
	      align='space-between center'
	      hoverProps={{bgColor: 'rgba(33, 150, 243, 0.2)'}}
	      onClick={context.setUrl(`/create/${draftRef}`)}>
	      {draftVal.title}
	      <Icon name='delete' onClick={[actions.removeDraft, stopPropagation]}/>
	    </MenuItem>
	  )
  },
  controller: {
  	* removeDraft ({props, context}) {
  		yield context.firebaseSet(`/drafts/${props.draftRef}`, null)
  		yield context.firebaseSet(`/users/${context.uid}/drafts/${props.draftKey}`, null)
  	}
  }
}))


/**
 * Imports
 */

import IndeterminateProgress from 'components/IndeterminateProgress'
import {component, element, stopPropagation} from 'vdux'
import ListItem from 'components/ListItem'
import {Icon} from 'vdux-containers'
import fire from 'vdux-fire'

/**
 * <Draft Item/>
 */

export default fire((props) => ({
  draft: `/drafts/${props.draftKey}`
}))(component({
  render ({props, context, actions}) {
	  const {draft, draftRef, draftKey} = props
	  const {uid} = context
	  if (draft.loading) return <IndeterminateProgress/>

	  const draftVal = draft.value
	  if (!draftVal) return <div/>
	  return (
	    <ListItem
	      onClick={context.setUrl(`/create/${draftKey}`)}
	      fontWeight='300'
	      align='space-between center'
	      p
	      >
	      {draftVal.title}
	      <Icon name='delete' hoverProps={{opacity: '.8'}} fs='m' color='primary' onClick={[actions.removeDraft, stopPropagation]}/>
	    </ListItem>
	  )
  },
  controller: {
  	* removeDraft ({props, context}) {
  		yield context.firebaseSet(`/drafts/${props.draftKey}`, null)
  		yield context.firebaseSet(`/users/${context.uid}/drafts/${props.draftKey}`, null)
  	}
  }
}))


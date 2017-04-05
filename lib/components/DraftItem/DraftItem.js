/**
 * Imports
 */

import IndeterminateProgress from 'components/IndeterminateProgress'
import {component, element, stopPropagation} from 'vdux'
import DetailInfo from 'components/DetailInfo'
import ListItem from 'components/ListItem'
import {Block, Image} from 'vdux-ui'
import {Icon} from 'vdux-containers'
import fire from 'vdux-fire'
import moment from 'moment'

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

	  const {title, lastEdited} = draftVal

	  return (
	    <ListItem
	      onClick={context.setUrl(`/create/${draftKey}`)}
	      fontWeight='300'
	      align='start center'
	      p
	      >
	      <Block mr='14px' bgColor='divider' sq={40} border='1px solid rgba(0,0,0,.1)' align='center center'>
          <Icon color='white' name='edit' />
        </Block>
        <Block flex ellipsis>
	      	{title}
	      </Block>
      	<DetailInfo
      		w={280}
      		align='start center'
          icon='date_range'
          label={`Last Edited: ${moment(lastEdited).fromNow()}`} />
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


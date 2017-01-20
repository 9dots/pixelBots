/** @jsx element */

import IndeterminateProgress from './IndeterminateProgress'
import {setUrl} from 'redux-effects-location'
import {MenuItem} from 'vdux-containers'
import {Icon} from 'vdux-ui'
import element from 'vdux/element'
import fire, {refMethod} from 'vdux-fire'

function render ({props}) {
  const {draft, draftRef, draftKey, uid} = props
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
      onClick={() => setUrl(`/edit/${draftRef}`)}>
      {draftVal.title}
      <Icon name='delete' onClick={removeDraft}/>
    </MenuItem>
  )

  function * removeDraft (e) {
    e.stopPropagation()
    yield refMethod({
      ref: `/drafts/${draftRef}`,
      updates: {
        method: 'remove'
      }
    })
    yield refMethod({
      ref: `/users/${uid}/drafts/${draftKey}`,
      updates: {
        method: 'remove'
      }
    })
  }
}

export default fire((props) => ({
  draft: `/drafts/${props.draftRef}`
}))({
  render
})

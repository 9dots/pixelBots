/** @jsx element */

import IndeterminateProgress from './IndeterminateProgress'
import {setUrl} from 'redux-effects-location'
import {MenuItem} from 'vdux-containers'
import element from 'vdux/element'
import fire from 'vdux-fire'

function render ({props}) {
  const {draft, draftRef} = props
  if (draft.loading) return <IndeterminateProgress/>

  const draftVal = draft.value
  return (
    <MenuItem
      fs='m'
      py='m'
      fontWeight='300'
      hoverProps={{bgColor: 'rgba(33, 150, 243, 0.2)'}}
      onClick={() => setUrl(`/edit/${draftRef}`)}>
      {draftVal.title}
    </MenuItem>
  )
}

export default fire((props) => ({
  draft: `/drafts/${props.draftRef}`
}))({
  render
})

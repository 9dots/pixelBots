/** @jsx element */

import DraftItem from '../components/DraftItem'
import element from 'vdux/element'
import {Block} from 'vdux-ui'
import reduce from '@f/reduce'

function render ({props}) {
  const {drafts} = props

  return (
    <Block wide bgColor='white'>
      {reduce(toItems, [], drafts)}
    </Block>
  )

  function toItems (arr, draft, key) {
	  return arr.concat(<DraftItem uid={props.uid} draftKey={key} draftRef={draft.ref}/>)
	}
}

export default {
  render
}

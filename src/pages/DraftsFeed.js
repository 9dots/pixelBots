/** @jsx element */

import DraftItem from '../components/DraftItem'
import element from 'vdux/element'
import {Block} from 'vdux-ui'
import reduce from '@f/reduce'

function render ({props}) {
  const {drafts} = props

  return (
    <Block bgColor='white'>
      {reduce(toItems, [], drafts)}
    </Block>
  )
}

function toItems (arr, draft) {
  return arr.concat(<DraftItem draftRef={draft.ref}/>)
}

export default {
  render
}

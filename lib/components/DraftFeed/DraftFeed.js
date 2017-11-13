/**
 * Imports
 */

import DraftItem from 'components/DraftItem'
import {component, element} from 'vdux'
import mapValues from '@f/map-values'
import sortBy from 'lodash/orderBy'
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
    const sorted = sortBy(mapValues((time, key) => ({time, key}), drafts), 'time', 'desc')

    return (
      <Block wide bgColor='white' mb='l'>
        {sorted.map((d) => <DraftItem key={d.key} draftKey={d.key} />)}
      </Block>
    )
  }
})

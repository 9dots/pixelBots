/** @jsx element */

import {Block, Text} from 'vdux-ui'
import element from 'vdux/element'
import {getLoc} from '../utils'

function render ({props}) {
  const {sequence, ...restProps} = props
  const loc = getLoc(sequence)
  return (
    <Block borderRight='1px solid green' align='center center' column {...restProps}>
      <Block>
        <Text
          color='green'
          display='block'
          fs='m'
          fontWeight='300'>LOC</Text>
      </Block>
      <Block h='35px' align='center center'>
        <Text fontWeight='300' color='green' fs='m'>{loc}</Text>
      </Block>
    </Block>
  )
}

export default {
  render
}

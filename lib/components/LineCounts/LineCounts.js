/**
 * Imports
 */

import { component, element } from 'vdux'
import { Block } from 'vdux-ui'

/**
 * <Line Counts/>
 */

export default component({
  render ({ props }) {
    const { value, limit, name, hard, color = 'white' } = props
    const overColor = hard ? 'red' : '#efb917'
    const over = limit && value > limit
    return (
      <Block bold={over} color={over ? overColor : color}>
        {limit
          ? `${value} / ${limit} ${pluralize(name, limit)}`
          : `${value} ${pluralize(name, value)}`}
      </Block>
    )
  }
})

/**
 * Helpers
 */

const pluralize = (noun, num) => (num === 0 || num > 1 ? `${noun}s` : noun)

/**
 * Imports
 */
import { Block, Text } from 'vdux-ui'
import Badge from 'components/Badge'
import { component, element } from 'vdux'

/**
 * <Result Badges/>
 */

export default component({
  render ({ props }) {
    const { best = {}, stretch = {}, gameType, ...rest } = props
    const { loc, modifications, steps, invalidCount } = best
    const { type, value } = stretch

    return (
      <Block align='center center' {...rest}>
        <BadgeLine title='Completed' type='completed' noun='completed' earned />
        <BadgeLine
          limit={value}
          title='Step Count'
          type='stepLimit'
          noun='step'
          count={steps}
          hide={gameType !== 'write' || type !== 'stepLimit'} />
        <BadgeLine
          limit={value}
          title='Line Count'
          type='lineLimit'
          noun='line'
          count={loc}
          hide={gameType !== 'write' || type !== 'lineLimit'} />
        <BadgeLine
          limit={value || 3}
          title='Error Limit'
          type='errorLimit'
          noun='error'
          count={invalidCount}
          hide={gameType !== 'read'} />
        <BadgeLine
          limit={value}
          title='Change Limit'
          type='modLimit'
          noun='change'
          count={modifications}
          hide={type !== 'modLimit'} />
      </Block>
    )
  }
})

const BadgeLine = component({
  render ({ props }) {
    const { count, type, limit, title, noun, ...rest } = props
    const earned = props.earned || count <= limit
    const isBinary = count === undefined

    return (
      <Block column align='center center' textAlign='center' px flex {...rest}>
        <Badge
          message={false}
          disabledColor={'#BBB'}
          count={earned ? 1 : 0}
          type={type}
          size={120}
          hideTitle />
        <Block flex pr>
          <Block fs='xxs' mt mb='s' fontFamily='&quot;Press Start 2P&quot;'>
            {title}
            <Text hide={isBinary}>
              <Text mr>:</Text>
              <Text color={earned ? 'primary' : 'red'}>
                {count}
                <Text>&nbsp;of {limit}</Text>
              </Text>
            </Text>
          </Block>
          <Block hide={isBinary}>
            <Block mt='s' hide={!earned}>
              On your best run, you completed the challenge in {count} {noun}
              {count > 1 ? 's' : ''}.
            </Block>
            <Block mt='s' hide={earned}>
              Your best is {count}. Complete in under {limit} {noun}
              {limit > 1 ? 's' : ''} to earn the badge.
            </Block>
          </Block>
          <Block hide={!isBinary}>
            You did it! You earned a {noun} challenge badge!
          </Block>
        </Block>
      </Block>
    )
  }
})

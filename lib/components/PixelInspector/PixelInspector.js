/**
 * Imports
 */

import { component, element } from 'vdux'
import { Block, Icon } from 'vdux-ui'

/**
 * <Widget/>
 */

export default component({
  render ({ props, state, actions, children }) {
    const {
      name,
      onClick,
      titleButton,
      inspectMode,
      data,
      ...restProps
    } = props

    return (
      <Block
        column
        minHeight='74px'
        bgColor='white'
        p='10px 0 20px'
        relative
        {...restProps}>
        <Block fs='xs'>
          {data && (
            <Block>
              <Block align='center center'>
                <Block flex column align='center center'>
                  <Block
                    mb='s'
                    sq='20'
                    border='1px solid grey'
                    bgColor={data.current} />
                  {data.current}
                </Block>
                <Icon name='keyboard_arrow_right' />
                <Block flex column align='center center'>
                  <Block
                    mb='s'
                    sq='20'
                    border='1px solid grey'
                    bgColor={data.target} />
                  {data.target}
                </Block>
              </Block>
            </Block>
          )}
        </Block>
        <Block flex />
      </Block>
    )
  }
})

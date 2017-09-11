/**
 * Imports
 */

import {component, element, decodeMouse, Window} from 'vdux'
import {Block, Icon, Divider, IconButton} from 'vdux-ui'
import {Toggle} from 'vdux-containers'

/**
 * <Widget/>
 */

export default component({
  render ({props, state, actions, children}) {
  	const {name, onClick, titleButton, inspectMode, data, ...restProps} = props
  	const {top, left} = state

    return (
    	<Block column h='100%' bgColor='white' relative {...restProps}>
        <Block fs='xs'>
          {
            data && (
              <Block>
                <Block align='center center'>
                  <Block flex column align='center center'>
                    <Block mb='xs' sq='20' border='1px solid grey' bgColor={data.current} />
                    {data.current}
                  </Block>
                  <Icon name='keyboard_arrow_right' />
                  <Block flex column align='center center'>
                    <Block mb='xs' sq='20' border='1px solid grey' bgColor={data.target} />
                    {data.target}
                  </Block>
                </Block>
              </Block>
            )
          }
        </Block>
        <Block flex />
    	</Block>
    )
  }
})

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
        {
        // <Toggle label='Inspect' onChange={props.toggleInspectMode} checked={inspectMode} borderTop='1px solid divider' py my />
        }
        <Block fs='xs'>
          {
            data && (
              <Block>
                <Block align='center center'>
                  <Block flex column align='center center'>
                    <Block mb='s' sq='20' border='1px solid grey' bgColor={data.current} />
                    {data.current}
                  </Block>
                  <Icon name='keyboard_arrow_right' />
                  <Block flex column align='center center'>
                    <Block mb='s' sq='20' border='1px solid grey' bgColor={data.target} />
                    {data.target}
                  </Block>
                </Block>
                {
                // <Divider my/>
                // <Block my='2px' align='start center'>
                //   <Icon color='green' pr name='my_location'/> 
                //   <Block flex>{data.coordinates.join(', ')}</Block>
                // </Block>
                }
              </Block>
            )
          }
          {
            // (!data && !inspectMode) && (
            //   <Block textAlign='center'> Click the <Icon verticalAlign='middle' fs='xs' name='remove_red_eye'/> button to enter inspect mode. </Block>
            // )
          }
          {
            // (!data && inspectMode) && (
            //   <Block textAlign='center'> Click a pixel inspect it. </Block>
            // )
          }
        </Block>
        <Block flex />
    	</Block>
    )
  }
})

/**
 * Imports
 */

import {component, element, decodeMouse, Window} from 'vdux'
import {Button, Icon, Divider, IconButton} from 'vdux-ui'
import {Block} from 'vdux-ui'

/**
 * <Widget/>
 */

export default component({
  render ({props, state, actions, children}) {
  	const {name, onClick, titleButton, inspectMode, data, ...restProps} = props
  	const {top, left} = state

    return (
    	<Block bgColor='white' relative w='200px' {...restProps}>
				<Block px
			  	wide h='48px' color='#999' align='center center' borderBottom='1px solid divider'>
					<Block fs='14px' flex>PIXEL INSPECTOR</Block>
					<Button m='0' bgColor={inspectMode ? 'black' : 'green'} onClick={props.toggleInspectMode}><Icon fs='18px' name='search'/></Button>
				</Block>
    		<Block p fs='xs'>
    			{
            data && (
              <Block>
                <Block my='2px' align='start center'><Icon color='green' pr name='my_location'/> <Block flex>{data.coordinates.join(', ')}</Block></Block>
                <Divider my/>
                <Block my='2px' align='start center'><Icon color='blue' pr name='colorize'/> <Block flex>{data.current}</Block></Block>
                <Block my='2px' align='start center'><Icon color='blue' pr name='filter_center_focus'/> <Block flex>{data.target}</Block></Block>
              </Block>
            )
          }
          {
            (!data && !inspectMode) && (
              <Block> Click the <Icon verticalAlign='middle' fs='xs' name='search'/> button to enter inspect mode. </Block>
            )
          }
          {
            (!data && inspectMode) && (
              <Block> Click a pixel inspect it. </Block>
            )
          }
  			</Block>
    	</Block>
    )
  }
})

/**
 * Imports
 */

import {Block, Icon, Image} from 'vdux-containers'
import {component, element} from 'vdux'

/**
 * <Drag Handle/>
 */

export default component({
	initialState: {
		hovering: false
	},
  render ({props, actions, state}) {
  	const {imageSrc, ref, mine, sortable = false} = props
    return (
    	<Block
    		align='center center'
    		sq='50px'
    		onMouseOver={actions.mouseOver}
    		onMouseOut={actions.mouseOut}>
    		{
    			state.hovering && mine && sortable
    				? <Icon id={`drag-handle-${ref}`} cursor='move' name='drag_handle' />
    				: <Image sq='50px' src={imageSrc}/>
    		}
    	</Block>
    )
  },
  reducer: {
  	mouseOver: () => ({hovering: true}),
  	mouseOut: () => ({hovering: false})
  }
})

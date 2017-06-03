/**
 * Imports
 */

import {Block, Icon} from 'vdux-containers'
import {component, element} from 'vdux'

/**
 * <Drag Handle/>
 */

export default component({
  initialState: {
    hovering: false
  },

  render ({props, actions, state}) {
  	const {imageSrc, ref, ...rest} = props
    const {hovering} = state

    return (
    	<Block
    		align='center center'
        onMouseOver={actions.mouseOver}
        onMouseOut={actions.mouseOut}
    		sq='50px' 
        {...rest}>
  				<Icon id={`drag-handle-${ref}`} class={hovering ? 'drag-over' : ''} cursor='move' name='drag_handle' />
    	</Block>
    )
  },

  reducer: {
    mouseOver: () => ({hovering: true}),
    mouseOut: () => ({hovering: false})
  }
})

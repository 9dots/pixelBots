
/**
 * Imports
 */

import initialGameState from 'utils/initialGameState'
import GridOptions from 'components/GridOptions'
import StartCode from 'components/StartCode'
import {component, element} from 'vdux'
import {Block} from 'vdux-ui'
import Switch from '@f/switch'
import pick from '@f/pick'

/**
 * <Grid Options/>
 */

export default component({
  render ({props, actions}) {
  	const {type} = props
    return Switch({
    	write: () => <GridOptions save={actions.save} {...props}/>,
    	read: () => <StartCodeOptions save={actions.save} {...props}/>,
    	//debug: () => <DebugOptions {...props}/>,
    	//project: () => <ProjectOptions {...props}/>,
    	default: () => <div> invalid </div>
    })(type)
  },
  controller: {
  	* save ({context, props}, data = {}) {
	  	yield context.firebaseUpdate(props.ref, data)
	  }
  }
})

const StartCodeOptions = component({
	render ({props}) {
		return (
			<StartCode {...props}/>
		)
	}
})
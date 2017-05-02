
/**
 * Imports
 */

import initialGameState from 'utils/initialGameState'
import GridOptions from 'components/GridOptions'
import GameLoader from 'components/GameLoader'
import StartCode from 'components/StartCode'
import {component, element} from 'vdux'
import Switch from '@f/switch'
import {Block} from 'vdux-ui'

/**
 * <Grid Options/>
 */

export default component({
  render ({props, actions, children}) {
  	const {type} = props

    return Switch({
    	write: () => (
        <GridOptions save={actions.save} {...props}>
          {children}
        </GridOptions>
      ),
    	read: () => (
        <StartCodeOptions save={actions.save} {...props}>
          {children}
        </StartCodeOptions>
      ),
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
	render ({props, children, actions}) {
		return (
      <Block wide>
			  <StartCode initialData={props.draftGame} {...props} />
        {children}
     </Block>
		)
	}
})

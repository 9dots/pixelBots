
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
        <GridOptions {...props}>
          {children}
        </GridOptions>
      ),
    	read: () => (
        <StartCodeOptions {...props}>
          {children}
        </StartCodeOptions>
      ),
    	//debug: () => <DebugOptions {...props}/>,
    	//project: () => <ProjectOptions {...props}/>,
    	default: () => <div> invalid </div>
    })(type)
  }
})

const StartCodeOptions = component({
	render ({props, actions, children}) {
		return (
      <Block wide>
			  <StartCode save={actions.save} initialData={props.draftGame} {...props} />
        {children}
     </Block>
		)
	},

  controller: {
    * save ({props}, {animals, frames}) {
      yield props.updateGame({
        animals,
        frames
      })
    }
  }
})

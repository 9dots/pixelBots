
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
        <GridOptions save={props.updateGame} {...props}>
          {children}
        </GridOptions>
      ),
    	read: () => (
        <StartCodeOptions save={props.updateGame} {...props}>
          {children}
        </StartCodeOptions>
      ),
    	//debug: () => <DebugOptions {...props}/>,
    	project: () => <GridOptions isProject save={props.updateGame} {...props}/>,
    	default: () => <div> invalid </div>
    })(type)
  }
})

const StartCodeOptions = component({
	render ({props, actions, children}) {
		return (
      <Block wide>
			  <StartCode {...props} />
        {children}
     </Block>
		)
	}
})

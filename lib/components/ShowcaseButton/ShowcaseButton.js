/**
 * Imports
 */

import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import {Icon, Block} from 'vdux-ui'

/**
 * <Showcase Button/>
 */

export default component({
  render ({props, actions, children}) {
    const {shared, ...rest} = props
    const {add, remove} = actions
    const btnProps = {
      color: shared ? 'red' : 'white',
      bgColor: shared ? 'white' : 'blue',
      borderColor: shared ? 'red' : 'rgba(0,0,0,.1)',
      hoverProps: {highlight: shared ? .02 : .1},
      focusProps: {},
      p: '6px 12px',
      fs: 'xs',

    }

    return (
      <Button {...btnProps} {...rest} onClick={shared ? remove : add}>
      	{
      		children.length
      			? children
      			: <Block align='center center'>
    						<Icon name='collections' mr='s' />
  							{ shared ? 'Remove from Showcase' : 'Add to Showcase' }
							</Block>
    		}
    	</Button>
    )
  },
  controller: {
    * add ({context, props}) {
      const {uid, firebasePush, firebaseUpdate, firebaseSet} = context
      const {gameRef, saveRef} = props
      yield firebaseUpdate(`/saved/${saveRef}/meta`, {shared: true})
      yield firebaseSet(`/users/${context.uid}/showcase/${saveRef}`, {
        gameRef,
        saveRef,
        lastEdited: Date.now()
      })
    },
    * remove ({context, props}) {
      const {uid, firebasePush, firebaseUpdate, firebaseSet} = context
      const {gameRef, saveRef} = props
      yield firebaseUpdate(`/saved/${saveRef}/meta`, {shared: false})
      yield firebaseSet(`/users/${context.uid}/showcase/${saveRef}`, null)
    }
  }
})

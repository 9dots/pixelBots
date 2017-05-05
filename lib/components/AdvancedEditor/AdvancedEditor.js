/**
 * Imports
 */

import CodeEditor from 'components/CodeEditor'
import StartCode from 'components/StartCode'
import {component, element} from 'vdux'
import {Block, Button} from 'vdux-ui'

/**
 * <Advanced Editor/>
 */

export default component({
  render ({props, actions}) {
    return (
    	<Block>
  			<StartCode
          {...props}
          inputType='code'
          save={actions.save}
          animals={props.animals.map(a => ({...a, sequence: props.initialPainted}))} />
    	</Block>
    )
  },

  controller: {
    * save ({props}, {animals, frames}) {
      yield props.save({
        initialPainted: animals[0].sequence || ''
      })
    }
  }
})

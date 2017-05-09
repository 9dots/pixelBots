/**
 * Imports
 */

import CodeEditor from 'components/CodeEditor'
import StartCode from 'components/StartCode'
import {component, element} from 'vdux'
import {Block, Button} from 'vdux-ui'
import setProp from '@f/set-prop'

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
          updateGame={actions.updateGame}
          animals={[{
            type: 'teacherBot',
            current: {
              location: [props.levelSize[0] - 1, 0],
              rot: 0
            },
            sequence: typeof props.initialPainted === 'string'
              ? props.initialPainted
              : ''
          }]} />
    	</Block>
    )
  },

  controller: {
    * save ({props}, {animals, frames}) {
      yield props.updateGame({
        initialPainted: animals[0].sequence || ''
      })
    },
    * updateGame ({props, state}, size) {
      yield props.updateGame({
        levelSize: [size, size],
        animals: props.animals.map(a => setProp('current.location', a, [size - 1, 0]))
      })
    }
  }
})

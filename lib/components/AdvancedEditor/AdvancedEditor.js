/** @jsx element */

/**
 * Imports
 */

import StartCode from 'components/StartCode'
import {component, element} from 'vdux'
import setProp from '@f/set-prop'
import {capabilities} from 'animalApis'

/**
 * <Advanced Editor/>
 */

export default component({
  render ({props, actions}) {
    const location = {
      location: [props.levelSize[0] - 1, 0],
      rot: 0
    }

    return (
      <StartCode
        {...props}
        inputType='code'
        save={actions.save}
        updateGame={actions.updateGame}
        capabilities={capabilities}
        animals={[{
          type: 'teacherBot',
          current: location,
          initial: location,
          sequence: typeof props.initialPainted === 'string'
            ? props.initialPainted
            : ''
        }, ...props.animals.map(a => ({...a, hidden: true}))]} />
    )
  },

  controller: {
    * save ({props}, {animals, frames}) {
      yield props.updateGame({
        initialPainted: animals[0].sequence || ''
      })
    },
    * updateGame ({props, state}, {levelSize, animals, solution}) {
      yield props.updateGame({
        animals: props.animals.map(a => setProp('initial.location', a, [levelSize[0] - 1, 0])),
        levelSize,
        solution
      })
    }
  }
})

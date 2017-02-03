/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import FlowItem from './FlowItem'

function render ({props}) {
  const {steps, active, onClick = () => {}} = props
  return (
    <Block align='center center'>
      {
        steps.filter((step) => !!step).map((step, i, arr) => typeof (step) === 'string'
          ? <FlowItem
            flex
            isComplete={i < arr.indexOf(active)}
            lastItem={i >= arr.length - 1}
            active={step === active}
            onClick={onClick}
            label={step}/>
          : step)
      }
    </Block>
  )
}

export default {
  render
}

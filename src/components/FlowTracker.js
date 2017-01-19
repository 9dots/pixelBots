/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import FlowItem from './FlowItem'

function render ({props}) {
  const {steps, active, onClick = () => {}} = props
  return (
    <Block align='center center'>
      {
        steps.map((step, i) => typeof (step) === 'string'
          ? <FlowItem
            flex
            isComplete={i < steps.indexOf(active)}
            lastItem={i >= steps.length - 1}
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

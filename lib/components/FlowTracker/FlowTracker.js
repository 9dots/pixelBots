/**
 * Imports
 */

import {component, element} from 'vdux'
import FlowItem from './FlowItem'
import {Block} from 'vdux-ui'

/**
 * <Flow Tracker/>
 */

export default component({
  render ({props}) {
	  const {steps, active, onClick, ...rest} = props
	  return (
	    <Block align='center center' {...rest}>
	      {
	        steps.filter((step) => !!step).map((step, i, arr) => typeof (step) === 'string'
	          ? <FlowItem
	            flex
	            isComplete={i < arr.indexOf(active)}
	            lastItem={i >= arr.length - 1}
	            active={step === active}
	            onClick={onClick}
	            i={i}
	            label={step}/>
	          : step)
	      }
	    </Block>
	  )
  }
})

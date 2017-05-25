/**
 * Imports
 */

import {component, element} from 'vdux'
import Button from 'components/Button'
import FlowItem from './FlowItem'
import {Block} from 'vdux-ui'

/**
 * <Flow Tracker/>
 */

export default component({
  render ({props, actions}) {
	  const {steps, active, validate, onClick, ...rest} = props
    const hasNext = steps.length - 1 > active

	  return (
      <Block align='start center'>
        <Button
          hide={!hasNext && props.new}
          onClick={onClick}
          fontWeight='300'
          bgColor='blue'
          mb={-12}
          h={42}
          mr='l'>
          {
             hasNext
              ? <Block align='center center'>
                  Next<Icon name='navigate_next' />
                </Block>
              : 'Save'
          }

        </Button>
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
      </Block>
	  )
  }
})

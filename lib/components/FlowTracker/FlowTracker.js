/**
 * Imports
 */

import { component, element } from 'vdux'
import Button from 'components/Button'
import { Block, Icon } from 'vdux-ui'
import FlowItem from './FlowItem'

/**
 * <Flow Tracker/>
 */

export default component({
  render ({ props, actions }) {
    const { steps, loading, active, onClick, ...rest } = props
    const curIndex = steps.indexOf(active)
    const hasNext = curIndex < steps.filter(Boolean).length - 1

    return (
      <Block align='start center' mt={-18}>
        <Button
          hide={!hasNext && props.new}
          onClick={onClick(steps[curIndex + 1])}
          disabled={loading}
          fontWeight='300'
          bgColor='blue'
          mb={-12}
          h={42}
          mr='l'>
          {hasNext ? (
            <Block align='center center'>
              Next<Icon name='navigate_next' />
            </Block>
          ) : (
            'Save'
          )}
        </Button>
        <Block align='center center' {...rest}>
          {steps
            .filter(step => !!step)
            .map(
              (step, i, arr) =>
                typeof step === 'string' ? (
                  <FlowItem
                    flex
                    disabled={loading}
                    isComplete={i < arr.indexOf(active)}
                    lastItem={i >= arr.length - 1}
                    active={step === active}
                    onClick={onClick}
                    i={i}
                    label={step} />
                ) : (
                  step
                )
            )}
        </Block>
      </Block>
    )
  }
})

/**
 * Imports
 */

import { component, element } from 'vdux'
import { Block, Icon } from 'vdux-ui'
import Switch from '@f/switch'
import moment from 'moment'

/**
 * <Debug Stats/>
 */

export default component({
  render ({ props }) {
    const { meta = {}, type, errors, ...rest } = props
    const { timeElapsed, runs, stepperSteps, slowdowns, moves } = meta

    return (
      <Block {...rest}>
        {Switch({
          read: () => (
            <Block column align='center' flex>
              <Stat label='Errors' icon='bug_report' value={`${errors}/3`} />
              <Stat label='Moves' icon='system_update_alt' value={moves} />
              <Stat
                icon='timer'
                label='Time'
                value={getDuration(timeElapsed)} />
            </Block>
          ),
          debug: () => (
            <Block column align='center' flex>
              <Stat label='Stepper' icon='skip_next' value={stepperSteps} />
              <Stat label='Slowdowns' icon='fast_rewind' value={slowdowns} />
            </Block>
          ),
          default: () => (
            <Block column align='center' flex>
              <Stat label='Runs' icon='play_arrow' value={runs} />
              <Stat label='Stepper' icon='skip_next' value={stepperSteps} />
              <Stat label='Slowdowns' icon='fast_rewind' value={slowdowns} />
            </Block>
          )
        })(type)}
      </Block>
    )
  }
})

const Stat = component({
  render ({ props }) {
    const { label, value = 0, icon } = props
    return (
      <Block align='start center' my='s' wide>
        <Icon name={icon} mr='s' />
        <Block flex>{label}:</Block>
        <Block>{value}</Block>
      </Block>
    )
  }
})

/**
 * Helpers
 */

function getDuration (time) {
  const duration = moment.duration(time)
  const m = Math.floor(duration.asMinutes())
  const s = Math.floor(duration.seconds())
  return `${m || '0'}m${pad(s)}s`
}

function pad (input, length = 2) {
  let str = input.toString()
  while (str.length < length) str = 0 + str
  return str
}

/**
 * Imports
 */

import ModalMessage from 'components/ModalMessage'
import { component, element } from 'vdux'
import { Block, Icon } from 'vdux-ui'
import Switch from '@f/switch'
import moment from 'moment'

/**
 * <Debug Stats Modal/>
 */

export default component({
  render ({ props }) {
    const { meta = {}, moves, type } = props
    const { timeElapsed, runs, stepperSteps, slowdowns } = meta
    const body = (
      <Block w={300} mt={-12} mb={32} mx='auto'>
        {Switch({
          read: () => (
            <Block column align='center' flex>
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

    return (
      <ModalMessage
        bgColor='#FAFAFA'
        header='Debug Stats'
        bodyProps={{ pb: '2em' }}
        body={body} />
    )
  }
})

const Stat = component({
  render ({ props }) {
    const { label, value = 0, icon } = props
    return (
      <Block
        align='start center'
        fontFamily='&quot;Press Start 2P&quot;'
        my
        fs={13}>
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

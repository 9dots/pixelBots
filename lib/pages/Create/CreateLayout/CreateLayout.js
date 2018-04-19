/**
 * Imports
 */

import initialGameState from 'utils/initialGameState'
import FlowTracker from 'components/FlowTracker'
import { component, element } from 'vdux'
import Layout from 'layouts/MainLayout'
import { Block } from 'vdux-ui'
import pick from '@f/pick'

const gameProps = Object.keys(initialGameState)

/**
 * <Create Layout/>
 */

export default component({
  render ({ props, children }) {
    const { step } = props

    return (
      <Layout
        navigation={[
          {
            category: 'create a challenge',
            title: step
              .split('')
              .map((char, i) => (i === 0 ? char.toUpperCase() : char))
              .join('')
          }
        ]}
        bodyProps={{ display: 'flex', px: '10px' }}
        titleActions={<Flow {...props} />}
        titleImg='/animalImages/teacherBot.png'>
        {children}
      </Layout>
    )
  }
})

const Flow = component({
  render ({ props, actions }) {
    const { advanced, step } = props

    return (
      <FlowTracker
        onClick={actions.clickFlowTracker}
        active={step}
        mr
        steps={[
          'options',
          'create',
          advanced ? 'solution' : 'preview',
          props.new && 'publish'
        ]} />
    )
  },
  controller: {
    * clickFlowTracker ({ context, props }, step) {
      const { validate, draftID } = props
      const { username } = context

      if (!step) {
        return yield context.setUrl(`/${username}/authored/challenges`)
      }

      if (validate) {
        const { isValid, message } = validate(props, step)
        if (!isValid) {
          return yield context.openModal({
            header: 'Hold up!',
            type: 'error',
            body: (
              <Block align='center center' mt={-12} mb='l'>
                {message}
              </Block>
            )
          })
        }
      }
      const path = props.new ? 'create' : 'edit'
      yield props.updateGame(pick(gameProps, props))
      yield context.setUrl(`/${path}/${draftID}/${step}`)
    }
  }
})

/**
 * Imports
 */

import initialGameState from 'utils/initialGameState'
import FlowTracker from 'components/FlowTracker'
import {component, element} from 'vdux'
import Layout from 'layouts/MainLayout'
import Button from 'components/Button'
import {Block, Icon} from 'vdux-ui'
import pick from '@f/pick'

const gameProps = Object.keys(initialGameState)

/**
 * <Create Layout/>
 */

export default component({
  render ({props, children}) {
    const {step, titleActions, img} = props

    return (
      <Layout
        navigation={[{
          category: 'create a challenge',
          title: step.split('').map((char, i) => i === 0 ? char.toUpperCase() : char).join('')
        }]}
        bodyProps={{display: 'flex', px: '10px'}}
        titleActions={<Flow {...props}/>}
        titleImg={img}>
        {children}
      </Layout>
    )
  }
})

const Flow = component({
  render ({props, actions}) {
    const {hasNext, advanced, step, validate} = props
    return (
      <FlowTracker
        onClick={actions.clickFlowTracker}
        active={step}
        mr
        steps={['options', 'create', advanced ? 'solution' : 'preview', props.new && 'publish']} />
    )
  },
  controller: {
    * clickFlowTracker ({context, props}, selection) {
      const {validate, draftID} = props

      if (validate) {
        const {isValid, message} = validate(props, selection)
        if (!isValid) return yield context.openModal({
          header: 'Wait',
          body: message
        })
      }
      const path = props.new ? 'create' : 'edit'
      yield props.updateGame(pick(gameProps, props))
      yield context.setUrl(`/${path}/${draftID}/${selection}`)
    }
  }
})
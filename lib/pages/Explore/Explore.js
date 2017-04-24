/**
 * Imports
 */

import PixelGradient from 'components/PixelGradient'
import FeaturedFeed from 'components/FeaturedFeed'
import MainLayout from 'layouts/MainLayout'
import {component, element} from 'vdux'
import {Block} from 'vdux-ui'
import enroute from 'enroute'


const router = enroute({
  'featured': (params, props) => <FeaturedFeed project={props.project} />,
  'shared': (params, props) => <div />
})

/**
 * <Explore/>
 */

export default component({
  render ({props}) {
    const {tab} = props

    if (!tab) return <div />

    return (
      <Block>
        <PixelGradient>
          <Block tag='h1' m='24px 0' lighter fs={55} fontFamily='"Press Start 2P"'>
            PixelBots
          </Block>
          <Block fs='xl'>EXPLORE</Block>
        </PixelGradient>
        <Block py='2em'>
          {router(tab, props)}
        </Block>
      </Block>
    )
  }
})
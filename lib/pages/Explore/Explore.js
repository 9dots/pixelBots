/**
 * Imports
 */

import PixelGradient from 'components/PixelGradient'
import FeaturedFeed from 'components/FeaturedFeed'
import MainLayout from 'layouts/MainLayout'
import {component, element} from 'vdux'
import {Block} from 'vdux-ui'
import enroute from 'enroute'


/**
 * <Explore/>
 */

export default component({
  render ({props}) {
    return (
      <Block>
        <PixelGradient>
          <Block tag='h1' m='24px 0' lighter fs={50} fontFamily='"Press Start 2P"'>
            PixelBots
          </Block>
          <Block fs='l'>EXPLORE</Block>
        </PixelGradient>
        <Block py='2em'>
          <FeaturedFeed project={props.project} />,
        </Block>
      </Block>
    )
  }
})

/**
 * Imports
 */

import FeaturedFeed from 'components/FeaturedFeed'
import MainLayout from 'layouts/MainLayout'
import {component, element} from 'vdux'
import {Block} from 'vdux-ui'
import enroute from 'enroute'
import palette from 'utils/palette'

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
    
    const rand1 = Math.floor(Math.random() * (palette.length - 1))  
    const rand2 = Math.floor(Math.random() * (palette.length - 1))

    return (
      <Block>
        <Block 
          mb='l' 
          backgroundImage={`url(http://weo.global.ssl.fastly.net/assets/pattern-16264505012933665329.png), linear-gradient(33deg, ${palette[rand1].value}, ${palette[rand2].value})`}
          transition='background-image 2s'
          color='white' 
          p='l' 
          h={370} 
          column 
          relative 
          align='center center' 
          >
          <Block relative column align='center center'>
            <Block tag='h1' m='24px 0' lighter fs={55} fontFamily='"Press Start 2P"'>
              PixelBots
            </Block>
            <Block fs='xl'>Explore</Block>
          </Block>
        </Block>
        <Block py='2em'>
          {router(tab, props)}
        </Block>
      </Block>
    )
  }
})

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
  initialState () {
    const color1 = randColor()
    let color2 = randColor()
    while(color2 === color1) {
      color2 = randColor()
    }

    return { colors: [color1, color2] }
  },
  render ({props, state}) {
    const {tab} = props
    const {colors} = state

    if (!tab) return <div />

    return (
      <Block>
        <Block 
          backgroundImage={`url(/images/pixelTrans.png), linear-gradient(33deg, ${colors[0]}, ${colors[1]})`}
          align='center center' 
          color='white' 
          relative 
          h={370} 
          column 
          mb='l' 
          p='l' 
          >
          <Block relative column align='center center'>
            <Block tag='h1' m='24px 0' lighter fs={55} fontFamily='"Press Start 2P"'>
              PixelBots
            </Block>
            <Block fs='xl'>EXPLORE</Block>
          </Block>
        </Block>
        <Block py='2em'>
          {router(tab, props)}
        </Block>
      </Block>
    )
  }
})

function randColor () {
  return palette[Math.floor(Math.random() * (palette.length - 1))].value
}
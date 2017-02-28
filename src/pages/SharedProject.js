/** @jsx element */

import DisplayCard from '../components/DisplayCard'
import element from 'vdux/element'
import {Block} from 'vdux-ui'

function render ({props, state}) {
  const {gameRef, saveRef, link} = props
  return (
    <Block wide tall align='center center'>
      <Block>
        <DisplayCard w='500px' imageSize='500px' link={link} gameRef={gameRef} saveRef={saveRef} />
      </Block>
    </Block>
  )
}

export default {
  render
}

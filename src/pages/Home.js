/** @jsx element */

import Layout from '../layouts/HeaderAndBody'
import Game from './Game'
import element from 'vdux/element'

function render ({props}) {
  return (
    <Layout
      category='sandbox'
      title='Pixel Bots'
      titleImg='/animalImages/panda.jpg'>
      <Game {...props} />
    </Layout>
  )
}

export default {
  render
}
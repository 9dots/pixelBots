/** @jsx element */

import {setUrl} from 'redux-effects-location'
import Layout from '../layouts/HeaderAndBody'
import FeaturedFeed from './FeaturedFeed'
import Tabs from '../components/Tabs'
import element from 'vdux/element'
import {Block} from 'vdux-ui'
import enroute from 'enroute'

const router = enroute({
  'featured': (params, props) => <FeaturedFeed project={props.project} />,
  'shared': (params, props) => <div />
})

function * onCreate ({props}) {
  if (!props.tab) {
    yield setUrl('/featured', true)
  }
}

function * onUpdate (prev, next) {
  if (!next.props.tab) {
    yield setUrl('/featured', true)
  }
}

function render ({props}) {
  const {tab} = props
  if (!tab) return <div />

  const titleActions = (
    <Tabs
      mt='-1em'
      tabs={['featured', 'shared']}
      onClick={(name) => setUrl(`/${name}`)} />
	)

  return (
    <Layout
      category='Pixel Bots'
      title='Explore'
      titleImg='/animalImages/panda.jpg'>
      <Block py='2em'>
        {router(tab, props)}
      </Block>
    </Layout>
  )
}

export default {
  onUpdate,
  onCreate,
  render
}

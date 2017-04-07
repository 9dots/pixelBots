/**
 * Imports
 */

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

    // const titleActions = (
    //   <Tabs
    //     mt='-1em'
    //     tabs={['featured', 'shared']}
    //     onClick={(name) => setUrl(`/${name}`)} />
  	// )

    return (
      <MainLayout
        // navigation={[{category: 'PixelBots', title: 'Explore'}]}
        // titleImg='/animalImages/panda.jpg'
        >
        <Block py='2em'>
          {router(tab, props)}
        </Block>
      </MainLayout>
    )
  }
})

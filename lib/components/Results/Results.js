/**
 * Imports
 */

import {Block} from 'vdux-ui'
import {component, element} from 'vdux'
import MainLayout from 'layouts/MainLayout'
/**
 * <Results/>
 */

export default component({
  render ({props}) {
  	const {playlist} = props
    return (
      <Block tall>
        <MainLayout
          bodyProps={{display: 'flex', px: '10px'}}
          navigation={[
            playlist && {category: 'playlist', title: playlist.title},
            {category: 'challenge', title: playlist.subtitle}
          ]}
          titleActions={playlist && playlist.actions}
          titleImg={playlist ? playlist.img : props.imageUrl}>
          <Block>
          	Test
          </Block>
        </MainLayout>
      }
      </Block>
    )
  }
})

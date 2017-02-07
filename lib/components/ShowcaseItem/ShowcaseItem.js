/**
 * Imports
 */

import {component, element} from 'vdux'
import {createAssignmentLink} from '../../../src/utils'
import {Block, Icon, Image} from 'vdux-ui'
import {Text} from 'vdux-containers'
import fire from 'vdux-fire'

/**
 * <Showcase Item/>
 */

export default fire((props) => ({
  playlist: `/playlists/${props.playlistRef}`
}))(component({
  render ({props, actions}) {
    const {playlist} = props
    const {loading, value} = playlist

    if (loading) return <span/>

    return (
      <Block w='60%' py='1em' align='start start' borderBottom='1px solid #aaa'>
        <Block w='60px'>
          <Image h='40px' w='40px' src={value.imageUrl}/>
        </Block>
        <Block flex column>
          <Block h='45px' align='start center'>
            <Text
              fs='l'
              cursor='pointer'
              hoverProps={{textDecoration: 'underline'}}
              color='link'
              onClick={actions.play()}>
              {value.name}
            </Text>
          </Block>
          <Block mb='0.5em'>
            <Text fs='s' fontWeight='400'>{value.description}</Text>
          </Block>
          <Block wide align='start center'>
            <Block mx='1em' ml='0' fs='xs' fontWeight='300' align='center center'>
              <Icon fs='xs' name='collections'/>
              <Text ml='4px'>{value.sequence.length} challenges</Text>
            </Block>
            <Block mx='1em' fs='xs' fontWeight='300' align='center center'>
              <Icon fs='xs' name='play_arrow'/>
              <Text ml='4px'>{value.plays || 0} plays</Text>
            </Block>
          </Block>
        </Block>
      </Block>
    )
  },
  controller: {
    * play ({context, props}, anonymous = true) {
      const {setUrl} = context
      const {playlistRef} = props
      createAssignmentLink(
        'playlists',
        {anonymous, ref: playlistRef},
        (code) => setUrl(`/${code}`)
      )
    }
  }
}))

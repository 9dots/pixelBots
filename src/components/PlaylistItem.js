/** @jsx element */

import IndeterminateProgress from './IndeterminateProgress'
import {setUrl} from 'redux-effects-location'
import {createAssignmentLink} from '../utils'
import {Block, Icon, Image} from 'vdux-ui'
import {Text} from 'vdux-containers'
import element from 'vdux/element'
import fire from 'vdux-fire'

function render ({props}) {
  const {playlist, playlistRef} = props
  const {loading, value} = playlist

  if (loading) return <IndeterminateProgress/>

  return (
    <Block wide py='1em' align='start start' borderBottom='1px solid #aaa'>
      <Block px='10px'>
        <Image sq='40px' src={value.imageUrl}/>
      </Block>
      <Block color='#666' flex column>
        <Block mb='4px' align='start start'>
          <Text
            transition='all 0.1s ease-in-out'
            fs='m'
            cursor='pointer'
            hoverProps={{color: 'link', textDecoration: 'underline'}}
            onClick={() => setUrl(`/playlist/${playlistRef}`)}>
            {value.name}
          </Text>
        </Block>
        <Block wide align='start center'>
          <Block mx='1em' ml='0' fs='xs' fontWeight='300' align='center center'>
            <Icon fs='xs' name='collections'/>
            <Text ml='4px'>{value.sequence ? value.sequence.length : 0} challenges</Text>
          </Block>
          <Block mx='1em' fs='xs' fontWeight='300' align='center center'>
            <Icon fs='xs' name='play_arrow'/>
            <Text ml='4px'>{value.plays || 0} plays</Text>
          </Block>
          <Block mx='1em' fs='xs' fontWeight='300' align='center center'>
            <Icon fs='xs' name='person'/>
            <Text ml='4px'>{value.creatorUsername}</Text>
          </Block>
        </Block>
      </Block>
    </Block>
  )
}

export default fire((props) => ({
  playlist: `/playlists/${props.playlistRef}`
}))({
  render
})

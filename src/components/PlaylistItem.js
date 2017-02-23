/** @jsx element */

import IndeterminateProgress from './IndeterminateProgress'
import DetailInfo from './DetailInfo'
import {setUrl} from 'redux-effects-location'
import {createAssignmentLink} from '../utils'
import {Block, Icon, Image} from 'vdux-ui'
import {Text} from 'vdux-containers'
import element from 'vdux/element'
import moment from 'moment'
import fire from 'vdux-fire'

function render ({props}) {
  const {playlist, playlistRef} = props
  const {loading, value} = playlist

  if (loading) return <IndeterminateProgress/>

  return (
    <Block bgColor='white' wide p='1em' align='start start' border='1px solid #e0e0e0' borderTopWidth='0'>
      <Block mr='20px'>
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
          <DetailInfo
            icon='collections'
            label={`${value.sequence ? value.sequence.length : 0} challenges`}/>
          <DetailInfo
            icon='play_arrow'
            label={`${value.plays || 0} plays`}/>
          <DetailInfo
            icon='person'
            onClick={() => setUrl(`/${value.creatorUsername}/authored/playlists`)}
            label={value.creatorUsername}/>
          <DetailInfo
            icon='date_range'
            label={moment(value.lastEdited).fromNow()}/>
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

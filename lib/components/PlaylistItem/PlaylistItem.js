/**
 * Imports
 */

import IndeterminateProgress from 'components/IndeterminateProgress'
import {createAssignmentLink} from '../../../src/utils'
import DetailInfo from 'components/DetailInfo'
import {Block, Icon, Image} from 'vdux-ui'
import {component, element} from 'vdux'
import {Text} from 'vdux-containers'
import fire from 'vdux-fire'
import moment from 'moment'

/**
 * <Playlist Item/>
 */

export default fire((props) => ({
  playlist: `/playlists/${props.playlistRef}`
}))(component({
  render ({props, context}) {
  	 const {
	    playlist,
	    playlistRef,
	    lastEdited,
	    clickHandler = context.setUrl(`/playlist/${playlistRef}`)
	  } = props

	  const {loading, value} = playlist

	  if (loading) return <IndeterminateProgress />

    return (
      <Block bgColor='white' wide p='1em' align='start start' border='1px solid #e0e0e0' borderTopWidth='0'>
        <Block mr='20px'>
          <Image sq='40px' src={value.imageUrl} />
        </Block>
        <Block color='#666' flex column>
          <Block mb='4px' align='start start'>
            <Text
              transition='all 0.1s ease-in-out'
              fs='m'
              cursor='pointer'
              hoverProps={{color: 'link', textDecoration: 'underline'}}
              onClick={clickHandler}>
              {value.name}
            </Text>
          </Block>
          <Block wide align='start center'>
            <DetailInfo
              icon='collections'
              label={`${value.sequence ? value.sequence.length : 0} challenges`} />
            <DetailInfo
              icon='play_arrow'
              label={`${value.plays || 0} plays`} />
            <DetailInfo
              icon='person'
              onClick={context.setUrl(`/${value.creatorUsername}/authored/playlists`)}
              label={value.creatorUsername} />
            <DetailInfo
              icon='date_range'
              label={moment(lastEdited || value.lastEdited).fromNow()} />
          </Block>
        </Block>
      </Block>
    )
  }
}))

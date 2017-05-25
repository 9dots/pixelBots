/**
 * Imports
 */

import IndeterminateProgress from 'components/IndeterminateProgress'
import DetailInfo from 'components/DetailInfo'
import ListItem from 'components/ListItem'
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
	    clickHandler = context.setUrl(`/playlist/${props.playlistRef}`)
	  } = props

    const imageSize = 90
    const {loading, value} = playlist

    if (loading) return <IndeterminateProgress />

    return (
      <ListItem mb p='1em' wide align='start stretch' onClick={clickHandler}>
        <Block mr='20px' circle={imageSize} overflow='hidden'>
          {
            value.imageUrl 
              ? <Image circle={imageSize} src={value.imageUrl} border='1px solid grey' />
              : <Block circle={imageSize} bgColor='blue' align='center center'>
                  <Icon name='view_list' fs={imageSize * .6} color='white' />
                </Block> 
          }
        </Block>
        <Block color='#666' flex column align='space-between'>
          <Block>
            <Block
              transition='all 0.1s ease-in-out'
              fs='m'
              mb='4px'
              cursor='pointer'
              hoverProps={{color: 'link', textDecoration: 'underline'}}>
              {value.name}
            </Block>
            <Block>
              {value.description}
            </Block>
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
      </ListItem>
    )
  }
}))

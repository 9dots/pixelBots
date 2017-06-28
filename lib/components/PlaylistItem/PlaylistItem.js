/**
 * Imports
 */

import IndeterminateProgress from 'components/IndeterminateProgress'
import DetailInfo from 'components/DetailInfo'
import ListItem from 'components/ListItem'
import {Block, Icon, Image} from 'vdux-ui'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import fire from 'vdux-fire'
import moment from 'moment'

/**
 * <Playlist Item/>
 */

export default fire((props) => ({
  playlist: `/playlists/${props.playlistRef}`,
  myProgress: {
    ref: `/playlistsByUser/${props.uid}/byPlaylistRef/${props.playlistRef}`,
    join: {
      ref: `/playlistInstances`,
      child: `progressValue`,
      childRef: (val, ref) => {
        return ref.child(val.instanceRef)
      }
    }
  }
}))(component({
  render ({props, context}) {
    const {
      playlist,
      myProgress,
      playlistRef,
      lastEdited,
      instanceRef,
      hideProgress
    } = props

    const base = `/playlist/${playlistRef}`
    const clickHandler = props.clickHandler
      ? props.clickHandler
      : hideProgress
        ? context.setUrl(base + '/edit')
        : context.setUrl(base + '/view')

    const imageSize = 90
    const {loading, value} = playlist

    if (loading) return <IndeterminateProgress />

    const progValue = myProgress.value ? myProgress.value.progressValue[0] : []
    const sequence = value.sequence || []
    const progress = myProgress.value ? getProgress(progValue, sequence) : 0
    const completedChallenges = progValue.completedChallenges || []
    const isComplete = parseInt(progress, 10) >= 100

    const style = isComplete && !hideProgress
      ? {bgColor: '#F6F6F6', hoverProps: {highlight: 0}, cursor: 'default'}
      : {}

    return (
      <ListItem {...style} mb p='1em' wide align='start stretch' onClick={clickHandler} hoverProps={{highlight: 0}}>
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
            <Block fs='m' mb='4px'>
              {value.name}
            </Block>
            <Block>
              {value.description}
            </Block>
          </Block>
          <Block hide={hideProgress}>
            {
              isComplete
                ? <Block bgColor='green' color='white' align='center center' borderRadius={999} maxWidth={150} lh='30px' h={30} mb={-6}>
                    <Icon name='check' mr='s' fs='s' />
                    Complete
                  </Block>
                : <Block align='start center' wide>
                    <Button bgColor='white' color='green' borderColor='green' fs='s' px='l' py='xs' mr hoverProps={{bgColor: '#f0fff6'}}>
                      Play
                    </Button>
                    <Block align='start center'  flex>
                      <Block>
                        {completedChallenges.length} of {sequence.length}
                      </Block>
                      <Block ml wide bg='divider' h={10} borderRadius={99} ellipsis relative flex mr>
                        <Block absolute top left tall bg='blue' w={progress} />
                      </Block>
                    </Block>
                  </Block>
            }
          </Block>
        </Block>
        <Block w={250} ml align='start' flexWrap='wrap'>
          <DetailInfo
            icon='collections'
            pr
            label={`${value.sequence ? value.sequence.length : 0} challenges`} />
          <DetailInfo
            icon='play_arrow'
            label={`${value.plays || 0} plays`} />
          <DetailInfo
            icon='person'
            pr
            onClick={context.setUrl(`/${value.creatorUsername}/authored/playlists`)}
            label={value.creatorUsername} />
          <DetailInfo
            icon='date_range'
            label={moment(lastEdited || value.lastEdited).fromNow()} />
        </Block>
      </ListItem>
    )
  }
}))

function getProgress (progress, sequence) {
  return (getLength(progress.completedChallenges) / getLength(sequence) * 100) + '%'
}

function getLength (arr) {
  return (arr || []).length
}

/**
 * Imports
 */

import IndeterminateProgress from 'components/IndeterminateProgress'
import DetailInfo from 'components/DetailInfo'
import ListItem from 'components/ListItem'
import PinIcon from 'utils/icons/pin'
import {Block, Icon, Image} from 'vdux-ui'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import strip from 'remove-markdown'
import fire from 'vdux-fire'

/**
 * <Playlist Item/>
 */

export default fire((props) => ({
  playlist: `/playlists/${props.playlistRef}`,
  myProgress: {
    ref: `/playlistsByUser/${props.uid}/byPlaylistRef/${props.playlistRef}`,
    join: {
      ref: '/playlistInstances',
      child: 'completedChallenges',
      childRef: (val, ref) => ref.child(val.instanceRef).child('completedChallenges')
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
      hideProgress,
      assigned,
      pinned,
      ...rest
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

    const progValue = myProgress.value ? myProgress.value.completedChallenges : []
    const sequence = value.sequence || []
    const progress = myProgress.value ? getProgress(progValue, sequence) : 0
    const isComplete = props.isComplete || parseInt(progress, 10) >= 100

    const style = isComplete && !hideProgress
      ? {bgColor: '#F6F6F6', hoverProps: {highlight: 0}, cursor: 'default'}
      : {}

    return (
      <ListItem {...style} mb p={13} wide align='start stretch' onClick={clickHandler} hoverProps={{highlight: 0}} relative {...rest}>
        <Block mr='20px' w={imageSize} overflow='hidden' align='center center'>
          {
            value.imageUrl
              ? <Image circle={imageSize} src={value.imageUrl} border='1px solid grey' />
              : <Block circle={imageSize} bgColor='blue' align='center center'>
                  <Icon name='view_list' fs={imageSize * 0.6} color='white' />
                </Block>
          }
        </Block>
        <Block color='#666' flex column align='space-between'>
          <Block>
            <Block fs='m'>
              {value.name}
            </Block>
            <Block overflowY='hidden' h='2.6em' my='s'>
              {strip(value.description)}
            </Block>
            <Block hide={!pinned} sq={60} absolute top right>
              <Block
                sq={60}
                border='30px solid transparent'
                borderTopColor='red'
                borderRightColor='red'
                />
              <PinIcon absolute top right h={30} mt={5} mr={2} />
            </Block>
          </Block>
        </Block>
        <Block w={270} h={90} ml column align='space-around'>
          <Block wide align='start center'>
            <DetailInfo
              icon='collections'
              pr
              label={`${value.sequence ? value.sequence.length : 0} challenges`} />
            <DetailInfo
              icon='person'
              pr
              onClick={context.setUrl(`/${value.creatorUsername}/authored/playlists`)}
              label={value.creatorUsername} />
          </Block>
          <Block hide={hideProgress}>
            {
              isComplete
                ? <Block align='center center' color='white' bgColor='green' h={30} w={130} pill lh='30px'>
                    <Icon name='check' fs='s' color='white' mr='s' />
                    Complete
                  </Block>
                : <Block align='start center' wide>
                    <Block align='start center' flex>
                      <Button px='20' py='5' fs='s' borderColor='blue' color='blue' bgColor='white' hoverProps={{highlight: 0.02}} focusProps={{highlight: 0.02}}>
                        Play
                      </Button>
                      <Block wide bg='#DADADA' h={25} borderRadius={99} ellipsis relative flex align='center center' mx>
                        <Block absolute top left tall bg='blue' w={progress} />
                        <Block color='white' fs='xs' z={1} relative bold>
                          {progValue.length || 0} of {sequence.length}
                        </Block>
                      </Block>
                    </Block>
                  </Block>
            }
          </Block>
        </Block>
      </ListItem>
    )
  }
}))

function getProgress (completedChallenges, sequence) {
  return (getLength(completedChallenges) / getLength(sequence) * 100) + '%'
}

function getLength (arr) {
  return (arr || []).length
}

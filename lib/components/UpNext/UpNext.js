/**
 * Imports
 */

import PixelGradient from 'components/PixelGradient'
import GameButton from 'components/GameButton'
import {Block, Image, Icon} from 'vdux-ui'
import {component, element} from 'vdux'
import fire from 'vdux-fire'

/**
 * <Up Next/>
 */

const btnProps = {
	fs: 'm',
	p: '18px 24px 15px',
	bgColor: 'green',
  minWidth: 180,
  fontFamily: '"Press Start 2P"'
}

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
  	const {playlist, game, playlistRef, instanceRef, current, myProgress} = props
  	const {value, loading} = playlist

  	if (loading || !value) return <span />
  	const imageSize = 200
    const {imageUrl, description, name} = value
  
    const completed = myProgress.value.progressValue[0]
    const sequence = value.sequence
    
    const progress = myProgress.value
        ? getProgress(completed, sequence)
        : 0

    const length = sequence.length

    return (
    	<Block mb='l' mt color='primary'>
    		<Block align='start stretch' p border='1px solid divider' bgColor='white'>
          <Block minWidth={imageSize}>
	    			{
              value.imageUrl 
                ? <Image circle={imageSize} src={imageUrl} border='1px solid grey' />
                : <Block circle={imageSize} bgColor='blue' align='center center'>
                    <Icon name='view_list' fs={imageSize * .6} color='white' />
                  </Block>
          	}
          </Block>
          <Block color='#666' flex column align='space-between' mx='l' my='s'>
              <Block
                fontFamily='"Press Start 2P"'
                fs='m'>
                {name}
              </Block>
              <Block fs='m'>
                {description}
              </Block>
              <Block align='start center'>
                <GameButton {...btnProps} onClick={context.setUrl(`/playlist/${playlistRef}/play/${instanceRef}/${current}`)} mr>
                  CONTINUE
                </GameButton>
                <GameButton {...btnProps} bgColor='blue' onClick={context.setUrl(`/playlist/${playlistRef}`)} mr='l'>
                  OPEN
                </GameButton>
                <Block flex>
                  <Block fontFamily='"Press Start 2P"' fs='xs' mb>
                    Progress: {completed.completedChallenges.length || 0} of {length}
                  </Block>
                  <Block wide bg='divider' h={20} borderRadius={99} ellipsis relative>
                    <Block absolute top left tall bg='blue' w={progress} />
                  </Block>
                </Block>
              </Block>
          </Block>
    		</Block>
    	</Block>
    )
  }
}))

function getProgress (progress, sequence) {
  return (getLength(progress.completedChallenges) / getLength(sequence) * 100) + '%'
}

function getLength (arr) {
  return (arr || []).length
}

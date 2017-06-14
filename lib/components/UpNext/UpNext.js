/**
 * Imports
 */

import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import {Block, Image, Icon} from 'vdux-ui'
import PixelGradient from 'components/PixelGradient'
import fire from 'vdux-fire'

/**
 * <Up Next/>
 */

const btnProps = {
	fs: 'm',
	p: '12px 24px',
	bgColor: 'green'
}

export default fire((props) => ({
  playlist: {
  	ref: `/playlists/${props.playlistKey}`,
  	join: {
  		ref: '/games',
  		child: 'gameVal',
  		childRef: function(val, ref) {
  			// XXX remove "noop on" with updated vdux-fire fix
  			return val
  				? ref.child(val.sequence[props.current]).child('meta')
  				: {on: function() {}}
  		}
  	}
  }
}))(component({
  render ({props, context}) {
  	const {playlist, game, playlistKey, current} = props
  	const {value, loading} = playlist

  	if (loading || !value) return <span />
  		console.log(value)


  	const gameValue = value.gameVal[0]
  	const {imageUrl, description, title} = value
  	const length = value.sequence.length
  	const imageSize = 200

    return (
    	<Block>
	    	<Block borderBottom='1px solid divider' pb='l' mb='l' mt color='primary'>
	    		<Block align='start stretch' p border='1px solid divider' bgColor='white'>
	    			{
            value.imageUrl 
              ? <Image circle={imageSize} src={value.imageUrl} border='1px solid grey' />
              : <Block circle={imageSize} bgColor='blue' align='center center'>
                  <Icon name='view_list' fs={imageSize * .6} color='white' />
                </Block> 
          	}
		    		<Image border='1px solid divider' src={gameValue.imageUrl} sq={100} mr='l' />
		    		<Block column align='space-between start'>
		    			<Block column align='center start'>
		    				<Block bold fs='l' mb>{gameValue.title}</Block>
		    				<Block fs='m'>{gameValue.description}</Block>
		    			</Block>
		    			<Block align='start'>
			    			<Button {...btnProps} onClick={context.setUrl(`/playlist/${playlistKey}/${current}`)} mr>
			    				Continue Challenge
			    			</Button>
			    			<Button {...btnProps} bgColor='#FAFAFA' hoverProps={{highlight: 0.02}} focusProps={{highlight: 0.02}} color='primary' onClick={context.setUrl(`/playlist/${playlistKey}/${current + 1}`)} disabled={current + 1 >= length}>
			    				Skip
			    				<Icon ml='s' fs='l' name='skip_next' />
			    			</Button>
		    			</Block>
		    		</Block>
	    		</Block>
	    	</Block>
    	</Block>
    )
  }
}))

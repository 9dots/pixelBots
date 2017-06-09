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
  		childRef: (val, ref) => ref.child(val.sequence[props.current])
  	}
  }
}))(component({
  render ({props}) {
  	const {playlist, game} = props
  	const {value, loading} = playlist

  	console.log('value', value)
  	if (loading) return <span />

  	const {imageUrl, description, title} = gameValue

    return (
    	<Block>
	    	<Block borderBottom='1px solid divider' pb='l' mb='l' mt color='primary'>
	    		<Block align='start stretch' p border='1px solid divider' bgColor='white'>
		    		<Image border='1px solid divider' src={imageUrl} sq={200} mr='l' />
		    		<Block column align='space-between start'>
		    			<Block column align='center start'>
		    				<Block bold fs='l' mb>{title}</Block>
		    				<Block fs='m'>{description}</Block>
		    			</Block>
		    			<Block align='start'>
			    			<Button {...btnProps} mr>
			    				Continue Challenge
			    			</Button>
			    			<Button {...btnProps} bgColor='#FAFAFA' hoverProps={{highlight: 0.02}} focusProps={{highlight: 0.02}} color='primary'>
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

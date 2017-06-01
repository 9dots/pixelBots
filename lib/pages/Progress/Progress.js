/**
 * Imports
 */

import PixelGradient from 'components/PixelGradient'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import {Block, Icon} from 'vdux-ui'

/**
 * <Progress/>
 */

const btnProps = {
	fs: 'l',
	p: '12px 24px',
	bgColor: 'blue',
	boxShadow: '0px 1px 3px rgba(0,0,0,.5)'
}

export default component({
  render ({props}) {
    return (
    	<Block>
    		<PixelGradient h={470}>
    			<Block fontFamily='"Press Start 2P"' fs='l'>
    				Conditionals with Loops
    			</Block>
    			<Block my='m' bgImg='animalImages/teacherBot.png' sq='200' bgSize='cover' border='1px solid divider' />
    			<Block mb='l' fs='l'>
    				Going In Circles
    			</Block>
    			<Block align='start center'>
	    			<Button mr {...btnProps}>
	    				Start Activity
	    			</Button>
	    			<Button {...btnProps} bgColor='white' color='primary'>
	    				Skip
	    				<Icon name='navigate_next' />
	    			</Button>
    			</Block>
    		</PixelGradient>
    		Progress
    	</Block>
    )
  }
})

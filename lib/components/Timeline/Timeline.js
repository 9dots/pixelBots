/**
 * Imports
 */

import {Button, CSSContainer, wrap} from 'vdux-containers'
import {component, element, stopPropagation} from 'vdux'
import {Block, Icon} from 'vdux-ui'
import times from '@f/times'

/**
 * <Timeline/>
 */

export default component({
  render ({props}) {
  	const numBlocks = 14
    return (
    	<Block 
    		boxShadow='inset 0 0 6px rgba(black, .1)' 
    		border='1px solid divider' 
    		borderRightWidth={0}
    		align='start stretch' 
    		bgColor='#EEE' 
    		h={50}>
    		{
    			times(numBlocks, (i) => <Frame i={i} numBlocks={numBlocks} {...props} />)
    		}
    	</Block>
    )
  }
})


const Frame = wrap(CSSContainer, {
	hoverProps: {
		hovering: true
	}
})(component({
	render ({props}) {
		const {frames, i, frameNumber, onClick, remove, hovering, numBlocks, ...rest} = props
		const thresh = 2
		const delta = numBlocks - frameNumber
		const offset = delta < thresh ? (thresh - delta) : 0
		const cur = i + offset
		const isCurrent = cur === frameNumber
		const curProps = isCurrent
			? {
					bgColor: 'blue',
					borderColor: 'transparent',
					transform: 'scale(1.2)',
					boxShadow: '0 0 2px rgba(black, .3), inset 0 0 0 1px rgba(0,0,0, .1)',
					color: 'white',
					z: '1'
				}
			: {}
		const isActive = cur < frames.length

		return(
			<Block 
				bgColor={isActive ? 'white' : 'transparent'}
				borderRight='1px solid divider' 
				onClick={isActive && onClick(cur)}
				align='center end'
				userSelect='none'
				cursor='default'
				minWidth={16} 
				relative
				flex
				fs='10'
				pb='s'
				{...curProps}>
				<Button 
					onClick={[remove, stopPropagation]} 
					boxShadow='0 0 3px rgba(0,0,0,.2)'
					border='1px solid white'
					hide={!isCurrent || !hovering} 
					circle={16} 
					absolute 
					mr={-8} 
					mt={-5}
					right
					top>
						<Icon name='close' fs='10' />
				</Button>
				{isActive ? cur + 1 : ''}
				</Block>
			)
	}
}))



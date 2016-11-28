import omit from '@f/omit'
import GameLoader from './GameLoader'
import element from 'vdux/element'
import fire from 'vdux-fire'
import Button from '../components/Button'
import {Block, Text} from 'vdux-ui'

function render ({props}) {
	const isNext = props.current + 1 < props.sequence.length
	const isPrev = props.current - 1 >= 0
	return (
		<Block>
			<Block wide align='space-between center' relative mb='20px'>
				<Block>
					<Text display='block' fs='xxl' color='#555' fontWeight='500'>{props.name}</Text>
				</Block>
				<Block>
					<Button bgColor={isPrev ? 'primary' : 'disabled'} mr='1em' disabled={!isPrev} onClick={props.prev}>PREV</Button>
					<Button bgColor={isNext ? 'primary' : 'disabled'} disabled={!isNext} onClick={props.next}>NEXT</Button>
				</Block>
			</Block>
			<GameLoader gameCode={props.sequence[props.current]} saveID={props.saveIds[props.current]} {...omit('saveID', props)}/>
		</Block>
	)
}

export default {
	render
}
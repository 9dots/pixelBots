import omit from '@f/omit'
import GameLoader from './GameLoader'
import element from 'vdux/element'
import fire from 'vdux-fire'
import Button from '../components/Button'
import {Block, Icon, Text} from 'vdux-ui'

function render ({props}) {
	const isNext = props.current + 1 < props.sequence.length
	const isPrev = props.current - 1 >= 0

	return (
		<Block absolute top='0px' left='0px' wide tall column>
			<Block px='16px' bgColor='white' relative left='0' top='0' borderBottom='2px solid #ccc' wide align='space-between center' py='1em'>
        {
          isPrev
            ? <Button
                px='0'
                w='40px'
                align='center center'
                borderWidth='0'
                bgColor='white'
                mr='1em'
                color='#333'
                onClick={props.prev}>
                <Icon name='arrow_back'/>
              </Button>
            : <Block w='40px'/>
        }
        <Text flex fontWeight='300' fs='xl'>{props.name}</Text>
        <Text fs='m' mr='2em'>{props.current + 1} / {props.sequence.length}</Text>
       	{
       		isNext
       			? <Button bgColor='green' w='160px' onClick={props.next}>NEXT</Button>
       			: <Block w='160px'/>
       	}
     	</Block>
     	<Block flex p='16px' relative>
				<GameLoader gameCode={props.sequence[props.current]} saveID={props.saveIds[props.current]} {...omit('saveID', props)}/>
			</Block>
		</Block>
	)
}

export default {
	render
}
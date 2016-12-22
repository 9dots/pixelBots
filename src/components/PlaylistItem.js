import {MenuItem, Image} from 'vdux-containers'
import element from 'vdux/element'
import fire, {refMethod} from 'vdux-fire'
import {Block, Box, Icon} from 'vdux-ui'
import Level from './Level'

function render ({props}) {
	const {game, playlistKey, mine, isTarget=false, listActions} = props
	const {dragEnter, dragExit, dragStart, dragEnd, drop} = listActions

	if (props.ref === undefined) {
		console.log(props.ref, game)
	}

	return (
		<MenuItem
			draggable={mine}
			onDragEnter={handleDragEnter}
			onDragOver={(e) => e.preventDefault()}
			onDragStart={() => dragStart(props.ref)}
			onDrop={handleDrop}
			relative
			cursor={mine ? 'move' : 'default'}
			fontWeight='300'
			bgColor={isTarget ? 'lightblue' : '#e5e5e5'}
			borderTop='1px solid #999'>
			<Block visibility={isTarget ? 'hidden' : 'visible'} align='start center'>
				<Image display='block' sq='50px' src={game.imageUrl}/>
	      <Box flex minWidth='200px' ml='2em'>
					{game.title}
				</Box>
				<Box w='160px' mr='2em'>
					<Block align='start center'>
						<Image mr='1em' sq='40px' src={`/animalImages/${game.animals[0].type}.jpg`}/>
						{game.animals[0].type}
					</Block>
				</Box>
				<Box w='160px' mr='2em'>
					{game.inputType}
				</Box>
				{mine && <Box absolute lineHeight='0' right='2em'>
					<Icon name='delete' onClick={removeFromPlaylist}/>
				</Box>}
			</Block>
		</MenuItem>
	)

	function * handleDragEnd (e) {
		yield e.preventDefault()
		yield e.stopPropagation()
		yield dragEnd(props.idx)
	}

	function * handleDrop (e) {
		yield e.preventDefault()
		yield drop(props.idx)
	}

	function * handleDragEnter (e) {
		yield e.preventDefault()
		yield dragEnter(props.ref)
	}

	function * removeFromPlaylist () {
		yield refMethod({
			ref: `/playlists/${playlistKey}`,
			updates: {
				method: 'transaction',
				value: (val) => {
					return {
						...val,
						sequence: val.sequence.filter((ref) => ref !== props.ref)
					}
				}
			}
		})
	}
}


export default {
	render
}
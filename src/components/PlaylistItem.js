import {MenuItem, Image} from 'vdux-containers'
import element from 'vdux/element'
import fire, {refMethod} from 'vdux-fire'
import {Block, Box, Icon} from 'vdux-ui'
import Level from './Level'

function render ({props}) {
	const {game, playlistKey, mine	} = props

	if (game.loading) return <div/>

	const gameVal = game.value

	return (
		<MenuItem fontWeight='800' align='start center' bgColor='transparent' borderTop='1px solid #999'>
			<Level
        editMode
        animals={[]}
        painted={gameVal.targetPainted}
        levelSize='50px'
        hideBorder
        w='auto'
        h='auto'
        numRows={gameVal.levelSize[0]}
        numColumns={gameVal.levelSize[1]}/>
      <Box flex ml='2em'>
				{gameVal.title}
			</Box>
			<Box w='160px' mr='2em'>
				<Block align='start center'>
					<Image mr='1em' sq='40px' src={`/animalImages/${gameVal.animals[0].type}.jpg`}/>
					{gameVal.animals[0].type}
				</Block>
			</Box>
			<Box w='160px' mr='2em'>
				{gameVal.inputType}
			</Box>
			{mine && <Box>
				<Icon name='delete' onClick={removeFromPlaylist}/>
			</Box>}
		</MenuItem>
	)

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

export default fire((props) => ({
  game: {
  	ref: `/games/${props.ref}`,
    updates: [
      {method: 'orderByKey'},
      {method: 'limitToFirst', value: 50}
    ]
  }
}))({
	render
})
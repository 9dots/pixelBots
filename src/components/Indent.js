import element from 'vdux/element'
import {Block} from 'vdux-ui'

function render ({props}) {
	const {level} = props
	console.log(level)
	return (
		<Block align='center'>
			{Array.from(Array(level)).map(() => <Block tall {...props}/>)}
		</Block>
	)
}

export default {
	render
}
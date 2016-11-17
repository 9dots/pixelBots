import element from 'vdux/element'
import IndeterminateProgress from '../components/IndeterminateProgress'
import createCode from '../utils'
import fire from 'vdux-fire'

function render ({props}) {
	const {list} = props
	if (list.loading) return <IndeterminateProgress/>
	const listVal = list.value

	console.log(listVal)
	return (
		<div/>
	)
}

export default fire((props) => ({
  list: `/savedList/${props.ref}`
}))({
	render
})
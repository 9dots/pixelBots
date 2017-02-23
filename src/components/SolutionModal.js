import ModalMessage from './ModalMessage'
import element from 'vdux/element'
import setModal from '../actions'
import fire from 'vdux-fire'

function render ({props}) {
	return (
		<div/>
	)
}

function getProps (props, context) {
  return {
    ...props,
    username: context.username,
    user: context.currentUser
  }
}

export default fire((props) => ({
	inProgress: `/users/${props.user.uid}/inProgress`
}))({
	getProps,
	render
})
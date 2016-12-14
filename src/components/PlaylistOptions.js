import {Block, Dropdown, MenuItem} from 'vdux-containers'
import {setUrl} from 'redux-effects-location'
import ConfirmDelete from './ConfirmDelete'
import createAction from '@f/create-action'
import {Icon, Menu} from 'vdux-ui'
import {refMethod} from 'vdux-fire'
import {createCode} from '../utils'
import element from 'vdux/element'
import Button from './Button'

const openModal = createAction('<PlaylistOptions/>: OPEN_MODAL')
const closeModal = createAction('<PlaylistOptions/>: CLOSE_MODAL')

const initialState = ({local}) => ({
  open: false,
  actions: {
  	openModal: local(openModal),
  	closeModal: local(closeModal)
  }
})

function render ({props, state}) {
	const {activeKey, name, uid, setModal, unfollow, followed, follow} = props
	const {actions, open} = state
	const btn = (
		<MenuItem bgColor='#e5e5e5' focusProps={{highlight: true}} ml='1em' align='center center' circle='40px'>
			<Icon name='more_vert'/>
		</MenuItem>
	)
	const followButton = followed
		? <Button onClick={unfollow} bgColor='transparent' color='#666' border='1px solid #666'>Unfollow</Button>
		: <Button bgColor='primary' onClick={follow}>Follow</Button>

	return (
		<Block align='center center'>
			<Button mr='5px' bgColor='red' onClick={play}>Play</Button>
			<Button mr='5px' bgColor='green' onClick={assign}>Assign</Button>
			{followButton}
			<Dropdown btn={btn} zIndex='999'>
				<Menu column zIndex='999'>
					<MenuItem onClick={(e) => assign(e, true)}>Assign Anonymous</MenuItem>
				</Menu>
			</Dropdown>
			{open && <ConfirmDelete header='Unfollow Playlist?' message={`unfollow the playlist ${name}?`} dismiss={actions.closeModal} action={unfollow}/>}
		</Block>
	)

	function * play (e, anonymous = true) {
		const code = yield * createLink(anonymous)
		yield setUrl(`/${code}`)
	}

	function * assign (e, anonymous = false) {
		const code = yield * createLink(anonymous)
		yield refMethod({
			ref: `/assignments/`,
			updates: {
				method: 'push',
				value: {
					name: name,
					creatorID: uid
				}
			}
		})
		yield setModal(code)
	}

	function * createLink (anonymous) {
		const code = yield createCode()
		yield refMethod({
			ref: `/links/${code}`,
			updates: {
				method: 'set',
				value: {
					type: 'playlists',
					payload: {
						anonymous,
						ref: activeKey
					}
				}
			}
		})
		return code
	}
}

function reducer (state, action) {
  switch (action.type) {
    case openModal.type:
      return {
        ...state,
        open: true
      }
    case closeModal.type:
      return {
        ...state,
        open: false
      }
  }
  return state
}

export default {
	initialState,
	reducer,
	render
}
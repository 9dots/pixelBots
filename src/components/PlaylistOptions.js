import {Block, Dropdown, MenuItem} from 'vdux-containers'
import ConfirmDelete from './ConfirmDelete'
import {Icon, Menu} from 'vdux-ui'
import {refMethod} from 'vdux-fire'
import {createCode} from '../utils'
import element from 'vdux/element'
import Button from './Button'
import createAction from '@f/create-action'

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
	const {activeKey, name, uid, setModal, unfollow} = props
	const {actions, open} = state
	const btn = <MenuItem bgColor='#e5e5e5' focusProps={{highlight: true}} ml='1em' align='center center' circle='40px'>
								<Icon name='more_vert'/>
							</MenuItem>
	return (
		<Block align='center center'>
			<Button onClick={assign}>Assign</Button>
			<Dropdown btn={btn}>
				<Menu column>
					<MenuItem onClick={(e) => assign(e, true)}>Assign Anonymous</MenuItem>
					<MenuItem onClick={actions.openModal}>Unfollow</MenuItem>
				</Menu>
			</Dropdown>
			{open && <ConfirmDelete header='Unfollow Playlist?' message={`unfollow the playlist ${name}?`} dismiss={actions.closeModal} action={unfollow}/>}
		</Block>
	)

	function * assign (e, anonymous = false) {
		console.log(anonymous)
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
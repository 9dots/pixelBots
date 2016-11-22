import PlaylistItem from '../components/PlaylistItem'
import {Block, Menu, Text} from 'vdux-ui'
import ModalMessage from '../components/ModalMessage'
import Button from '../components/Button'
import {createCode} from '../utils'
import element from 'vdux/element'
import {refMethod} from 'vdux-fire'
import {Input} from 'vdux-containers'
import createAction from '@f/create-action'

const setModal = createAction('<PlaylistView/>: setModal')

const initialState = ({local}) => ({
	modal: '',
	actions: {
		setModal: local((modal) => setModal(modal))
	}
})

const url = window.location.host + '/'

function render ({props, state}) {
	const {playlist, activeKey, mine} = props
	const {sequence, name} = playlist
	const {modal, actions} = state

	const modalFooter = (
	  <Block>
	    <Button ml='m' onClick={() => actions.setModal('')}>Done</Button>
	  </Block>
	)

	return (
		<Block flex ml='10px' maxHeight='calc(100vh - 142px)' overflowY='auto'>
			<Block align='space-between center' p='10px'>
				<Block>
					<Text display='block' fs='xs' color='#777' fontWeight='300'>PLAYLIST</Text>
					<Text display='block' fs='xxl' color='#555' fontWeight='500'>{name}</Text>
				</Block>
				<Block>
					<Button onClick={assign}>Assign</Button>
				</Block>
			</Block>
			<Menu overflowY='auto' column>
				{sequence.map((challenge) => <PlaylistItem playlistKey={activeKey} mine={mine} ref={challenge}/>)}
			</Menu>
			{modal && <ModalMessage
        header='Link to Playlist'
        body={<Input
          readonly
          inputProps={{p: '12px', borderWidth: '2px', border: '#ccc'}}
          id='url-input'
          fs='18px'
          onFocus={() => document.getElementById('url-input').children[0].select()}
          value={`http://${url}${modal}`}>
          {`${url}${modal}`}
        </Input>}
        footer={modalFooter}/>
      }
		</Block>
	)

	function * assign () {
		const code = yield createCode()
		yield refMethod({
			ref: `/links/${code}`,
			updates: {
				method: 'set',
				value: {
					type: 'playlists',
					payload: activeKey
				}
			}
		})
		yield actions.setModal(code)
	}
}

function reducer (state, action) {
	switch (action.type) {
		case setModal.type:
			return {
				...state,
				modal: action.payload
			}
	}
	return state
}

export default {
	initialState,
	reducer,
	render
}
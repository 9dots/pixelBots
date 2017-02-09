/** @jsx element */

import Loading from '../components/Loading'
import DescriptionModal from '../components/DescriptionModal'
import {setItem, getItem} from 'redux-effects-localStorage'
import {setSaveId, setGameId} from '../actions'
import handleActions from '@f/handle-actions'
import {setUrl} from 'redux-effects-location'
import Layout from '../layouts/HeaderAndBody'
import createAction from '@f/create-action'
import fire, {refMethod} from 'vdux-fire'
import {createCode} from '../utils'
import element from 'vdux/element'
import {Block} from 'vdux-ui'
import omit from '@f/omit'
import Game from './Game'

const showModal = createAction('<GameLoader/>: SHOW_MODAL')
const hideModal = createAction('<GameLoader/>: HIDE_MODAL')
const setLoading = createAction('<GameLoader/>: SET_LOADING')
const setLocalDescription = createAction('<GameLoader/>: SET_LOCALDESCRIPTION')

const initialState = ({local}) => ({
  loading: true,
  show: false,
  actions: {
    setLoading: local(setLoading),
    setDescription: local(setLocalDescription)
  }
})

function * onCreate ({props, state, local}) {
  if (props.noSave) {
    const localStorageKey = `pixelBots-game-${props.gameCode}`
    yield state.actions.setLoading()
    yield setGameId(props.gameCode)
    const description = yield getItem(localStorageKey)
    yield state.actions.setDescription(description)
    yield setSaveId(null)
    return
  }
  if (props.saveID) {
    yield state.actions.setLoading()
    yield setGameId(props.gameCode)
    return yield setSaveId(props.saveID)
  } else {
    yield createNewSave(props.gameCode, props.user)
  }
}

function * onUpdate (prev, next) {
  if (!next.props.noSave && next.props.saveID !== prev.props.saveID) {
    yield setSaveId(next.props.saveID)
  }
}

function render ({props, state, local}) {
  const {gameVal, savedProgress, playlist, username, user} = props
  const {loading, description, show} = state

  if (gameVal.loading || (props.saveID && savedProgress.loading) || loading) {
    return <Loading />
  }

  const mergeGameData = {...gameVal.value, ...savedProgress.value}

  const game = <Block wide tall>
    <Game
    mine={props.mine}
    initialData={mergeGameData}
    gameData={gameVal.value}
    {...omit(['gameVal, savedProgress'], props)}
    left='60px' />
    <DescriptionModal
      show={show}
      dismiss={local(hideModal)}
      title={gameVal.value.title}
      saveDocumentation={saveDocumentation(props.gameID, props.saveID)}
      content={(!!savedProgress.value && savedProgress.value.description) || description || gameVal.value.description}/>
  </Block>
  const gameLayout = <Layout
    bodyProps={{display: 'flex'}}
    navigation={[{category: 'challenge', title: mergeGameData.title, onClick: local(showModal)}]}
    titleImg={mergeGameData.imageUrl}>
    {game}
  </Layout>

  return <Block absolute tall wide>
    {playlist ? getPlaylistLayout() : gameLayout}
  </Block>

  function saveDocumentation (gameID, saveID) {
    const localStorageKey = `pixelBots-game-${gameID}`
    return function * (description) {
      if (saveID) {
        yield refMethod({
          ref: `/saved/${saveID}`,
          updates: {
            method: 'update',
            value: {
              description
            }
          }
        })
      } else {
        yield setItem(localStorageKey, description)
        yield state.actions.setDescription(description)
      }
    }
  }

  function getPlaylistLayout () {
    return <Layout
      navigation={[
        {category: 'playlist', title: playlist.title},
        {category: 'challenge', title: mergeGameData.title, onClick: local(showModal)}
      ]}
      bodyProps={{display: 'flex'}}
      titleActions={playlist.actions}
      titleImg={playlist.img}>
      {game}
    </Layout>
  }
}

function * createNewSave (gameCode, user) {
  const code = yield createCode()
  const saveRef = yield refMethod({
    ref: '/saved/',
    updates: {
      method: 'push',
      value: ''
    }
  })
  yield refMethod({
    ref: `/links/${code}`,
    updates: {
      method: 'set',
      value: {
        type: 'saved',
        payload: {
          saveRef: `${saveRef.key}`,
          gameRef: `${gameCode}`
        }
      }
    }
  })
  if (!user.isAnonymous) {
    yield refMethod({
      ref: `/users/${user.uid}/inProgress`,
      updates: {
        method: 'push',
         value: {
          saveRef: saveRef.key,
          gameRef: gameCode,
          saveLink: code
        }
      }
    })
  }
  yield setUrl(`/${code}`, true)
}

const reducer = handleActions({
  [setLoading.type]: (state) => ({...state, loading: false}),
  [setLocalDescription.type]: (state, description) => ({...state, description}),
  [showModal.type]: (state) => ({...state, show: true}),
  [hideModal.type]: (state) => ({...state, show: false})
})

function getProps (props, context) {
  return {
    ...props,
    username: context.username,
    user: context.currentUser
  }
}

export default fire((props) => {
  const savedProgress = props.saveID ? `/saved/${props.saveID}` : null
  return {
    gameVal: `/games/${props.gameCode}`,
 		savedProgress
  }
})({
  initialState,
  getProps,
  onCreate,
  onUpdate,
  reducer,
  render
})

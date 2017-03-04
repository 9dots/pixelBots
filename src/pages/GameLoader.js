/** @jsx element */

import {setSaveId, setGameId, reset, refresh} from '../actions'
import DescriptionModal from '../components/DescriptionModal'
import {setItem, getItem} from 'redux-effects-localStorage'
import handleActions from '@f/handle-actions'
import {setUrl} from 'redux-effects-location'
import Layout from '../layouts/HeaderAndBody'
import Loading from '../components/Loading'
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
const setLocalDescription = createAction('<GameLoader/>: SET_LOCAL_DESCRIPTION')

const initialState = ({local}) => ({
  loading: true,
  show: false,
  actions: {
    setLoading: local(setLoading),
    setDescription: local(setLocalDescription)
  }
})

function * onCreate ({props}) {
  if (props.completed) {
    yield setGameId(props.gameCode)
    yield setSaveId(props.completed)
  }
}

function * onUpdate (prev, {props, state}) {
  if (!props.inProgress.loading && !props.completed) {
    if (props.inProgress.value && props.inProgress.value[props.gameCode]) {
      yield setGameId(props.gameCode)
      yield setSaveId(props.inProgress.value[props.gameCode].saveRef)
    } else {
      yield createNewSave(props.gameCode, props.uid, props.username, props.saveID)
    }
  }
  if (props.completed && !props.saveID) {
    yield setGameId(props.gameCode)
    yield setSaveId(props.completed)
  }
}

function render ({props, state, local}) {
  const {gameVal, savedProgress, playlist, username, uid, saveID, gameCode} = props
  const {loading, description, show} = state

  if (gameVal.loading || !savedProgress || savedProgress.loading) {
    return <Loading />
  }

  const mergeGameData = {...gameVal.value, ...savedProgress.value}

  const game = <Block wide tall>
    <Game
      mine={props.mine}
      onRun={onRun(uid, saveID, gameCode)}
      initialData={mergeGameData}
      gameData={gameVal.value}
      {...omit(['gameVal, savedProgress'], props)}
      left='60px' />
    <DescriptionModal
      show={show}
      dismiss={local(hideModal)}
      title={gameVal.value.title}
      saveDocumentation={saveDocumentation(props.gameID, props.saveID)}
      content={description || gameVal.value.description} />
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

function onRun (uid, saveID, gameID) {
  return function * (code) {
    if (uid && saveID) {
      yield refMethod({
        ref: '/queue/tasks',
        updates: {
          method: 'push',
          value: {
            _state: 'on_run',
            userID: uid,
            saveID,
            gameID,
            code
          }
        }
      })
    }
  }
}

function * createNewSave (gameCode, uid, username, type, saveID) {
  const code = yield createCode()
  let saveRef
  if (!saveID) {
    saveRef = yield refMethod({
      ref: '/saved/',
      updates: {
        method: 'push',
        value: {
          username
        }
      }
    })
  }
  const saveKey = saveID || saveRef.key
  yield refMethod({
    ref: `/users/${uid}/inProgress/${gameCode}`,
    updates: {
      method: 'set',
      value: {
        saveRef: saveKey,
        gameRef: gameCode,
        saveLink: code,
        lastEdited: Date.now()
      }
    }
  })
  yield setSaveId(saveKey)
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
    uid: context.uid
  }
}

function * onRemove () {
  yield refresh()
}

export default fire((props) => {
  const refs = {
    inProgress: `/users/${props.user}/inProgress`,
    gameVal: `/games/${props.gameCode}`
  }
  return props.saveID ? {...refs, savedProgress: `/saved/${props.saveID}`} : refs
})({
  initialState,
  getProps,
  onUpdate,
  onCreate,
  onRemove,
  reducer,
  render
})

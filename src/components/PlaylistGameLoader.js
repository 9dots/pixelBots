import ChallengeLoader from '../pages/ChallengeLoader'
import {setUrl} from 'redux-effects-location'
import {fbTask} from '../utils'
import LinkModal from './LinkModal'
import {refMethod} from 'vdux-fire'
import element from 'vdux/element'
import Window from 'vdux/window'
import {Block} from 'vdux-ui'

function render ({props, state, local}) {
  const {
    sequence = [],
    currentUser,
    creatorID,
    activeKey,
    uid,
    mine,
    myLists,
    listActions,
    dropTarget,
    dragTarget
  } = props

  const {drop, dragEnter, dragStart} = listActions
  const {modal} = state

  function getDummyPosition (i) {
    return sequence.indexOf(dropTarget) > sequence.indexOf(dragTarget)
      ? i + 1
      : i
  }

  return (
    <Window onDrop={[(e) => e.stopPropagation(), (e) => drop(sequence.indexOf(dropTarget))]} onDragOver={(e) => e.preventDefault()}>
      <Block border='1px solid #e0e0e0' borderBottomWidth='0'>
        {
          sequence.filter((ref) => ref !== dragTarget).map((ref, i) => (
            <ChallengeLoader
              idx={i}
              dummy={getDummyPosition(i) === sequence.indexOf(dropTarget) && getPlaceHolder(ref, i)}
              dragTarget={dragTarget}
              handleDrop={handleDrop(i)}
              handleDragEnter={handleDragEnter(ref)}
              handleDragStart={handleDragStart(ref)}
              remove={remove(activeKey, ref)}
              draggable={mine}
              playlistKey={activeKey}
              playClick={() => play(i)}
              key={ref}
              noAssign
              uid={currentUser.uid}
              mine={mine && currentUser.uid === creatorID}
              ref={ref} />
            )
          )
        }
        {
          modal && <LinkModal
            code={modal}
            footer={modalFooter} />
        }
      </Block>
    </Window>
  )

  function getPlaceHolder (key, idx) {
    return (
      <Block
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => listActions.drop(idx)}
        onDragEnter={(e) => listActions.dragEnter(key)}
        wide
        bgColor='lightblue'
        h='67px' />
    )
  }

  function handleDragStart (ref) {
    return function * (e) {
      yield dragStart(ref)
    }
  }

  function handleDrop (idx) {
    return function * (e) {
      yield e.preventDefault()
      yield drop(idx)
    }
  }

  function handleDragEnter (ref) {
    return function * (e) {
      yield e.preventDefault()
      yield dragEnter(ref)
    }
  }

  function * play (current) {
    const {key} = yield fbTask('create_playlist_instance', {
      playlistKey: activeKey,
      current,
      uid
    })
    yield refMethod({
      ref: `/queue/tasks/${key}`,
      updates: {method: 'once', value: 'child_removed'}
    })
    yield setUrl(`/playSequence/${activeKey}`)
  }
}

function remove (playlistKey, gameRef) {
  return function * () {
    yield refMethod({
      ref: `/playlists/${playlistKey}`,
      updates: {
        method: 'transaction',
        value: (val) => {
          return {
            ...val,
            sequence: val.sequence.filter((ref) => ref !== gameRef)
          }
        }
      }
    })
  }
}

function getProps (props, context) {
  return {
    ...props,
    currentUser: context.currentUser,
    username: context.username
  }
}

export default ({
  getProps,
  render
})

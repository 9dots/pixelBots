import ChallengeLoader from '../pages/ChallengeLoader'
import {setUrl} from 'redux-effects-location'
import {createAssignmentLink} from '../utils'
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
    mine,
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
      <Block>
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
              playClick={play(i)}
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

  function play (current, anonymous = true) {
    return function * () {
      yield * createAssignmentLink(
        'playlists',
         {anonymous: true, ref: activeKey, current},
        (code) => setUrl(`/${code}`)
      )
    }
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

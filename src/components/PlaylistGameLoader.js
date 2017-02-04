import IndeterminateProgress from './IndeterminateProgress'
import ChallengeLoader from '../pages/ChallengeLoader'
import PlaylistItem from './PlaylistItem'
import element from 'vdux/element'
import reduce from '@f/reduce'
import {Block} from 'vdux-ui'
import fire from 'vdux-fire'
import filter from '@f/filter'
import omit from '@f/omit'
import Window from 'vdux/window'

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
              draggable={mine}
              playlistKey={activeKey}
              key={ref}
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

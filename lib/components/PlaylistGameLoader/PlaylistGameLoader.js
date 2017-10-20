/**
 * Imports
 */

import {
  component,
  element,
  Window,
  stopPropagation,
  preventDefault
} from 'vdux'
import ChallengeLoader from 'components/ChallengeLoader'
import { Block } from 'vdux-ui'
import orderBy from 'lodash/orderBy'
import objEqual from '@f/equal-obj'

/**
 * <Playlist Game Loader/>
 */

export default component({
  render ({ props, context }) {
    const {
      completed = [],
      sequence = {},
      creatorID,
      activeKey,
      uid,
      mine,
      listActions,
      dropTarget,
      dragTarget = {},
      savedRefs = {}
    } = props

    const orderedSequence = orderBy(sequence, 'order', 'asc')

    function getDummyPosition (i) {
      return orderedSequence.indexOf(dropTarget) >
        orderedSequence.indexOf(dragTarget)
        ? i + 1
        : i
    }

    return (
      <Window
        onDrop={[
          stopPropagation,
          listActions.drop(orderedSequence.indexOf(dropTarget))
        ]}
        onDragOver={preventDefault}>
        <Block>
          {orderedSequence
            .filter(ref => !objEqual(ref, dragTarget || {}))
            .map((ref, i) => (
              <ChallengeLoader
                idx={i}
                dummy={
                  getDummyPosition(i) === orderedSequence.indexOf(dropTarget) &&
                  getPlaceHolder(ref)
                }
                dragTarget={dragTarget}
                copy={listActions.copyChallenge(ref)}
                handleDrop={listActions.drop(i)}
                handleDragEnter={listActions.handleDragEnter(ref)}
                handleDragStart={listActions.handleDragStart(ref)}
                remove={listActions.removeChallenge(ref)}
                draggable={mine}
                saveRef={savedRefs[ref.gameRef]}
                playlistKey={activeKey}
                gameClick={listActions.play(i)}
                key={ref.gameRef}
                isComplete={completed.indexOf(ref.gameRef) !== -1}
                noAssign
                uid={uid}
                mine={mine && uid === creatorID}
                ref={ref.gameRef} />
            ))}
        </Block>
      </Window>
    )

    function getPlaceHolder (game) {
      return (
        <Block
          onDragOver={preventDefault}
          onDrop={listActions.drop(game.order)}
          onDragEnter={listActions.handleDragEnter(game)}
          wide
          bgColor='lightblue'
          h='104px' />
      )
    }
  }
})

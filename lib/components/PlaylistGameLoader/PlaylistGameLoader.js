/**
 * Imports
 */

import {component, element, Window, stopPropagation, preventDefault} from 'vdux'
import ChallengeLoader from 'components/ChallengeLoader'
import {refMethod} from 'vdux-fire'
import {Block} from 'vdux-ui'

/**
 * <Playlist Game Loader/>
 */

export default component({
  render ({props, context}) {
	  const {
	    completed = [],
	    sequence = [],
	    creatorID,
	    activeKey,
	    uid,
	    mine,
	    myLists,
	    listActions,
	    dropTarget,
	    dragTarget,
	    savedRefs = {},
	  } = props

	  function getDummyPosition (i) {
	    return sequence.indexOf(dropTarget) > sequence.indexOf(dragTarget)
	      ? i + 1
	      : i
	  }

	  return (
	    <Window onDrop={[stopPropagation, listActions.drop(sequence.indexOf(dropTarget))]} onDragOver={preventDefault}>
	      <Block>
	        {
	          sequence.filter((ref) => ref !== dragTarget).map((ref, i) => (
	            <ChallengeLoader
	              idx={i}
	              dummy={getDummyPosition(i) === sequence.indexOf(dropTarget) && getPlaceHolder(ref, i)}
	              dragTarget={dragTarget}
                copy={listActions.copyChallenge(ref)}
	              handleDrop={listActions.drop(i)}
	              handleDragEnter={listActions.handleDragEnter(ref)}
	              handleDragStart={listActions.handleDragStart(ref)}
	              remove={listActions.removeChallenge(ref)}
	              draggable={mine}
	              saveRef={savedRefs[ref]}
	              playlistKey={activeKey}
	              gameClick={listActions.play(i)}
	              key={ref}
	              isComplete={completed.indexOf(ref) !== -1}
	              noAssign
	              uid={uid}
	              mine={mine && uid === creatorID}
	              ref={ref} />
	            )
	          )
	        }
	      </Block>
	    </Window>
	  )

	  function getPlaceHolder (key, idx) {
	    return (
	      <Block
	        onDragOver={preventDefault}
	        onDrop={listActions.drop(idx)}
	        onDragEnter={listActions.handleDragEnter(key)}
	        wide
	        bgColor='lightblue'
	        h='67px' />
	    )
	  }
  }
})

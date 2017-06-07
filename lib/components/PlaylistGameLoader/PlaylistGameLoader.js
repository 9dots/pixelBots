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
	    sequence = [],
	    creatorID,
	    activeKey,
	    uid,
	    mine,
	    myLists,
	    listActions,
	    dropTarget,
	    dragTarget
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
	              handleDrop={listActions.drop(i)}
	              handleDragEnter={listActions.handleDragEnter(ref)}
	              handleDragStart={listActions.handleDragStart(ref)}
	              remove={listActions.removeChallenge(ref)}
	              draggable={mine}
	              playlistKey={activeKey}
	              // gameClick={context.setUrl(`/playlist/${activeKey}/${i}/${ref}`)}
	              // playClick={listActions.play(i)}
	              
	              gameClick={listActions.play(i)}
	              key={ref}
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
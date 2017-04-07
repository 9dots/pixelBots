/**
 * Imports
 */

import {moveAnimal, paintSquare, turnAnimal} from 'pages/Game/middleware/botsMiddleware'
import {getFrames, getActions} from 'utils/synchronousRunner'
import {createRunners} from 'pages/Game/utils/runner'
import mw from 'pages/Game/middleware/botsMiddleware'
import GameOutput from 'components/GameOutput'
import GameInput from 'components/GameInput'
import Loading from 'components/Loading'
import Layout from 'layouts/MainLayout'
import {component, element} from 'vdux'
import isIterator from '@f/is-iterator'
import deepEqual from '@f/deep-equal'
import {Block, Text} from 'vdux-ui'
import setProp from '@f/set-prop'
import splice from '@f/splice'
import filter from '@f/filter'
import fire from 'vdux-fire'
import omit from '@f/omit'

/**
 * <Reading Challenge/>
 */

export default (component({
	initialState ({props}) {
		const {game, savedGame} = props
		return {
      ...savedGame,
      ...game,
      animals: game.animals.map(a => ({...a, sequence: a.sequence || game.startCode})),
      correctness: [],
      frameNumber: -1,
      saved: true,
      frames: []
    }
	},

  render ({props, context, state, children, actions}) {
  	const {game, savedGame, playlist, draftData} = props
  	const {active, frameNumber, frames, correctness} = state
  	
  	const gameDisplay = (
  		<Block wide minHeight={600}>
	  		<Block display='flex' tall wide>
		  		<Block display='flex' tall>
		  			<GameOutput
		    			{...omit('runners', state)}
              {...buildFrames(state, frames)[frameNumber]}
		    			size='350px'
		    			readOnly
		    			active={state.active}
		    			speed={state.speed}
		    			gameActions={actions}
		    			correctness={correctness}
		    			frames={frames}
		    			frameNumber={frameNumber}
		    			/>
					</Block>
					<Block flex tall>
						<GameInput {...props} {...state} gameActions={actions} readOnly />
					</Block>
				</Block>
				{children}
			</Block>
  	)

  	if (draftData) return gameDisplay

    return (
    	<Block tall>
	    	<Layout
			    bodyProps={{display: 'flex', px: '10px'}}
			    navigation={[
			    	playlist && {category: 'playlist', title: playlist.title},
			    	{category: 'reading challenge', title: state.title}
			    ]}
			    titleActions={playlist && playlist.actions}
			    titleImg={playlist ? playlist.img : state.imageUrl}>
	    		{gameDisplay}
	    	</Layout>
    	</Block>
    )
  },

  controller: {
  	* save ({context, actions}) {
			yield context.firebaseUpdate(`/saved/${props.saveRef}`, {
				lastEdited: Date.now(),
				uid: context.uid
			})
			yield actions.setSaved(true)
  	},
  	* runCode ({actions, state}) {
  		const runners = yield createRunners(state.animals.map((a) => (
        {...a, sequence: a.sequence || state.startCode}
      )))
  		const a = runners.map((it) => getActions(it))[0]
  		return buildFrames(state, a)
  	},
  	* validate ({actions, state}) {
  		const {frames = []} = state
  		const userFrames = buildFrames(state, frames)
  		const codeFrames = yield actions.runCode()
  		const diff = userFrames.map((f, i) => validateFrame(f, codeFrames[i]))
      yield actions.setCorrectness(diff)
      if (diff.every((c) => !!c) && diff.length === codeFrames.length) {
        yield actions.onComplete()
      }
  	},
    * onComplete ({context}) {
      yield context.openModal(winMessage('You have successfully read the code.'))
    }
  },

  reducer: {
    animalPaint: (state, color) => addAction(
      state,
      paintSquare({id: state.active, color})
    ),
    animalMove: (state, location, oldLocation) => addAction(
      state,
      moveAnimal({id: state.active, getLocation: (curLocation) => [
        curLocation[0] + (location[0] - oldLocation[0]),
        curLocation[1] + (location[1] - oldLocation[1])
      ]})
    ),
    animalTurn: state => addAction(
      state, turnAnimal({id: state.active, turn: 90})
    ),
    setCorrectness: (state, correctness) => ({correctness}),
  	setCursor: (state, cursor) => ({cursor}),
  	setSaved: (state, saved) => ({saved}),
    addFrame: state => ({
      frames: splice(state.frames, state.frameNumber + 1, 0, []),
      frameNumber: state.frameNumber + 1,
      correctness: splice(state.correctness, state.frameNumber + 1, 0, [])
    }),
    setFrame: (state, frameNumber) => ({frameNumber}),
    nextFrame: state => ({
      frameNumber: Math.min(state.frameNumber + 1, state.frames.length - 1)
    }),
    prevFrame: state => ({
      frameNumber: Math.max(state.frameNumber - 1, 0)
    }),
    setStates: (state, states) => ({states}),
    removeFrame: state => ({
      frames: splice(state.frames, state.frameNumber, 1),
      correctness: splice(state.correctness, state.frameNumber, 1),
      frameNumber: state.frameNumber === (state.frames.length - 1)
    		? state.frameNumber - 1
    		: state.frameNumber
    }),
  	reset: () => ({
      frames: [],
      frameNumber: -1
    })
  }
}))

/**
 * Helpers
 */

function winMessage (msg) {
  const body = <Block>
    <Text>{msg}</Text>
  </Block>

  return {
    header: 'Congratulations',
    type: 'win',
    body
  }
}

function buildFrames (state, a) {
  const initialBotState = {
    animals: state.animals,
    painted: state.painted
  }
  return getFrames(a, initialBotState)
}

function validateFrame (a, b) {
  return deepEqual(filterWhite(a), filterWhite(b))
}

function filterWhite (frame) {
  if (!frame) return {}
  return {
    ...frame,
    painted: filter(square => square !== 'white', frame.painted || {})
  }
}

function addAction (state, action) {
  if (state.frameNumber === -1) {
    return {
      error: 'You must add a frame before you can start drawing'
    }
  }

  return {
    frames: splice(state.frames, state.frameNumber, 1, state.frames[state.frameNumber].concat(action))
  }
}

function updateAnimal (state, path, id, val) {
  return {
    animals: state.animals.map((animal, i) => {
      return i === id
        ? setProp(path, animal, val)
        : animal
    }),
    cursor: Math.min((state.animals[state.active].sequence || []).length, state.cursor)
  }
}

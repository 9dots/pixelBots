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
import {debounce} from 'redux-timing'
import {Block, Text} from 'vdux-ui'
import setProp from '@f/set-prop'
import splice from '@f/splice'
import filter from '@f/filter'
import fire from 'vdux-fire'
import omit from '@f/omit'
import find from '@f/find'
import zip from '@f/zip'

/**
 * <ReadingChallenge/>
 */

export default (component({
	initialState ({props}) {
		const {game, savedGame} = props

		return {
      ...game,
      ...savedGame,
      animals: game.animals.map(a => ({...a, sequence: a.sequence || game.startCode})),
      correctness: [],
      frameNumber: -1,
      saved: true,
      states: [],
      paints: 0,
      frames: savedGame.frames || []
    }
	},

  render ({props, context, state, children, actions}) {
  	const {game, savedGame, playlist, draft, draftData} = props
  	const {active, invalid, frameNumber, frames, correctness} = state

  	const gameDisplay = (
  		<Block wide minHeight={600}>
	  		<Block display='flex' tall wide>
		  		<Block display='flex' tall>
		  			<GameOutput
		    			{...omit('runners', state)}
		    			size='350px'
		    			readOnly
		    			active={active}
              invalid={invalid}
              errorMessage={state.errorMessage}
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

  	if (draft) return gameDisplay

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

  middleware: [
    debounce('save', 3000)
  ],

  controller: {
  	* save ({context, actions, state, props}) {
			yield context.firebaseUpdate(`/saved/${props.saveRef}`, {
				lastEdited: Date.now(),
        frames: state.frames,
				uid: context.uid
			})
			yield actions.setSaved(true)
  	},
    * runCode ({actions, state, props}) {
      const runners = yield props.runnerActions.createRunners(props.game.animals.map((a) => ({
        ...a,
        sequence: a.sequence || state.startCode
      })))

      return buildFrames(props.game, runners.map(getActions)[0])
    },
    * onComplete ({context, props}) {
      yield context.openModal(winMessage('You have successfully read the code.'))
      yield props.runnerActions.onComplete()
    },
    * animalPaint ({actions, state, props}, color) {
      const frames = paintFrames(yield actions.runCode())

      // We're done at this point, we shouldn't really get into this state
      // but it may be possible if they click really fast or something
      if (state.paints >= frames.length) {
        return
      }

      const error = validate(
        frames,
        state.paints,
        state.animals[state.active].current.location,
        color
      )

      if (error) {
        yield actions.setInvalid(error)
      } else {
        yield actions.setInvalid(false)
        yield actions.paint(color)
        if (state.paints === frames.length - 1) {
          yield actions.onComplete()
        }
      }
    }
  },

  reducer: {
    paint: (state, color) => ({
      frames: state.frames.concat({[state.animals[state.active].current.location]: color, frame: state.steps}),
      paints: state.paints + 1,
      painted: {
        ...state.painted,
        [state.animals[state.active].current.location]: color
      }
    }),
    animalMove: (state, location) => updateAnimal(state, 'current.location', state.active, location),
    animalTurn: (state, rot = 90) => updateAnimal(state, 'current.rot', state.active, rot),
    setInvalid: (state, msg) => ({
      invalid: msg ? (state.invalid || 0) + 1 : 0,
      errorMessage: msg
    }),
    setCorrectness: (state, correctness) => ({correctness}),
  	setCursor: (state, cursor) => ({cursor}),
  	setSaved: (state, saved) => ({saved}),
    setStates: (state, states) => ({states}),
  	reset: () => ({
      frames: [],
      frameNumber: -1
    })
  }
}))

/**
 * Helpers
 */

function paintFrames (frames) {
  return frames.reduce((acc, frame) => {
    const last = acc[acc.length - 1]

    if (!deepEqual(last, frame.painted)) {
      acc.push(frame.painted)
    }

    return acc
  }, [])
}

function validate (frames, idx, location, color) {
  const next = frames[idx]
  const prev = frames[idx - 1] || {}
  const changedLoc = Object.keys(next).filter(key => prev[key] !== next[key])[0]

  if (location.toString() !== changedLoc) {
    return 'location'
  }

  if (next[changedLoc] !== color) {
    return 'color'
  }

  return null
}

function buildFrames (state, a) {
  const initialBotState = {
    animals: state.animals,
    painted: state.painted
  }
  return getFrames(a, initialBotState)
}


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

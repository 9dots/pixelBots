/**
 * Imports
 */

import checkCorrect from 'pages/Game/utils/checkCorrect'
import GameOutput from 'components/GameOutput'
import GameEditor from 'components/GameEditor'
import Layout from 'layouts/MainLayout'
import {component, element} from 'vdux'
import {Block, Text} from 'vdux-ui'
import createApi from 'animalApis'
import equal from '@f/equal'
import omit from '@f/omit'
import {
  validate,
  createFrames,
  getIterator,
  getChangedLocations,
  createPaintFrames
} from 'utils/frameReducer'

/**
 * <ReadingChallenge/>
 */

export default component({
  initialState ({props}) {
    const {game, painted, animals, paints} = props
    const animal = animals[0]

    const it = getIterator(animal.sequence, createApi(game.capabilities, 0, game.palette))

    return {
      errorMessage: '',
      invalid: 0,
      invalidCount: 0,
      framePaints: 0,
      paints: Object.keys(props.initialPainted).length ? 1 : 0,
      frames: createPaintFrames({painted, animals, paints}, it)
    }
  },

  render ({props, context, state, children, actions}) {
  	const {game, savedGame, playlist, isDraft, stretch = {}} = props
  	const {invalid, errorMessage, invalidCount} = state
    const gameData = {...game, ...savedGame}

    const badges = [
      {
        type: 'completed',
        limit: 1,
        earned: savedGame.completed
      },
      {
        type: 'errorLimit',
        limit: 3,
        earned: savedGame.badges && savedGame.badges.errorLimit
      }
    ]

  	const gameDisplay = (
  		<Block tall wide minHeight={600}>
	  		<Block display='flex' tall wide>
		  		<Block display='flex' tall>
		  			<GameOutput
		    			{...omit('runners', props)}
              {...actions}
              canPaint
              paint={actions.paint}
		    			size='350px'
		    			readOnly
              invalid={invalid}
              errorMessage={errorMessage}
              invalidCount={invalidCount} />
          </Block>
          <Block flex tall>
						<GameEditor
              {...props}
              {...state}
              {...gameData}
              sequence={gameData.animals[gameData.active].sequence}
              gameActions={actions}
              readOnly />
					</Block>
				</Block>
				{children}
			</Block>
  	)

    if (isDraft) return gameDisplay

    return (
      <Block tall>
        <Layout
          badges={badges}
          bodyProps={{display: 'flex', px: '10px'}}
          navigation={[{
            category: playlist.title,
            title: props.title,
            onClick: context.setUrl(`/playlist/${playlist.ref}`)
          }]}
          titleImg={'/animalImages/readImage.png'}
          titleActions={playlist && playlist.actions}>
          {gameDisplay}
        </Layout>
      </Block>
    )
  },

  * onUpdate (prev, {props, actions}) {
    const {painted, hasRun, targetPainted, animals} = props

    if (hasRun && prev.props.painted !== painted && checkCorrect(painted, targetPainted)) {
      yield actions.onComplete()
    }

    if (!equal(prev.props.animals, animals)) {
      yield actions.setInvalid(false)
    }
  },

  controller: {
    * animalMove ({props, context}, id, coordinates) {
      yield props.animalMove(id, coordinates)
      yield props.incrementTimeElapsed()
      yield context.firebaseTransaction(
        `/saved/${props.saveRef}/moves`,
        (val) => val + 1
      )
    },

    * paint ({props, actions, state}, id, color) {
      const {animals, setPainted} = props
      const {frames = [], paints} = state

      // We're done at this point, we shouldn't really get into this state
      // but it may be possible if they click really fast or something
      if (paints >= frames.length) {
        return
      }

      const changedLoc = getChangedLocations(frames, paints)
      const loc = animals[id].current.location
      const error = validate(changedLoc, loc, color, frames[paints])

      if (error) {
        yield actions.setInvalid(error)
      } else {
        yield setPainted('painted', loc, color)
        const framePaints = state.framePaints + 1
        yield actions.setFramePaints(framePaints)
        yield actions.setInvalid(false)
        if (framePaints === changedLoc.length) {
          yield actions.incrementPaints()
          if (paints === frames.length - 1) {
            yield actions.onComplete()
          }
        }
      }
    },

    * onComplete ({context, props, state}) {
      yield context.openModal(winMessage(
        () => props.onComplete({invalidCount: state.invalidCount}),
        'You have successfully read the code.'
      ))
    },

    * reset ({props, actions, context}) {
      yield context.firebaseSet(`/saved/${props.saveRef}/moves`, 0)
      yield actions.resetInvalid()
      yield props.reset()
    }
  },

  reducer: {
    setFramePaints: (state, framePaints) => ({framePaints}),
    incrementPaints: (state) => ({
      paints: state.paints + 1,
      framePaints: 0
    }),
    setInvalid: (state, msg) => ({
      invalidCount: msg ? (state.invalidCount || 0) + 1 : state.invalidCount,
      invalid: msg ? (state.invalid || 0) + 1 : 0,
      errorMessage: msg || ''
    }),
    resetInvalid: () => ({
      invalidCount: 0,
      invalid: 0,
      errorMessage: ''
    })
  }
})

/**
 * Helpers
 */

function winMessage (dismiss, msg) {
  const body = <Block textAlign='center'>
    <Text>{msg}</Text>
  </Block>

  return {
    header: 'Congratulations',
    type: 'win',
    dismiss,
    body
  }
}

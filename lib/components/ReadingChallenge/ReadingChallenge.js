/**
 * Imports
 */

import checkCorrect from 'pages/Game/utils/checkCorrect'
import GameOutput from 'components/GameOutput'
import WinGraphic from 'components/WinGraphic'
import GameEditor from 'components/GameEditor'
import BotModal from 'components/BotModal'
import Layout from 'layouts/MainLayout'
import {component, element} from 'vdux'
import {Block} from 'vdux-ui'
import createApi from 'animalApis'
import equal from '@f/equal'
import omit from '@f/omit'
import {
  validate,
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
      errorLog: [],
      errorMessage: '',
      invalid: 0,
      invalidCount: 0,
      framePaints: 0,
      paints: Object.keys(props.initialPainted).length ? 1 : 0,
      frames: createPaintFrames({painted, animals, paints}, it)
    }
  },

  render ({props, context, state, children, actions}) {
    const {game, savedGame, playlist, isDraft, gameHeight = '50px'} = props
    const {invalid, errorMessage, invalidCount, errorLog} = state
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
      <Block tall wide minHeight={gameHeight}>
        <Block display='flex' tall wide>
          <Block display='flex' tall>
            <GameOutput
              {...omit('runners', props)}
              {...actions}
              gameActions={actions}
              canPaint
              paint={actions.paint}
              size='350px'
              readOnly
              invalid={invalid}
              errorLog={errorLog}
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
          titleActions={playlist && playlist.actions(actions.onComplete)}>
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
        actions.setInvalid('location')
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
        }
      }
    },

    * onComplete ({context, props, state}) {
      const {paints, frames} = state
      if (paints === frames.length) {
        yield context.openModal(() =>
          <BotModal
            confirm={props.onComplete({invalidCount: state.invalidCount})}
            confirmText='Submit'
            title='Congratulations'
            body={(
              <Block textAlign='center' pb>
                <WinGraphic />
                You have successfully read the code.
              </Block>
            )} />
        )
      } else {
        yield context.openModal(() => (
          <BotModal
            reject={props.next}
            rejectText='Skip Challenge Anyway'
            title='Error'
            body={<Block textAlign='cen ter'>You have not finished reading the code.</Block>} />
        ))
      }
    },

    * reset ({props, actions, context}) {
      yield context.firebaseSet(`/saved/${props.saveRef}/moves`, 0)
      yield actions.resetInvalid(Object.keys(props.initialPainted).length ? 1 : 0)
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
      errorMessage: msg || '',
      errorLog: msg ? state.errorLog.concat(msg) : state.errorLog
    }),
    resetInvalid: (state, paints) => ({
      invalidCount: 0,
      invalid: 0,
      errorMessage: '',
      paints
    })
  }
})

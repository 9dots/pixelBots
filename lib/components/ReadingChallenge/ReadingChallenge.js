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
      frames: createPaintFrames({painted, animals, paints}, it)
    }
  },

  render ({props, context, state, children, actions}) {
  	const {game, savedGame, playlist, isDraft} = props
  	const {invalid, errorMessage, invalidCount} = state
    const gameData = {...game, ...savedGame}

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
    * paint ({props, actions, state}, id, color) {
      const {paints = 0, animals, setPainted} = props
      const {frames = []} = state

      // We're done at this point, we shouldn't really get into this state
      // but it may be possible if they click really fast or something
      if (paints >= frames.length) {
        return
      }

      const loc = animals[id].current.location
      const error = validate(frames, paints, loc, color)

      if (error) {
        yield actions.setInvalid(error)
      } else {
        yield actions.setInvalid(false)
        yield setPainted('painted', loc, color)

        if (paints === frames.length - 1) {
          yield actions.onComplete()
        }
      }
    },

    * onComplete ({context, props, state}) {
      yield context.openModal(winMessage(props.onComplete, 'You have successfully read the code.'))
      // yield props.onComplete({
      //   invalidCount: state.invalidCount
      // })
    }
  },

  reducer: {
    setInvalid: (state, msg) => ({
      invalidCount: msg ? (state.invalidCount || 0) + 1 : state.invalidCount,
      invalid: msg ? (state.invalid || 0) + 1 : 0,
      errorMessage: msg || ''
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

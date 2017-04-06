/**
 * Imports
 */

import {moveAnimal, paintSquare, turnAnimal} from 'pages/Game/middleware/botsMiddleware'
import GameOutput from 'components/GameOutput'
import GameInput from 'components/GameInput'
import Loading from 'components/Loading'
import Layout from 'layouts/MainLayout'
import {component, element} from 'vdux'
import setProp from '@f/set-prop'
import splice from '@f/splice'
import {Block} from 'vdux-ui'
import fire from 'vdux-fire'
import omit from '@f/omit'

/**
 * <Reading Challenge/>
 */

export default (component({
	initialState ({props}) {
		const {game, savedGame} = props
		return {...game, ...savedGame, saved: true}
	},

	* onCreate ({props, actions}) {
		yield actions.gameDidInitialize({...props.game, ...props.savedGame})
	},

  render ({props, context, state, children, actions}) {
  	const {game, savedGame, playlist, draftData} = props
  	const {initialData, animals, active} = state

  	const gameDisplay = (
  		<Block wide minHeight={600}>
	  		<Block display='flex' tall wide>
		  		<Block display='flex' tall>
		  			<GameOutput
		    			{...initialData}
		    			{...omit('runners', state)}
		    			size='350px'
		    			readOnly
		    			active={state.active}
		    			speed={state.speed}
		    			gameActions={actions} />
					</Block>
					<Block flex tall>
						<GameInput {...props} {...state} readOnly />
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
				uid: context.uid,
			})
			yield actions.setSaved(true)
  	},
  	* addFrame ({actions, state}) {
  		yield actions.saveFrame(false)
  	}
  },

  reducer: {
  	gameDidInitialize: (state, game) => ({
  		ready: true,
  		initialData: game,
  		...game,
  		speed: state.speed,
  		animals: game.animals.map((a) => ({...a, sequence: a.sequence || game.startCode}))
  	}),
    animalPaint: (state, {id, location, color}) => ({
      painted: {...state.painted, [location]: color},
      ...addAction(state, paintSquare({id: state.active, color}))
    }),
    animalMove: (state, {id, location}) => ({
      ...updateAnimal(state, 'current.location', state.active, location),
      ...addAction(state, moveAnimal({id: state.active, getNewLocation: () => location}))
    }),
    animalTurn: state => ({
      ...updateAnimal(state, 'current.rot', state.active, state.animals[state.active].current.rot + 90),
      ...addAction(state, turnAnimal({id: state.active, turn: 90}))
    }),
  	setCursor: (state, cursor) => ({cursor}),
  	setSaved: (state, saved) => ({saved}),
  	stepForward: () => ({}),
    addFrame: state => ({
      frames: [...state.frames, []]
    }),
    nextFrame: state => ({
      frameNumber: Math.min((state.frameNumber || 0) + 1, state.frames.length - 1)
    }),
    prevFrame: state => ({
      frameNumber: Math.max((state.frameNumber || 0) - 1, 0)
    }),
  	reset: () => ({
      frames: []
    })
  }
}))

/**
 * Helpers
 */

function addAction (state, action) {
  const idx = state.frameNumber || 0
  const frames = state.frames || []
  const frame = frames[idx] || []

  return {
    frames: splice(frames, idx, 1, frame.concat(action))
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

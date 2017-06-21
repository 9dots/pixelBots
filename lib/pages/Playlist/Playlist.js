/**
 * Imports
 */

import GameLoader from 'components/GameLoader'
import LinkModal from 'components/LinkModal'
import linesOfCode from 'utils/linesOfCode'
import {Block, Icon, Text} from 'vdux-ui'
import Loading from 'components/Loading'
import Results from 'components/Results'
import {component, element} from 'vdux'
import Button from 'components/Button'
import mapValues from '@f/map-values'
import union from '@f/union'
import enroute from 'enroute'
import equal from '@f/equal'
import fire from 'vdux-fire'


const router = enroute({
	results: (params, props) => <Results {...params} {...props} />,
  default: (params, props) => <GameLoader {...params} {...props} />
})

const initPlaylist = (ref, uid) => ({
	completedChallenges: [],
	lastEdited: Date.now(),
	savedChallenges: null,
	playlist: ref,
	current: 0,
	uid
})

export default component({
	* onCreate ({props, context}) {
		const {playlistRef, instanceRef, current} = props
		const {uid} = context
		if (!instanceRef) {
			const {key} = yield context.firebasePush(
				`/playlistInstances`,
				initPlaylist(playlistRef, uid)
			)
			yield context.firebaseUpdate(`/playlistsByUser/${uid}/byPlaylistRef`, {
				[playlistRef]: {
					lastEdited: Date.now(),
					instanceRef: key
				}
			})
			yield context.firebaseTransaction(
				`/playlists/${playlistRef}/plays`,
				(plays) => plays + 1
			)
			return yield context.setUrl(`/playlist/${playlistRef}/instance/${key}/${current}`)
		}
	},

	render ({props, state, context}) {
		if (!props.instanceRef) return <span/>
		return (
			<Playlist {...props} uid={context.uid}/>
		)
	}
})

/**
 * <Playlist/>
 */

const Playlist = fire((props) => ({
  playlist: {
		ref: `/playlistInstances/${props.instanceRef}`,
		join: {
			ref: '/playlists',
			child: 'playlist',
		}
	}
}))(component({
	initialState ({props}) {
		return {
			ready: false,
			savePath: `/playlistInstances/${props.instanceRef}`
		}
	},

	* onCreate ({props, state, actions, context}) {
    yield context.firebaseUpdate(state.savePath, {lastEdited: Date.now()})
    yield context.firebaseTransaction(state.savePath + '/current', (val) => (
      parseInt(props.current, 10)
    ))
  },

  render ({props, state, actions}) {
	  const {playlist} = props
	  const {ready} = state

	  if (!ready) return <Loading />

		const progress = playlist.value
		const playlistValue = progress.playlist[0]
		const {sequence} = playlistValue

	  return (
	    <View key={`view-${props.current}`} {...props} savePath={state.savePath} {...playlistValue} current={props.current} next={actions.next} prev={actions.prev} />
	  )
  },

  * onUpdate (prev, {props, state, actions, context}) {
  	const {playlist, playlistRef} = props
		if (prev.props.playlist.loading !== playlist.loading && !playlist.loading) {
			yield actions.setReady()
			const {sequence} = playlist.value.playlist[0]
			if (!playlist.value.savedChallenges || Object.keys(playlist.value.savedChallenges).length !== sequence.length) {
				yield context.firebaseSet(
					`${state.savePath}/savedChallenges`,
					sequence.filter(ref => Object.keys(playlist.value.savedChallenges || {}).indexOf(ref) !== -1).reduce((acc, gameId, i) => ({...acc, [gameId]: `${props.instanceRef}${i}`}), {})
				)
			}
		}
		if (prev.props.current !== props.current) {
			yield context.firebaseUpdate(state.savePath, {lastEdited: Date.now()})
			yield context.firebaseTransaction(state.savePath + '/current', (val) => (
				parseInt(props.current, 10)
			))
		}
  },

  controller: {
  	* next ({context, props, state}) {
			const {playlist, playlistRef, instanceRef, current} = props
			const {sequence} = playlist.value.playlist[0]
  		const {savePath} = state
      const cur = parseInt(current, 10)
			if (cur + 1 < sequence.length) {
	      yield context.setUrl(
					`/playlist/${playlistRef}/play/${instanceRef}/${cur + 1}`
				)
			} else {
        yield context.setUrl('/')
      }
		},
		* prev ({context, props, state}) {
			const {playlistRef, instanceRef} = props
			const {savePath} = state

			// yield immediateSave()
			const cur = parseInt(props.current, 10)

			if (cur - 1 >= 0) {
	      yield context.setUrl(
					`/playlist/${playlistRef}/play/${instanceRef}/${cur - 1}`
				)
      }
		}
  },

  reducer: {
  	setReady: () => ({ready: true})
  }
}))

/** @jsx element */

const View = fire((props) => ({
  game: `/games/${props.sequence[props.current]}[once]`,
	saved: `/saved/${props.playlist.value.savedChallenges[props.sequence[props.current]]}`
}))(component({
	render ({props, actions, context}) {
		const {sequence, game, playlist} = props
		const current = parseInt(props.current, 10)
		const isNext = current + 1 < sequence.length
	  const isPrev = current - 1 >= 0
		const savedChallenges = playlist.value.savedChallenges

	  const completed = props.completed
	    ? props.completed[sequence[current]]
	    : false

	  const {loading, value = {}, error} = game
		const gameValue = value || {}

	  if (loading) return <span />

   	const modalFooter = (
		  <Block>
		    <Button ml='m' onClick={context.closeModal()}>Done</Button>
		  </Block>
		)

	  const titleActions = (
	    <Block align='start center'>
	      <Text fs='m'>{current + 1} / {sequence.length}</Text>
	      <Button
	        ml='2em'
	        mr='0.5em'
	        h={38}
	        bgColor={isPrev ? 'blue' : 'disabled'}
	        disabled={!isPrev}
	        onClick={props.prev}>BACK</Button>
	      <Button
	      	mr='0.5em'
	      	h={38}
	        bgColor={isNext ? 'blue' : 'disabled'}
	        disabled={!isNext}
	        onClick={props.next}>NEXT</Button>
       	<Button
	        onClick={context.openModal(
	        	() => <LinkModal code={gameValue.shortLink} footer={modalFooter} />
	        )}
	        h={38}
	        px='s'
	        borderColor='divider'
	        color='primary'
	        align='space-between'
	        bgColor='white'>
	        <Icon name='link' />
	      </Button>
	    </Block>
	  )

	  const playlistLayout = {
      title: props.name,
      img: props.imageUrl,
      subtitle: gameValue.title,
      actions: titleActions
	  }

	  return (
  		router(props.subpage || 'default', {
  			...props,
  			key: `playlist-game-holder-${sequence[current]}`,
  			playlist: playlistLayout,
  			onGameComplete: actions.onGameComplete,
  			gameRef: sequence[current],
				saveRef: savedChallenges[sequence[current]],
  			completed
  		})
	  )
	},

  controller: {
    * onGameComplete ({props, context, actions}) {
      const {sequence, current, savePath, playlist} = props
			const {completedChallenges = []} = playlist.value
			const {type = 'write'} = props.game.value
      const {uid} = context
			const completed = union(completedChallenges, [sequence[current]])

			yield actions.awardBadges()
      yield context.firebaseUpdate(savePath + '/completedChallenges', completed)

      yield context.setUrl(`${context.url}/results`)
      if (equal(completed, sequence)) {
        yield context.firebaseUpdate(savePath, {
          completed: true
        })
				yield context.firebaseTransaction(
					`/users/${uid}/stats/playlistCompleted`,
					val => (val || 0) + 1
				)
      }
    },
		* awardBadges ({props, context, actions}, completed) {
			const {sequence, current, savePath, playlist, game, saved} = props
			const {completedChallenges = []} = playlist.value
			const {uid} = context
			const {type = 'write'} = game.value
			const isNewCompleted = completedChallenges.indexOf(sequence[current]) === -1
			if (isNewCompleted) {
				yield context.firebaseTransaction(
					`/users/${uid}/badges/completed`,
					(val = 0) => val + 1
				)
				yield context.firebaseTransaction(
					`/users/${uid}/stats/${type}`,
					(val = 0) => val + 1
				)
			}
			if (type === 'write') {
				const {stretch = {}} = game.value
				const loc = linesOfCode(saved.value.animals[0].sequence)
				if (stretch.type === 'lineLimit') {
					if (loc <= stretch.value) {
						yield actions.awardBadge('lineLimit', isNewCompleted)
					}
				}
				if (stretch.type === 'stepLimit') {
					if (steps < stretch.value) {
						yield actions.awardBadge('stepLimit', isNewCompleted)
					}
				}
			}
		},
		* awardBadge ({props, context}, badge, isNew) {
			const saveRef = `/saved/${props.playlist.value.savedChallenges[props.sequence[props.current]]}`
			const {savePath} = props
			yield context.firebaseUpdate(
				`/${saveRef}/badges`,
				{[badge]: 1}
			)
			if (isNew) {
				yield context.firebaseTransaction(
					`/users/${context.uid}/badges/${badge}`,
					(val) => (val || 0) + 1
				)
			}
		}
  },
}))

/**
 * Imports
 */

import GameLoader from 'components/GameLoader'
import linesOfCode from 'utils/linesOfCode'
import { Block, Text, Icon } from 'vdux-ui'
import Loading from 'components/Loading'
import Results from 'components/Results'
import { component, element } from 'vdux'
import Button from 'components/Button'
import orderBy from 'lodash/orderBy'
import filter from '@f/filter'
import reduce from '@f/reduce'
import enroute from 'enroute'
import union from '@f/union'
import fire from 'vdux-fire'
import map from '@f/map'

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
  uid,
  assigned: false
})

export default fire(props => ({
  playlist:
    !props.instanceRef &&
    `/playlistsByUser/${props.uid}/byPlaylistRef/${props.playlistRef}`
}))(
  component({
    initialState ({ props }) {
      return {
        instanceRef: props.instanceRef
      }
    },
    render ({ props, state, context }) {
      if (!state.instanceRef) return <span />
      // return <span />
      return (
        <Playlist
          {...props}
          instanceRef={state.instanceRef}
          uid={context.uid} />
      )
    },

    * onUpdate (prev, { props, context, actions }) {
      if (
        prev.props.playlist.loading &&
        !props.playlist.loading &&
        !props.instanceRef
      ) {
        const { instanceRef } = props.playlist.value || {}
        if (!instanceRef) {
          return yield actions.createInstance()
        }
        yield actions.setInstanceRef(instanceRef)
      }
    },

    controller: {
      * createInstance ({ props, context, actions }) {
        const { playlistRef } = props
        const { uid } = context
        const { key } = yield context.firebasePush(
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
          plays => plays + 1
        )
        yield actions.setInstanceRef(key)
      }
    },

    reducer: {
      setInstanceRef: (state, instanceRef) => ({ instanceRef })
    }
  })
)

/**
 * <Playlist/>
 */

const Playlist = fire(props => ({
  playlist: {
    ref: `/playlistInstances/${props.instanceRef}`,
    join: {
      ref: '/playlists',
      child: 'playlist'
    }
  }
}))(
  component({
    initialState ({ props }) {
      return {
        ready: false,
        savePath: `/playlistInstances/${props.instanceRef}`
      }
    },

    * onCreate ({ props, state, actions, context }) {
      yield context.firebaseUpdate(state.savePath, {
        lastEdited: Date.now(),
        started: true
      })
      yield context.firebaseTransaction(state.savePath + '/current', val =>
        parseInt(props.current, 10)
      )
    },

    render ({ props, state, actions }) {
      const { playlist, current } = props
      const { ready, orderedSequence } = state

      if (!ready) return <Loading />

      const progress = playlist.value
      const playlistValue = progress.playlist
      const { savedChallenges } = progress

      return (
        <View
          key={`view-${props.current}`}
          {...props}
          savePath={state.savePath}
          {...playlistValue}
          gameRef={orderedSequence[current].gameRef}
          saveRef={savedChallenges[orderedSequence[current].key]}
          sequence={orderedSequence}
          current={current}
          next={actions.next}
          prev={actions.prev} />
      )
    },

    * onUpdate (prev, { props, state, actions, context }) {
      const { playlist, instanceRef } = props
      if (!prev.state.ready && !playlist.loading) {
        yield actions.setReady()
        const { sequence } = playlist.value.playlist
        yield actions.setOrderedSequence(
          orderBy(
            map((val, key) => ({ ...val, key }), sequence),
            'order',
            'asc'
          )
        )
        const saved = Object.keys(playlist.value.savedChallenges || {})
        const newChallenges = filter(
          (game, key) => saved.indexOf(key) === -1,
          sequence
        )

        if (
          !playlist.value.savedChallenges ||
          Object.keys(newChallenges).length > 0
        ) {
          yield context.firebaseUpdate(
            `${state.savePath}/savedChallenges`,
            reduce(
              (acc, ref, key) => ({
                ...acc,
                [key]: `${instanceRef}${saved.length + key}`
              }),
              {},
              newChallenges
            )
          )
        }
      }
      if (prev.props.current !== props.current) {
        yield context.firebaseUpdate(state.savePath, { lastEdited: Date.now() })
        yield context.firebaseTransaction(state.savePath + '/current', val =>
          parseInt(props.current, 10)
        )
      }
    },

    controller: {
      * next ({ context, props, state }) {
        const { instanceRef, current } = props
        const { orderedSequence } = state
        const cur = parseInt(current, 10)
        if (cur + 1 < orderedSequence.length) {
          yield context.setUrl(`/activity/${instanceRef}/${cur + 1}`)
        } else {
          yield context.setUrl('/')
        }
      },
      * prev ({ context, props, state }) {
        const { instanceRef } = props

        const cur = parseInt(props.current, 10)

        if (cur - 1 >= 0) {
          yield context.setUrl(`/activity/${instanceRef}/${cur - 1}`)
        }
      }
    },

    reducer: {
      setOrderedSequence: (state, orderedSequence) => ({ orderedSequence }),
      setReady: () => ({ ready: true })
    }
  })
)

/** @jsx element */

const View = fire(props => ({
  game: `/games/${props.gameRef}[once]`,
  saved: `/saved/${props.saveRef}`
}))(
  component({
    render ({ props, state, actions, context }) {
      const { sequence, game, playlistRef, saved, gameRef, saveRef } = props
      const current = parseInt(props.current, 10)

      const completed = props.completed ? props.completed[gameRef] : false

      const { loading, value = {} } = game
      const gameValue = value || {}

      if (loading) return <span />

      const titleActions = (onComplete, running, teacherBotRunning) => (
        <Block align='start center'>
          <Text fs='m'>
            {current + 1} / {sequence.length}
          </Text>
          <Button
            ml='2em'
            mr='0.5em'
            h={38}
            onClick={context.setUrl(`/playlist/${playlistRef}`)}>
            BACK
          </Button>
          <Button
            mr='0.5em'
            h={38}
            bgColor='blue'
            opacity={onComplete && !teacherBotRunning ? 1 : 0.5}
            disabled={teacherBotRunning || running}
            onClick={onComplete}>
            <Icon name='check' fs='s' mr='xs' ml={-6} />
            {gameValue.type === 'project' ? 'SUBMIT' : 'CHECK'}
          </Button>
        </Block>
      )

      const playlistLayout = {
        title: props.name,
        img: props.imageUrl,
        subtitle: gameValue.title,
        actions: titleActions,
        ref: props.playlistRef
      }

      return router(props.subpage || 'default', {
        ...props,
        key: `playlist-game-holder-${gameRef}`,
        playlist: playlistLayout,
        onGameComplete: actions.onGameComplete,
        gameRef,
        saveRef,
        savedGame: saved.value,
        completed
      })
    },

    controller: {
      * onGameComplete ({ props, context, actions }, data) {
        const { sequence, savePath, playlist, gameRef, game } = props
        const { completed, completedChallenges = [] } = playlist.value
        const { stretch } = game.value
        const { uid } = context
        const newCompletedChallenges = union(completedChallenges, [gameRef])

        yield context.firebaseSet(savePath + `/challengeScores/${gameRef}`, {
          completed: 1
        })
        yield actions.awardBadges(data)

        yield context.firebaseUpdate(
          savePath + '/completedChallenges',
          newCompletedChallenges
        )

        if (
          !completed &&
          sequence.every(
            val => newCompletedChallenges.indexOf(val.gameRef) > -1
          )
        ) {
          yield context.firebaseUpdate(savePath, {
            completed: true
          })
          yield context.firebaseTransaction(
            `/users/${uid}/stats/playlistCompleted`,
            val => (val || 0) + 1
          )
        }
      },
      * awardBadges ({ props, context, actions }, data) {
        const { playlist, game, savePath, gameRef, saved } = props
        const { completedChallenges = [] } = playlist.value
        const { uid } = context
        const { type = 'write', stretch = {} } = game.value
        const { steps = 0, badges = {}, meta = {}, animals = [] } = saved.value
        const loc = linesOfCode((animals[0] || {}).sequence || 0)
        const isNewCompleted = completedChallenges.indexOf(gameRef) === -1

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
          yield maybeAwardBadge('lineLimit', loc <= Number(stretch.value))
          yield maybeAwardBadge('stepLimit', steps <= Number(stretch.value))
        } else if (type === 'read') {
          const { invalidCount = 0 } = data
          yield maybeAwardBadge('errorLimit', invalidCount <= 3)
        } else if (type === 'debug') {
          const { stretch = {} } = game.value
          const { modifications = 0 } = meta
          yield maybeAwardBadge(
            'modLimit',
            modifications <= Number(stretch.value)
          )
        }

        function * maybeAwardBadge (name, comp) {
          if ((stretch.type === name || type === 'read') && comp) {
            if (!stretch.hard) {
              yield context.firebaseUpdate(
                savePath + `/challengeScores/${gameRef}`,
                { badge: 1 }
              )
            }
            yield actions.awardBadge(name, !badges[name])
          }
        }
      },
      * awardBadge ({ props, context }, badge, isNew) {
        const { saveRef } = props

        yield context.firebaseUpdate(`/saved/${saveRef}/badges`, { [badge]: 1 })

        if (isNew) {
          yield context.firebaseTransaction(
            `/users/${context.uid}/badges/${badge}`,
            val => (val || 0) + 1
          )
        }
      }
    }
  })
)

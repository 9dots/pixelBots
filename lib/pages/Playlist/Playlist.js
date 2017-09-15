/**
 * Imports
 */

import GameLoader from 'components/GameLoader'
import linesOfCode from 'utils/linesOfCode'
import {Block, Text, Icon} from 'vdux-ui'
import Loading from 'components/Loading'
import Results from 'components/Results'
import {component, element} from 'vdux'
import Button from 'components/Button'
import union from '@f/union'
import enroute from 'enroute'
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
  uid,
  assigned: false
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
      child: 'playlist'
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
    const playlistValue = progress.playlist

    return (
      <View key={`view-${props.current}`} {...props} savePath={state.savePath} {...playlistValue} current={props.current} next={actions.next} prev={actions.prev} />
    )
  },

  * onUpdate (prev, {props, state, actions, context}) {
    const {playlist, instanceRef} = props
    if (!prev.state.ready && !playlist.loading) {
      yield actions.setReady()
      const {sequence} = playlist.value.playlist
      const saved = Object.keys(playlist.value.savedChallenges || {})
      const newChallenges = sequence.filter(ref => saved.indexOf(ref) === -1)
      if (!playlist.value.savedChallenges || newChallenges.length > 0) {
        yield context.firebaseUpdate(
          `${state.savePath}/savedChallenges`,
          newChallenges.reduce((acc, ref, i) => ({...acc, [ref]: `${instanceRef}${saved.length + i}`}), {})
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
      const {sequence} = playlist.value.playlist
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
  render ({props, state, actions, context}) {
    const {sequence, game, playlist, playlistRef, saved} = props
    const current = parseInt(props.current, 10)
    const savedChallenges = playlist.value.savedChallenges

    const completed = props.completed
      ? props.completed[sequence[current]]
      : false

    const {loading, value = {}} = game
    const gameValue = value || {}

    if (loading) return <span />

    const titleActions = (onComplete, running, teacherBotRunning) => (
      <Block align='start center'>
        <Text fs='m'>{current + 1} / {sequence.length}</Text>
        <Button
          ml='2em'
          mr='0.5em'
          h={38}
          onClick={context.setUrl(`/playlist/${playlistRef}`)}>BACK</Button>
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

    return (
      router(props.subpage || 'default', {
        ...props,
        key: `playlist-game-holder-${sequence[current]}`,
        playlist: playlistLayout,
        onGameComplete: actions.onGameComplete,
        gameRef: sequence[current],
        saveRef: savedChallenges[sequence[current]],
        savedGame: saved.value,
        completed
      })
    )
  },

  controller: {
    * onGameComplete ({props, context, actions}, data) {
      const {sequence, current, game, savePath, playlist} = props
      const {completedChallenges = []} = playlist.value
      const {uid} = context
      const completed = union(completedChallenges, [sequence[current]])
      const {stretch = {}} = game.value
      const score = stretch.type ? 0.75 : 1

      yield context.firebaseSet(savePath + `/challengeScores/${sequence[current]}`, score)
      yield actions.awardBadges(data)

      yield context.firebaseUpdate(savePath + '/completedChallenges', completed)

      yield context.setUrl(`${context.url}/results`)
      if (sequence.every(val => completed.indexOf(val) > -1)) {
        yield context.firebaseUpdate(savePath, {
          completed: true
        })
        yield context.firebaseTransaction(
          `/users/${uid}/stats/playlistCompleted`,
          val => (val || 0) + 1
        )
      }
    },
    * awardBadges ({props, context, actions}, data) {
      const {sequence, current, playlist, game, savePath, saved} = props
      const {completedChallenges = []} = playlist.value
      const {uid} = context
      const {type = 'write', stretch = {}} = game.value
      const {steps = 0, badges = {}, meta = {}, animals = []} = saved.value
      const loc = linesOfCode((animals[0] || {}).sequence || 0)
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
        yield maybeAwardBadge('lineLimit', loc <= Number(stretch.value))
        yield maybeAwardBadge('stepLimit', steps <= Number(stretch.value))
      } else if (type === 'read') {
        const {invalidCount = 0} = data
        yield maybeAwardBadge('errorLimit', invalidCount <= 3)
      } else if (type === 'debug') {
        const {stretch = {}} = game.value
        const {modifications = 0} = meta
        yield maybeAwardBadge('modLimit', modifications <= Number(stretch.value))
      }

      function * maybeAwardBadge (name, comp) {
        if ((stretch.type === name || type === 'read') && comp) {
          yield context.firebaseSet(savePath + `/challengeScores/${sequence[current]}`, 1)
          yield actions.awardBadge(name, !badges[name])
        }
      }
    },
    * awardBadge ({props, context}, badge, isNew) {
      const saveRef = `/saved/${props.playlist.value.savedChallenges[props.sequence[props.current]]}`
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
  }
}))

/**
 * Imports
 */

import GameLoader from 'components/GameLoader'
import { Block, Icon } from 'vdux-ui'
import Loading from 'components/Loading'
import { component, element } from 'vdux'
import Button from 'components/Button'
import union from '@f/union'
import fire from 'vdux-fire'

export default fire(props => ({
  sandbox: `/sandbox/${props.sandboxRef}`
}))(
  component({
    render ({ props, state, context }) {
      const { sandbox } = props
      const { loading, value = {} } = sandbox
      if (loading) return <Loading />
      return (
        <View
          key={`view-${props.current}`}
          {...props}
          imageUrl={value.imageUrl}
          gameRef={null}
          saveRef={value.saveRef}
          title={value.title}
          description={value.description}
          isDraft={value.isDraft} />
      )
    }
  })
)

/** @jsx element */

const View = fire(props => ({
  saved: `/saved/${props.saveRef}`
}))(
  component({
    render ({ props, state, actions, context }) {
      const { saved, title, description, isDraft, imageUrl } = props
      const { loading, value = {} } = saved
      if (loading) return <span />
      const titleActions = (onComplete, running, teacherBotRunning) => (
        <Block align='start center'>
          <Button ml='2em' mr='0.5em' h={38} onClick={context.back()}>
            BACK
          </Button>
          <Button
            mr='0.5em'
            h={38}
            bgColor='blue'
            opacity={onComplete ? 1 : 0.5}
            disabled={running}
            onClick={onComplete}>
            <Icon name='check' fs='s' mr='xs' ml={-6} />
            PUBLISH
          </Button>
        </Block>
      )

      const playlistLayout = {
        title: title,
        img: imageUrl,
        subtitle: description,
        actions: titleActions,
        ref: props.sandboxRef
      }

      return (
        <GameLoader
          {...props}
          key={`sandbox-game-holder-${props.sandboxRef}`}
          playlist={playlistLayout}
          onGameComplete={actions.onGameComplete}
          savedGame={value}
          saveRef={props.saveRef}
          completed={isDraft} />
      )
    },

    controller: {
      * onGameComplete ({ props, context, actions }, data) {
        // const { sequence, savePath, playlist, gameRef } = props
        // const { completed, completedChallenges = [] } = playlist.value
        // // const { stretch } = game.value
        // const { uid } = context
        // const newCompletedChallenges = union(completedChallenges, [gameRef])
        // yield context.firebaseSet(savePath + `/challengeScores/${gameRef}`, {
        //   completed: 1
        // })
        // yield actions.awardBadges(data)
        // yield context.firebaseUpdate(
        //   savePath + '/completedChallenges',
        //   newCompletedChallenges
        // )
        // if (
        //   !completed &&
        //   sequence.every(
        //     val => newCompletedChallenges.indexOf(val.gameRef) > -1
        //   )
        // ) {
        //   yield context.firebaseUpdate(savePath, {
        //     completed: true
        //   })
        //   yield context.firebaseTransaction(
        //     `/users/${uid}/stats/playlistCompleted`,
        //     val => (val || 0) + 1
        //   )
        // }
      }
    }
  })
)

/**
 * Imports
 */

import SandboxConfigModal from 'components/SandboxConfigModal'
import PrintContainer from 'components/PrintContainer'
import initialGameState from 'utils/initialGameState'
import CheckingModal from 'components/CheckingModal'
import PreviewModal from 'components/PreviewModal'
import GameOutput from 'components/GameOutput'
import GameEditor from 'components/GameEditor'
import { component, element } from 'vdux'
import Layout from 'layouts/MainLayout'
import { Block } from 'vdux-ui'
import pick from '@f/pick'
import omit from '@f/omit'

const gameKeys = Object.keys(initialGameState)
/**
 * <WritingChallenge/>
 */

export default component({
  initialState: {
    checking: false
  },
  render ({ props, actions, children, context }) {
    const {
      gameHeight = '505px',
      isSingleChallenge,
      setCursorPosition,
      stretch = {},
      initialData,
      savedGame,
      playlist,
      imageUrl,
      isDraft,
      animals,
      active,
      type
    } = props

    const teacherBotRunning = animals.some(a => {
      return a.type === 'teacherBot' && a.hidden === false
    })

    const badges = [
      {
        type: 'completed',
        limit: 1,
        earned: savedGame.completed
      },
      {
        type: stretch.type,
        limit: stretch.value,
        earned: savedGame.badges && savedGame.badges[stretch.type]
      }
    ]

    const gameDisplay = (
      <Block tall wide minHeight={gameHeight}>
        <Block display='flex' tall wide>
          <Block display='flex' tall>
            <GameOutput
              {...initialData}
              {...omit(['runners', 'activeLine'], props)}
              teacherBotRunning={teacherBotRunning}
              onComplete={actions.onComplete}
              savedGame={savedGame}
              size='350px' />
          </Block>
          <Block flex tall>
            <GameEditor
              {...initialData}
              {...omit(['steps', 'animals', 'painted', 'targetPainted'], props)}
              setCursorPosition={setCursorPosition}
              sequence={animals[active].sequence}
              initialData={initialData}
              onChange={props.setSequence}
              resetGame={actions.resetGame} />
          </Block>
        </Block>
        {children}
      </Block>
    )

    if (isDraft || isSingleChallenge) return gameDisplay

    const onComplete =
      (animals[active].sequence || []).length > 0 && actions.onComplete

    return (
      <Block tall>
        <PrintContainer code={animals[active].sequence} />
        <Layout
          badges={type === 'sandbox' ? [] : badges}
          bodyProps={{ display: 'flex', px: '10px' }}
          navigation={[
            type === 'sandbox'
              ? {
                category: 'Sandbox Mode',
                title: playlist.title,
                onClick: context.openModal(() => (
                  <SandboxConfigModal
                    {...props}
                    {...actions}
                    title={playlist.title}
                    description={playlist.subtitle}
                    sandboxRef={playlist.ref}
                    saveRef={props.saveRef} />
                )),
                hoverProps: { textDecoration: 'underline' }
              }
              : {
                category: playlist.title,
                title: props.title,
                onClick: context.setUrl(`/playlist/${playlist.ref}`)
              }
          ]}
          titleImg={
            type === 'write' ? '/animalImages/writeImage.png' : imageUrl
          }
          titleActions={
            playlist &&
            playlist.actions(onComplete, props.running, teacherBotRunning)
          }>
          {gameDisplay}
        </Layout>
      </Block>
    )
  },

  controller: {
    * onComplete ({ props, context, actions }) {
      const { type, stretch, gameActions } = props
      const { indicator = 'lloc', value, label = 'lines' } = stretch || {}
      if (type === 'project') {
        return yield context.openModal(() => (
          <CheckingModal
            stretch={stretch}
            isSingleChallenge={props.isSingleChallenge}
            onComplete={props.onComplete}
            next={props.next}
            saveRef={props.saveRef}
            correct />
        ))
      } else if (type === 'sandbox') {
        return yield context.openModal(() => (
          <PreviewModal isSubmit {...props} />
        ))
      }
      if (
        stretch &&
        (stretch.hard &&
          stretch.type === 'lineLimit' &&
          props[indicator] > value)
      ) {
        yield context.openModal({
          header: 'Whoops!',
          body: (
            <Block textAlign='center'>
              Your solution has too many {label.toLowerCase()}. Try again.
            </Block>
          )
        })
      } else {
        yield gameActions.reset()
        yield gameActions.setTeacherRunning(true)
        yield gameActions.addTeacherBot()
        const res = yield actions.checkSolution()
        if (res.error) {
          return yield actions.handleCheckSolutionError()
        }
        const { status, failedSeeds } = res.value
        if (status === 'failed') {
          yield props.setRandSeeds(failedSeeds.map(fail => fail.seed))
        }
        try {
          yield props.runCheck(() => [
            gameActions.removeTeacherBot(),
            gameActions.setTeacherRunning(false),
            context.openModal(() => (
              <CheckingModal
                stretch={stretch}
                onComplete={props.onComplete}
                isSingleChallenge={props.isSingleChallenge}
                next={props.next}
                saveRef={props.saveRef}
                correct={status === 'success'} />
            ))
          ])
        } catch (e) {}
      }
    },
    // Handle an error in the solution checker
    * handleCheckSolutionError ({ props, context }) {
      yield [
        props.setTeacherRunning(false),
        props.removeTeacherBot(),
        props.setHasRun(false)
      ]
      yield context.toast(
        'Error connecting to solution checker. Please try again.'
      )
    },
    // Hit the cloud functions to check the results of the code
    * checkSolution ({ context, props }) {
      const { initialData } = props
      try {
        const res = yield context.fetch(
          `${process.env.CLOUD_FUNCTIONS}/solutionChecker`,
          {
            method: 'POST',
            body: {
              props: pick(gameKeys, {
                ...props,
                targetPainted: initialData.targetPainted
              })
            }
          }
        )
        return res
      } catch (e) {
        return { error: e }
      }
    }
  },
  reducer: {
    setChecksRes: (state, checksRes) => ({ checksRes })
  }
})

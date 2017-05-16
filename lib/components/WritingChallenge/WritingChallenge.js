/**
 * Imports
 */

import {getLastFrame, generatePainted, createFrames} from 'utils/frameReducer'
import checkCorrect from 'pages/Game/utils/checkCorrect'
import PrintContainer from 'components/PrintContainer'
import getIterator from 'pages/Game/utils/getIterator'
import GameOutput from 'components/GameOutput'
import GameEditor from 'components/GameEditor'
import linesOfCode from 'utils/linesOfCode'
import {component, element} from 'vdux'
import Layout from 'layouts/MainLayout'
import {Text, Block} from 'vdux-ui'
import animalApis from 'animalApis'
import omit from '@f/omit'

/**
 * <WritingChallenge/>
 */

export default component({
  initialState: {
    checking: false
  },
  render ({props, actions, children}) {
    const {playlist, animals, active, initialData, isDraft} = props

    const gameDisplay = (
      <Block tall wide minHeight={600}>
        <Block display='flex' tall wide>
          <Block display='flex' tall>
            <GameOutput
              {...initialData}
              {...omit('runners', props)}
              runCode={actions.runCode}
              size='350px' />
          </Block>
          <Block flex tall>
            <GameEditor
              {...initialData}
              {...props}
              sequence={animals[active].sequence}
              initialData={initialData}
              canCode
              onChange={props.setSequence}
              resetGame={actions.resetGame} />
          </Block>
        </Block>
        {children}
      </Block>
  )

    if (isDraft) return gameDisplay

    return (
      <Block tall>
        <PrintContainer code={animals[active].sequence} />
        <Layout
          bodyProps={{display: 'flex', px: '10px'}}
          navigation={[
            playlist && {category: 'playlist', title: playlist.title},
            {category: 'challenge', title: props.title}
          ]}
          titleActions={playlist && playlist.actions}
          titleImg={playlist ? playlist.img : props.imageUrl}>
          {gameDisplay}
        </Layout>
      </Block>
    )
  },

  * onUpdate (prev, {props, actions, state}) {
    const {hasRun, running, isDraft, advanced, completed} = props
    const {checksRes} = state
    // if (hasRun && prev.props.running && (advanced && !isDraft) && prev.props.running !== running) {
    //   yield actions.checkSolution()
    // }
    if (prev.props.completed !== completed || prev.state.checksRes !== checksRes) {
      yield actions.checkSolution()
    }
  },

  controller: {
    * runCode ({props, context, actions}) {
      yield actions.setChecksRes(undefined)
      yield props.runCode()
      const res = yield context.fetch('https://us-central1-artbot-dev.cloudfunctions.net/solutionChecker', {
        method: 'POST',
        body: {props}
      })
      yield actions.setChecksRes(res.value)
    },

    * checkSolution ({props, actions, state, context}) {
      const {advanced, targetPainted, completed, painted, solutionIterator} = props
      const {checksRes} = state
      if (!completed || !checksRes) return
      const target = advanced
        ? generateSolution(props, solutionIterator)
        : targetPainted
      const correctness = checkCorrect(painted, target)
      if (correctness && checksRes.status === 'failed') {
        yield props.setRandSeeds(checksRes.failedSeeds)
        return yield context.openModal({
          header: 'Does not pass all tests',
          body: 'This is a temporary message to let you know that it does not pass all tests'
        })
      }
      if (correctness) {
        yield actions.onComplete()
      }
    },

    * onComplete ({props, context}) {
      const {animals} = props
      const loc = linesOfCode(animals[0].sequence)
      yield context.openModal(winMessage(`You wrote ${loc} lines of code to draw this picture!`))

      if (!props.draft) {
        yield props.onComplete()
      }
    }
  },
  reducer: {
    setChecksRes: (state, checksRes) => ({checksRes})
  }
})

/**
 * Helpers
 */

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

function generateSolution ({initialPainted, solution, levelSize, active, startGrid}, code) {
  return createFrames({
    active: 0,
    painted: startGrid,
    animals: solution.map(animal => ({...animal, current: animal.initial}))
  }, code).pop().painted
}

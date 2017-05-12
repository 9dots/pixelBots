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
  render ({props, actions, children}) {
    const {playlist, animals, active, initialData, isDraft} = props

    const gameDisplay = (
      <Block tall wide minHeight={600}>
        <Block display='flex' tall wide>
          <Block display='flex' tall>
            <GameOutput
              {...initialData}
              {...omit('runners', props)}
              runCode={props.runCode}
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

  * onUpdate (prev, {props, actions}) {
    const {hasRun, running, isDraft, advanced} = props

    if (hasRun && prev.props.running && (advanced && !isDraft) && prev.props.running !== running) {
      yield actions.checkSolution()
    }
  },

  controller: {
    // * runCode ({props}) {
    //   const {advanced, active, animals, isDraft, solutionIterator} = props
    //   if (advanced && !isDraft) {
    //     const base = {...props, painted: {}}
    //     const startCode = getIterator(base.initialPainted, animalApis['teacherBot'].default(active))
    //     const userCode = getIterator(animals[active].sequence, animalApis[animals[active].type].default(active))
    //
    //     for (let i = 0; i < 100; i++) {
    //       const painted = generatePainted(base, startCode)
    //       const answer = getLastFrame({...base, painted}, userCode)
    //
    //       if (!checkCorrect(answer, generateSolution({...props, startGrid: painted}, solutionIterator))) {
    //         yield props.setInitialPainted(painted)
    //         break
    //       }
    //     }
    //   }
    //
    //   yield props.runCode()
    // },

    * checkSolution ({props, actions}) {
      const {advanced, targetPainted, painted, solutionIterator} = props
      const target = advanced
        ? generateSolution(props, solutionIterator)
        : targetPainted

      if (checkCorrect(painted, target)) {
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

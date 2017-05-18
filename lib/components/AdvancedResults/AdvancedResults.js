/**
 * Imports
 */

import {Image, Modal, Block, Button, Text, Icon} from 'vdux-ui'
import initialGameState from 'utils/initialGameState'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import Grid from 'components/Grid'
import pick from '@f/pick'

const gameKeys = Object.keys(initialGameState)

/**
 * <Advanced Results/>
 */
export default component({
  initialState: {
    results: undefined
  },
  * onCreate ({props, context, actions}) {
    console.log(props.targetPainted)
    const {value} = yield context.fetch('https://us-central1-artbot-dev.cloudfunctions.net/solutionChecker', {
      method: 'POST',
      body: {props: pick(gameKeys, props)}
    })
    yield actions.setResults(value)
  },
  render ({props, state, context}) {
    const {results} = state
    return (
      <Modal w='650px' onDismiss={context.closeModal} borderRadius={10} relative p pl='125' boxShadow='rgba(0,0,0, 1) 0px 0px 140px' mt={80}>
        <Icon name='close' bgColor='black' border='2px solid white' circle='30' align='center center' absolute top right m={-15} color='white' bolder fs='20' boxShadow='0 1px 8px rgba(0,0,0,.5)' pointer onClick={context.closeModal} />
        <Image src='/animalImages/chaoslarge.png' absolute top bottom left={-120} m='auto' />
        <Block align='center center' h={300}>
          {
            results
              ? <Stats results={results} {...props}/>
              : <Loading wide fs='xxs' fontFamily='"Press Start 2P"' message='Computing…' position='static' sq='auto' />
          }
        </Block>
      </Modal>
    )
  },
  reducer: {
    setResults: (state, results) => ({results})
  }
})

const Stats = component({
  initialState ({props}) {
    const {results} = props
    const correct = results.correctSeeds || []
    const wrong = results.failedSeeds || []
    return {
      paints: mapPainted(wrong, false).concat(mapPainted(correct, true)),
      numCorrect: correct.length,
      numWrong: wrong.length,
      cur: 0
    }
  },
  render ({props, state, actions}) {
    const {paints, numCorrect, numWrong, cur} = state
    const {levelSize} = props
    const btnProps = {
      activeProps: {opacity: .6},
      hoverProps: {opacity: 1},
      transition: 'opacity .25s',
      color: 'primary',
      opacity: .6,
      fs: 50
    }

    return (
      <Block fontFamily='"Press Start 2P"' wide>
        <Block textAlign='center'>
          I have the results!
          <Block align='center center' mt fontFamily='Lato, sans-serif'>
            <Text color='green' mr>{numCorrect} Correct</Text>
            <Text color='red'>{numWrong} Wrong</Text>
          </Block>
        </Block>
        <Block mt='l' mb mx='auto' align='center center'>
          <Button {...btnProps} icon='chevron_left' onClick={actions.setCur((paints.length + (cur - 1)) % paints.length)} />
          <Block align='space-between center' relative w={380} mx>
            <Grid
              levelSize='180px'
              animals={[]}
              painted={paints[cur].painted}
              numRows={levelSize[0]}
              numColumns={levelSize[1]} />
            <Grid
              levelSize='180px'
              animals={[]}
              painted={paints[cur].userSolution}
              numRows={levelSize[0]}
              numColumns={levelSize[1]} />
              {
                paints[cur].correct
                  ? <Correcticon name='check' bg='green' />
                  : <Correcticon name='close' bg='red' />
              }
          </Block>
          <Button {...btnProps} icon='chevron_right' onClick={actions.setCur((cur + 1) % paints.length)} />
        </Block>
        <Block textAlign='center'>{cur + 1} of {paints.length}</Block>
      </Block>
    )
  },
  reducer: {
    setCur: (state, cur) => ({cur})
  }
})

const Correcticon = component({
  render ({props}) {
    return (
      <Icon
        z={999}
        fs='22'
        fw='bolder'
        align='center center'
        absolute left={-15} top={-15}
        color='white'
        circle='30'
        {...props} />
    )
  }
})

function mapPainted (seeds, correct) {
  return seeds.map(s => ({...s, correct}))
}

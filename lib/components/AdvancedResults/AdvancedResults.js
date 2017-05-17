/**
 * Imports
 */

import {Image, Modal, Block, Text, Icon} from 'vdux-ui'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import {Button} from 'vdux-containers'
import Grid from 'components/Grid'

/**
 * <Advanced Results/>
 */
console.log('test')
export default component({
  initialState: {
    results: undefined
  },
  * onCreate ({props, context, actions}) {
    const {value} = yield context.fetch('https://us-central1-artbot-dev.cloudfunctions.net/solutionChecker', {
      method: 'POST',
      body: {props}
    })
    yield actions.setResults(value)
  },
  render ({props, state, context}) {
    const {results} = state
    return (
      <Modal onDismiss={context.closeModal} borderRadius={10} relative p pl='180' boxShadow='rgba(0,0,0, 1) 0px 0px 140px'>
        <Image src='/animalImages/chaos.png' absolute left={-90} />
        <Block align='center center' h={300}>
          {
            results
              ? <Stats results={results} {...props}/>
              : <Loading wide fs='xxs' fontFamily='"Press Start 2P"' message='Computing results!' position='static' sq='auto' />
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
      activeProps: {opacity: .8}, 
      hoverProps: {opacity: 1},
      color: 'primary',
      opacity: .8,  
      fs: 50
    }

    return (
      <Block fontFamily='"Press Start 2P"'>
        <Block textAlign='center'>I have the results</Block>
        <Block mt='l' mb mx='auto' align='center center'>
          <Button {...btnProps} icon='chevron_left' onClick={actions.setCur((paints.length + (cur - 1)) % paints.length)} />
          <Block relative w={200} mx>
            <Grid
              levelSize='200px'
              animals={[]}
              painted={paints[cur].painted}
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
        <Block align='center center' fs='xxs'>
          <Text color='green' mr>{numCorrect} Correct</Text>
          <Text color='red'>{numWrong} Wrong</Text>
        </Block>
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
        fs='20'
        boxShadow='rgba(0,0,0,.5) 0px 1px 6px'
        align='center center'
        border='2px solid white'
        absolute top={-15} right={-15}
        color='white'
        circle='30'
        {...props} />
    )
  }
})

function mapPainted (seeds, correct) {
  return seeds.map(s => ({painted: s.painted, correct}))
}

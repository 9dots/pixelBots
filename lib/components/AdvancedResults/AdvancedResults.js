/**
 * Imports
 */

import {Image, Modal, Block, Icon} from 'vdux-ui'
import initialGameState from 'utils/initialGameState'
import Loading from 'components/Loading'
import {component, element} from 'vdux'
import {Button, Text} from 'vdux-containers'
import Grid from 'components/Grid'
import Switch from '@f/switch'
import sleep from '@f/sleep'
import pick from '@f/pick'

const project = process.env.NODE_ENV === 'dev'
  ? 'dev'
  : '26016'

const gameKeys = Object.keys(initialGameState)

/**
 * <AdvancedResults/>
 */

export default component({
  initialState: {
    results: undefined
  },
  * onCreate ({props, context, actions}) {
    const {initialData} = props
    const {value} = yield context.fetch(`https://us-central1-artbot-${project}.cloudfunctions.net/solutionChecker`, {
      method: 'POST',
      body: {props: pick(gameKeys, {...props, targetPainted: initialData.targetPainted})}
    })
    yield actions.setResults(value)
  },
  render ({props, state, context}) {
    const {results, error} = state

    return (
      <Modal w='650px' onDismiss={context.closeModal} borderRadius={10} relative p='16px 16px 8px 125px' boxShadow='rgba(0,0,0, 1) 0px 0px 140px' mt={80}>
        <Icon name='close' bgColor='black' border='2px solid white' circle='30' align='center center' absolute top right m={-15} color='white' bolder fs='20' boxShadow='0 1px 8px rgba(0,0,0,.5)' pointer onClick={context.closeModal} />
        <Image src='/animalImages/chaoslarge.png' absolute top bottom left={-120} m='auto' />
        <Block align='center center' h={400}>
          {
            results
              ? <Stats error={error} results={results} {...props}/>
              : <Loading wide fs='xxs' fontFamily='"Press Start 2P"' message='Computing…' position='static' sq='auto' />
          }
        </Block>
      </Modal>
    )
  },
  reducer: {
    setResults: (state, results) => ({results, error: results.error})
  }
})

const Stats = component({
  initialState ({props}) {
    const {results, error} = props
    const correct = results.correctSeeds || []
    const wrong = results.failedSeeds || []
    return {
      paints: mapPainted(wrong, false).concat(mapPainted(correct, true)),
      numCorrect: correct.length,
      numWrong: wrong.length,
      steps: results.steps,
      error,
      cur: 0
    }
  },
  render ({props, state, actions, context}) {
    const {paints, numCorrect, numWrong, steps, cur, error} = state
    const {levelSize, type, lineLimit} = props

    const btnProps = {
      activeProps: {opacity: .6},
      hoverProps: {opacity: 1},
      transition: 'opacity .25s',
      color: 'primary',
      opacity: .6,
      fs: 40
    }

    const gameOverBtnProps = (color = 'blue') => ({
      textTransform: 'uppercase',
      bgColor: color,
      w: '120px',
      p: 's',
      fs: 's'
    })

    const gridWidth = 160

    if (error) {
      return (
        <Block wide>
          <Block textAlign='center' fontFamily='"Press Start 2P"'>
            <Block color='red'>Error: </Block>
            <Block align='center center' mt mx='10' fs='10' lh='20px'>
              Check the code at line {error.loc.line}
            </Block>
          </Block>
        </Block>
      )
    }

    return (
      <Block wide>
        <Block textAlign='center' fontFamily='"Press Start 2P"'>
          <Block color='blue'>I have the results: </Block>
          <Block align='center center' mt mx='10' fs='10' lh='20px'>
            {
              Switch({
                0: () => (
                  <Block>
                    {"Try again! Your robot didn't solve any of my grids yet."}
                  </Block>
                ),
                [paints.length]: () => (
                  <Block>
                    You did it! Great job!
                  </Block>
                ),
                default: () => (
                  <Block>
                    Good try! You solved <Text fontFamily='"Press Start 2P"' color='blue'>{numCorrect}</Text> of my grids. Now make sure your code can solve all of them!
                  </Block>
                )
              })(numCorrect)
            }
          </Block>
        </Block>
        <Block mt={28} mb={10} mx='auto' align='center center'>
          <Block w={380}>
            <Block onClick={actions.setSeed(paints[cur].seed)} align='space-between center' relative wide>
              <Grid
                levelSize={gridWidth}
                animals={[]}
                painted={paints[cur].painted}
                numRows={levelSize[0]}
                numColumns={levelSize[1]} />
              <Grid
                levelSize={gridWidth}
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
            <Block wide align='space-between center' textAlign='center' mt>
              <Block w={gridWidth}>Initial</Block>
              <Block w={gridWidth}>Your Result</Block>
            </Block>
          </Block>
        </Block>
        <Block align='center center' mt={12}>
          <Button {...btnProps} icon='chevron_left' onClick={actions.setCur((paints.length + (cur - 1)) % paints.length)} />
          <Block mx textAlign='center' fs={16} fontFamily='"Press Start 2P"'>{cur + 1} of {paints.length}</Block>
          <Button {...btnProps} icon='chevron_right' onClick={actions.setCur((cur + 1) % paints.length)} />
        </Block>
        {
          <Block mt align='center center'>
            <Button hide={numWrong > 0} onClick={context.closeModal} {...gameOverBtnProps('grey')} color='primary'>Revise</Button>
            <Button ml onClick={props.onComplete()} {...gameOverBtnProps('green')} hide={numWrong > 0}>Submit</Button>
            <Text textDecoration='underline' pointer fs='xxs' opacity={.6} hoverProps={{opacity: .8}} onClick={props.next}>Skip Challenge Anyway</Text>
          </Block>
        }
      </Block>
    )
  },
  controller: {
    * setSeed ({props, context}, seed) {
      yield props.setRandSeeds([seed])
      yield context.closeModal()
      yield sleep(50)
      yield props.reset()
    }
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
        absolute right={-15} top={-15}
        color='white'
        circle='30'
        {...props} />
    )
  }
})

function mapPainted (seeds, correct) {
  return seeds.map(s => ({...s, correct}))
}

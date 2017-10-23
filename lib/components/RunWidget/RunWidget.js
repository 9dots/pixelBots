/**
 * Imports
 */

import GameButton from 'components/GameButton'
import { Block, Icon, Slider } from 'vdux-ui'
import { component, element } from 'vdux'

/**
 * <Run Widget/>
 */

export default component({
  render ({ props, actions }) {
    const {
      hasRun,
      speed,
      running,
      canRun,
      steps = 0,
      completed,
      isDraft,
      hasCode,
      advanced,
      isProject,
      onComplete,
      gameActions,
      teacherRunning
    } = props
    const current = getSymbols(canRun, running)
    const btnProps = { px: 12, fs: 35 }
    const hasSubmit = !(isDraft && advanced)

    return (
      <Block
        bgColor='white'
        border='1px solid divider'
        mt='0.5em'
        wide
        p='10px'>
        <Block align='center center'>
          <GameButton
            disabled={teacherRunning || running || !hasRun}
            onClick={gameActions.reset}
            flex={!hasSubmit}
            maxWidth={90}
            bg='red'
            mr='s'
            py='3px'
            {...btnProps}>
            <Icon fs='inherit' bolder name='replay' />
          </GameButton>
          <GameButton
            disabled={!hasCode || teacherRunning}
            onClick={actions.handleClick}
            bg='green'
            mr='s'
            flex
            {...btnProps}>
            <Icon ml='-2px' fs='inherit' name={current.icon} />
          </GameButton>
          <GameButton
            disabled={completed || running || !hasCode || teacherRunning}
            onClick={gameActions.stepForward}
            flex={!hasSubmit}
            maxWidth={90}
            bg='#ffcb2f'
            py='3px'
            {...btnProps}>
            <Icon fs='inherit' bolder name='skip_next' />
          </GameButton>
          {hasSubmit && (
            <GameButton
              disabled={running || !hasCode || teacherRunning}
              onClick={onComplete}
              p='3px 14px'
              bg='blue'
              fs={17}
              h={45}
              ml='s'>
              {isProject ? 'SUBMIT' : 'CHECK'}
            </GameButton>
          )}
        </Block>
        <Block wide mt={12} align='start center' userSelect='none'>
          <Block align='center center' flex>
            <Icon
              name='play_arrow'
              cursor='default'
              color='blue'
              mr={-6}
              fs='l' />
            <Slider
              handleProps={{ borderRadius: 2, h: 35, w: 20, bgColor: 'blue' }}
              onChange={gameActions.setSpeed}
              startValue={2}
              min={0.5}
              max={10}
              mx />
            <Icon
              name='fast_forward'
              cursor='default'
              color='blue'
              w={24}
              fs={27}
              ml={-6}
              mr={-13} />
          </Block>
          <Block
            border='1px solid divider'
            whiteSpace='nowrap'
            textAlign='center'
            ml={30}
            p={10}
            w={92}>
            Step: {running && speed > 8 ? '...' : steps}
          </Block>
        </Block>
      </Block>
    )
  },
  controller: {
    * handleClick ({ props }) {
      yield props.runCode()
    }
  }
})

function getSymbols (canRun, running) {
  if (!canRun) return { icon: 'done', text: 'check' }
  if (running) return { icon: 'pause', text: 'pause' }
  return { icon: 'play_arrow', text: 'run' }
}

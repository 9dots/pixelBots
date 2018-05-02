/**
 * Imports
 */

import PreviewModal from 'components/PreviewModal'
import GameButton from 'components/GameButton'
import { Block, Icon, Slider } from 'vdux-ui'
import { component, element } from 'vdux'

/**
 * <Run Widget/>
 */

export default component({
  render ({ props, actions, context }) {
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
      isSandbox,
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
          {!isSandbox && (
            <GameButton
              disabled={completed || running || !hasCode || teacherRunning}
              onClick={gameActions.stepForward(false)}
              flex={!hasSubmit}
              maxWidth={90}
              bg='#ffcb2f'
              py='3px'
              {...btnProps}>
              <Icon fs='inherit' bolder name='skip_next' />
            </GameButton>
          )}
          {isSandbox && (
            <GameButton
              disabled={completed || running || !hasCode || teacherRunning}
              onClick={gameActions.stepForward(true)}
              flex={!hasSubmit}
              maxWidth={90}
              bg='#ffcb2f'
              py='3px'
              borderRadius='3px 0 0 3px'
              borderColor='rgba(black, .1)'
              borderWidth='0 1px 0 0'
              {...btnProps}>
              <Icon fs='inherit' bolder name='redo' />
            </GameButton>
          )}
          {isSandbox && (
            <GameButton
              disabled={completed || running || !hasCode || teacherRunning}
              onClick={gameActions.stepForward(false)}
              flex={!hasSubmit}
              maxWidth={90}
              bg='#ffcb2f'
              py='3px'
              borderRadius='0 3px 3px 0'
              borderWidth='0 0 0 0'
              {...btnProps}>
              <Icon fs='inherit' bolder name='skip_next' />
            </GameButton>
          )}
          {isSandbox && (
            <GameButton
              disabled={running || !hasCode || teacherRunning}
              onClick={context.openModal(() => (
                <PreviewModal {...props} {...actions} />
              ))}
              p='3px 14px'
              bg='blue'
              h={isSandbox ? 41 : 45}
              ml='s'>
              <Icon fs='inherit' bolder name='visibility' />
            </GameButton>
          )}
          {hasSubmit &&
            !isSandbox && (
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
              handleProps={{
                borderRadius: 2,
                h: 35,
                w: 20,
                bgColor: 'blue',
                left: speed
                  ? (Math.log(speed) / Math.log(1.6) - 0.5) / (10 - 0.5) * 100 +
                    '%'
                  : null
              }}
              progressProps={{
                w: speed
                  ? (Math.log(speed) / Math.log(1.6) - 0.5) / (10 - 0.5) * 100 +
                    '%'
                  : null
              }}
              onChange={gameActions.setSpeed}
              startValue={speed ? Math.log(speed) / Math.log(1.6) : 2}
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
            w={92}
            fs={isSandbox ? 'xs' : 'auto'}>
            {isSandbox
              ? `Speed: ${getPrettySpeed(speed)}`
              : `Step: ${running && speed > 8 ? '...' : steps}`}
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

function getPrettySpeed (speed) {
  const uglyLower = Math.log(1.2649110640673518)
  const uglyUpper = Math.log(109.95116277760012)
  const prettySpeed =
    1 + 99 * (Math.log(speed) - uglyLower) / (uglyUpper - uglyLower)
  return Math.trunc(prettySpeed)
}

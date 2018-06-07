/**
 * Imports
 */

import { Image, Modal, Block, Icon } from 'vdux-ui'
import { Button, Text } from 'vdux-containers'
import { component, element } from 'vdux'
import Badge from 'components/Badge'
import getProp from '@f/get-prop'
import fire from 'vdux-fire'

const gameOverBtnProps = (color = 'blue') => ({
  textTransform: 'uppercase',
  bgColor: color,
  w: '120px',
  p: 's',
  fs: 's'
})

/**
 * <CheckingModal/>
 */

export default component({
  render ({ props, state, context }) {
    const {
      correct,
      stretch = {},
      saveRef,
      invalidCount,
      isSingleChallenge,
      type
    } = props
    return (
      <Modal
        w='650px'
        onDismiss={!isSingleChallenge && context.closeModal}
        borderRadius={10}
        relative
        p='16px 16px 8px 125px'
        boxShadow='rgba(0,0,0, 1) 0px 0px 140px'
        mt={80}>
        {!isSingleChallenge && (
          <Icon
            name='close'
            bgColor='black'
            border='2px solid white'
            circle='30'
            align='center center'
            absolute
            top
            right
            m={-15}
            color='white'
            bolder
            fs='20'
            boxShadow='0 1px 8px rgba(0,0,0,.5)'
            pointer
            onClick={context.closeModal} />
        )}
        <Image
          src='/animalImages/chaoslarge.png'
          absolute
          top
          bottom
          left={-120}
          m='auto' />
        <Block align='center center' h={correct ? 'auto' : 220}>
          {correct ? (
            <Passed
              onComplete={props.onComplete}
              isSingleChallenge={isSingleChallenge}
              saveRef={saveRef}
              stretch={stretch}
              invalidCount={invalidCount}
              type={type} />
          ) : (
            <Failed next={props.next} type={type} />
          )}
        </Block>
      </Modal>
    )
  }
})

const badgeKey = {
  errorLimit: 'invalidCount',
  stepLimit: 'steps',
  modLimit: 'meta.modifications',
  lineLimit: 'meta.loc'
}

const Passed = fire(props => ({
  savedGame: `/saved/${props.saveRef}`
}))(
  component({
    onCreate ({ props }) {
      return props.onComplete()
    },
    render ({ props, context }) {
      const { stretch, savedGame, invalidCount, isSingleChallenge } = props
      const { type, label = '', value } = stretch

      if (savedGame.loading) return <span />

      const count =
        type === 'errorLimit'
          ? invalidCount
          : getProp(`value.${badgeKey[type]}`, savedGame) || 0

      const earned = count <= value

      const title = earned ? (
        false
      ) : (
        <Block>
          Finish in {value}
          <br />
          {label.toLowerCase()} or less
        </Block>
      )
      const titleProps = {
        align: 'center center',
        lh: '2em',
        mt: 16,
        fs: 11,
        h: 40
      }

      return (
        <Block wide tall column align='space-around center' py>
          <Block textAlign='center' fontFamily='&quot;Press Start 2P&quot;'>
            <Block color='blue'>You solved the challenge!</Block>
          </Block>
          <Block textAlign='center' p>
            <Block align='center center' pt>
              <Badge
                titleProps={titleProps}
                title='Completed'
                type='completed'
                hideCount
                count={1} />
              {type && (
                <Badge
                  titleProps={titleProps}
                  count={earned ? 1 : 0}
                  title={title}
                  type={type}
                  hideCount
                  ml='l' />
              )}
            </Block>
          </Block>
          {!isSingleChallenge && (
            <Block>
              <Button
                {...gameOverBtnProps('green')}
                mr='s'
                onClick={context.closeModal}
                text='Revise' />
              <Button
                {...gameOverBtnProps()}
                ml='s'
                onClick={context.setUrl(
                  props.type === 'game' ? `/map/view` : `${context.url}/results`
                )}
                text={props.type === 'game' ? 'Next' : 'Submit'} />
            </Block>
          )}
        </Block>
      )
    }
  })
)

const Failed = component({
  render ({ props, context }) {
    return (
      <Block wide tall column align='space-around center' py>
        <Block textAlign='center' fontFamily='&quot;Press Start 2P&quot;'>
          <Block color='red'>Uh Oh!</Block>
        </Block>
        <Block textAlign='center' p w='75%'>
          Your code didn't solve this challenge quite yet. Keep on trying until
          you get it!
        </Block>
        <Button
          {...gameOverBtnProps()}
          my='s'
          onClick={context.closeModal}
          text='Try Again' />

        <Text
          hide={props.type === 'game'}
          textDecoration='underline'
          pointer
          fs='xxs'
          opacity={0.6}
          hoverProps={{ opacity: 0.8 }}
          onClick={props.next}>
          Skip Challenge Anyway
        </Text>
      </Block>
    )
  }
})

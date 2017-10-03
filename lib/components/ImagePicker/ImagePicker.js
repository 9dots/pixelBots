/**
 * Imports
 */

import { Block, Image, Modal, ModalBody, ModalHeader } from 'vdux-ui'
import { component, element } from 'vdux'
import { CSSContainer, wrap } from 'vdux-containers'
import mapValues from '@f/map-values'
import { images } from 'animalApis'

/**
 * <ImagePicker/>
 */

export default component({
  render ({ props, context }) {
    const { closeModal } = context

    return (
      <Modal w={460} onDismiss={closeModal()}>
        <ModalHeader fs='s' py='l' fontFamily='&quot;Press Start 2P&quot;'>
          Select Your Bot!
        </ModalHeader>
        <ModalBody px={40}>
          <Block align='center center' flexWrap='wrap' pb='l'>
            {mapValues(
              (url, bot) => filterUrl(url) && <Bot src={url} bot={bot} />,
              images
            )}
          </Block>
        </ModalBody>
      </Modal>
    )
  }
})

const Bot = wrap(CSSContainer, {
  hoverProps: { hovering: true }
})(
  component({
    render ({ props, context, actions }) {
      const { src, hovering } = props

      return (
        <Block
          opacity={hovering ? 0.5 : 1}
          transition='all .25s'
          pointer
          onClick={[actions.setBot, context.closeModal]}>
          <Image display='block' sq={110} m='s' src={src} />
        </Block>
      )
    },
    controller: {
      * setBot ({ context, props }) {
        yield context.firebaseSet(`/users/${context.uid}/photoURL/`, props.src)
        yield context.firebaseSet(`/users/${context.uid}/bot/`, props.bot)
      }
    }
  })
)

/**
 * Helpers
 */

const blackList = ['teacherBot']

function filterUrl (url) {
  return !blackList.some(function (str) {
    return url.indexOf(str) !== -1
  })
}

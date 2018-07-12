/**
 * Imports
 */

import BotModal from 'components/BotModal'
import { component, element } from 'vdux'
import { Block, Icon } from 'vdux-containers'

/**
 * <Instructions Button/>
 */

export default component({
  render ({ props, context }) {
    const { html, ...rest } = props
    return (
      html && (
        <Icon
          name='help_outline'
          color='blue'
          float='right'
          pointer
          onClick={context.openModal(() => (
            <BotModal
              confirm={context.closeModal}
              confirmText='Got it!'
              body={
                <Block
                  textAlign='center'
                  innerHTML={html}
                  minHeight={100}
                  py='l' />
              } />
          ))}
          {...rest} />
      )
    )
  }
})

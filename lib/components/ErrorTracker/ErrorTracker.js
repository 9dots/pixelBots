/**
 * Imports
 */

import { component, element } from 'vdux'
import { Block, Icon } from 'vdux-ui'

/**
 * <Error Tracker/>
 */

export default component({
  render ({ props }) {
    const { invalid, errorMessage, infoMessage } = props

    return (
      <Block>
        <Block column align='start center'>
          <Block pb='s' align='start center' hide={!invalid}>
            <Icon name='error' color='red' mr='s' />
            <Block fontFamily='&quot;Press Start 2P&quot;'>x{invalid}</Block>
          </Block>
          <Block textTransform='uppercase' hide={!errorMessage} fs='s'>
            Wrong {errorMessage}
          </Block>
        </Block>
        <Block align='start start'>
          <Block pb='s' ml='s' align='start center' hide={!infoMessage}>
            <Icon name='info' color='blue' mr='s' />
            <Block fs='s'>{infoMessage}</Block>
          </Block>
        </Block>
      </Block>
    )
  }
})

/**
 * Imports
 */

import BlockEditor from 'components/BlockEditor'
import CodeEditor from 'components/CodeEditor'
import { component, element } from 'vdux'
import { Block } from 'vdux-ui'

/**
 * <GameEditor/>
 */

export default component({
  render ({ props }) {
    const { inputType, targetPainted, w, type, setCursorPosition } = props

    return (
      <Block
        minWidth='480px'
        column
        tall
        relative
        flex
        w={w || '100%'}
        color='white'>
        {inputType === 'code' ? (
          <CodeEditor
            {...props}
            setCursorPosition={setCursorPosition}
            hideApi={type === 'read'}
            canAutoComplete={!!targetPainted} />
        ) : (
          <BlockEditor
            {...props}
            startCode={props.isEdit}
            hideApi={type === 'read'}
            canAutoComplete={!!targetPainted} />
        )}
      </Block>
    )
  }
})

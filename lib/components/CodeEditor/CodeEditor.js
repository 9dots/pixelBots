/**
 * Imports
 */

import EditorBar from 'components/EditorBar'
import TextApi from 'components/TextApi'
import CodeButtons from 'components/CodeButtons'
import {component, element} from 'vdux'
import {Block, Box} from 'vdux-ui'
import Ace from 'vdux-ace'
import omit from '@f/omit'

require('brace/mode/javascript')
require('brace/theme/tomorrow_night')

/**
 * <Code Editor/>
 */

export default component({
  render ({props, actions}) {
    const {activeLine, lloc, startOver, readOnly, modifications, canAutoComplete, initialData, sequence = '', docs, startCode, hasRun, saved, saveRef} = props
    const jsOptions = {
      undef: true,
      esversion: 6,
      asi: true,
      browserify: true,
      predef: [
        ...Object.keys(docs),
        'require',
        'console'
      ]
    }

    return (
      <Block column tall>
        {
          !readOnly && <EditorBar
            canAutoComplete={canAutoComplete}
            stretch={initialData.stretch}
            modifications={modifications}
            lloc={lloc}
            saveRef={saveRef}
            saved={saved}
            bgColor='#1D1F21'
            startOver={startOver}
            inputType='code' />
        }
        <Block flex tall wide align='start start'>
          <Block wide tall align='center center'>
            {
              props.hideApi ||
              <CodeButtons
              readOnly={readOnly}
              docs={docs}
              {...actions}
              w='205px'
              bgColor='offSecondary' />
            }
            <Box display='flex' relative flex tall class='code-editor'>
              <Ace
                name='code-editor'
                mode='javascript'
                height='100%'
                key={'editor-' + saveRef}
                width='100%'
                fontSize='18px'
                readOnly={readOnly}
                jsOptions={jsOptions}
                fontFamily='code'
                highlightActiveLine={false}
                activeLine={hasRun ? activeLine - 1 : -1}
                onChange={actions.onChange}
                value={sequence.length > 0 ? sequence : startCode || ''}
                theme='tomorrow_night' />
            </Box>
          </Block>
        </Block>
      </Block>
    )
  },

  controller: {
    * onChange ({props}, code, ace) {
      yield props.onChange(code, ace.getSession().$undoManager.$undoStack.length)
    }
  }
})

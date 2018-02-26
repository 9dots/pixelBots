/**
 * Imports
 */

import EditorBar from 'components/EditorBar'
import TextApi from 'components/TextApi'
import CodeButtons from 'components/CodeButtons'
import { component, element } from 'vdux'
import { Block, Box } from 'vdux-ui'
import Ace from 'vdux-ace'
import omit from '@f/omit'
import beautify from 'js-beautify'
import { format } from 'url';

require('brace/mode/javascript')
require('brace/theme/tomorrow_night')

/**
 * <Code Editor/>
 */

export default component({
  render({ state, props, actions }) {
    const {
      activeLine,
      lloc,
      startOver,
      readOnly,
      modifications,
      canAutoComplete,
      initialData,
      sequence = '',
      docs,
      startCode,
      hasRun,
      saved,
      saveRef
    } = props
    const jsOptions = {
      undef: true,
      esversion: 6,
      asi: true,
      browserify: true,
      predef: [...Object.keys(docs), 'require', 'console']
    }

    return (
      <Block column tall>
        {!readOnly && (
          <EditorBar
            canAutoComplete={canAutoComplete}
            stretch={initialData.stretch}
            modifications={modifications}
            lloc={lloc}
            saveRef={saveRef}
            saved={saved}
            bgColor='#1D1F21'
            startOver={startOver}
            inputType='code' />
        )}
        <Block flex tall wide align='start start'>
          <Block wide tall align='center center'>
            {props.hideApi || (
              <CodeButtons
                readOnly={readOnly}
                docs={docs}
                {...actions}
                w='205px'
                bgColor='offSecondary' />
            )}
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
                onInit={actions.setEditor}
                highlightActiveLine={false}
                activeLine={hasRun ? activeLine - 1 : -1}
                onChange={actions.onChange}
                onCursorChange={actions.onCursorChange}
                value={sequence || startCode || ''}
                theme='tomorrow_night' />
            </Box>
          </Block>
        </Block>
      </Block>
    )
  },

  reducer: {
    setEditor: (state, editor) => ({ editor })
  },

  controller: {
    * insertCode({ props, state }, key, info) {
      const { sequence, cursorPosition, startCode } = props
      const firstSelectedRow = state.editor.selection.selectionLead.row
      const lastSelectedRow = state.editor.selection.selectionAnchor.row
      if (info.wrapSnippet && (firstSelectedRow !== lastSelectedRow
        || state.editor.selection.selectionLead.column !== state.editor.selection.selectionAnchor.column)) {
        //wrapping code (repeat, ifColor)

        let newsequence
        sequence ? (newsequence = sequence.split('\n')) : startCode
        let firstLine = newsequence[firstSelectedRow]
        newsequence[firstSelectedRow] =
          info.wrapSnippet +
          '\n\t' + firstLine
        for (var i = firstSelectedRow + 1; i <= lastSelectedRow; i++) {
          let currentLine = newsequence[i]
          newsequence[i] = '\t' + currentLine
        }
        let lastLine = newsequence[lastSelectedRow]
        newsequence[lastSelectedRow] = lastLine + '\n\})'
        state.editor.setValue(newsequence.join('\n'), 1)
        yield state.editor.focus()
        yield state.editor.selection.moveTo(lastSelectedRow + 3)
      }
      else {
        if (sequence || startCode) {
          console.log(info)
          let newsequence
          sequence ? (newsequence = sequence.split('\n')) : startCode
          let editLine = newsequence[cursorPosition.row]
          newsequence[cursorPosition.row] =
            (editLine.slice(0, cursorPosition.column) +
            (info.argsSnippet ? (info.args ? info.argsSnippet : info.snippet) : info.snippet) +
            editLine.slice(cursorPosition.column) +
            '\n')
          const editorCode = newsequence.join('\n')
          const formattedCode = beautify.js_beautify(editorCode, { indent_size: 2 }) + '\n'
          state.editor.setValue(formattedCode, 1)

        } else {
          state.editor.setValue((info.argsSnippet ? (info.args ? info.argsSnippet : info.snippet) : info.snippet) + '\n')
        }
        yield state.editor.focus()
        yield state.editor.selection.moveTo(cursorPosition.row + 1)
      }
    },

    * onCursorChange({ props }, e, { lead }) {
      yield props.setCursorPosition(lead.row, lead.column)
    },
    * onChange({ props }, code, ace) {
      yield props.onChange(
        code,
        ace.getSession().$undoManager.$undoStack.length
      )
    }
  }
})

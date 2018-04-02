/**
 * Imports
 */

import CodeButtons from 'components/CodeButtons'
import EditorBar from 'components/EditorBar'
import { component, element } from 'vdux'
import TextApi from 'components/TextApi'
import { Block, Box } from 'vdux-ui'
import beautify from 'js-beautify'
import { format } from 'url'
import Ace from 'vdux-ace'
import omit from '@f/omit'

require('brace/mode/javascript')
require('brace/theme/tomorrow_night')

/**
 * <Code Editor/>
 */

export default component({
  render ({ state, props, actions }) {
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
      palette,
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
                palette={palette}
                readOnly={readOnly}
                docs={docs}
                sequence={sequence}
                startCode={startCode}
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
    * insertCode ({ props, state }, key, info) {
      const { sequence, cursorPosition, startCode, palette } = props
      const firstRow = state.editor.selection.selectionLead.row
      const lastRow = state.editor.selection.selectionAnchor.row
      if (shouldWrap(info, state.editor.selection, firstRow, lastRow)) {
        // wrapping code (repeat, ifColor)
        const newSequence = wrapCode(sequence, info, key, firstRow, lastRow)
        state.editor.setValue(newSequence, 1)
        yield state.editor.focus()
        yield state.editor.selection.moveTo(lastRow + 3)
      } else {
        let usedSnippet = info.snippet
        if (info.argsSnippet) {
          if (info.args.length > 0) {
            if (
              info.type !== 'paint' ||
              (info.type === 'paint' && palette.length > 2)
            ) {
              usedSnippet = info.argsSnippet
            }
          }
        }
        if (sequence || startCode) {
          let newsequence
          sequence ? (newsequence = sequence.split('\n')) : startCode
          let editLine = newsequence[cursorPosition.row]
          newsequence[cursorPosition.row] =
            editLine.slice(0, cursorPosition.column) +
            usedSnippet +
            editLine.slice(cursorPosition.column) +
            '\n'
          const editorCode = newsequence.join('\n')
          const formattedCode =
            key === 'lineBreak'
              ? editorCode
              : beautify.js_beautify(editorCode, { indent_size: 2 }) + '\n'
          state.editor.setValue(formattedCode, 1)
        } else {
          state.editor.setValue(usedSnippet + '\n')
        }
        yield state.editor.focus()
        yield state.editor.selection.moveTo(cursorPosition.row + 1)
      }
    },

    * onCursorChange ({ props }, e, { lead }) {
      yield props.setCursorPosition(lead.row, lead.column)
    },
    * onChange ({ props }, code, ace) {
      yield props.onChange(
        code,
        ace.getSession().$undoManager.$undoStack.length
      )
    }
  }
})

/**
 * wrapCode
 * @param {String} sequence code to be edited
 * @param {Object} info insert object
 * @param {String} key insert type
 * @param {Number} first first row of the selection
 * @param {Number} last last row of the selection
 * @returns {String} new code with wrapped selection
 */
function wrapCode (sequence, info, key, first, last) {
  const [pre, edit, post] = splitCode(sequence.split('\n'), first, last + 1)
  const newCode = [
    info.wrapSnippet,
    ...edit,
    key === 'ifStatement' ? '}' : '})'
  ]
  return [...pre, ...newCode, ...post].join('\n')
}

/**
 * splitCode
 * Split the code into 3 arrays so that the middle section can be wrapped
 * @param {Array} sequence The sequence to split
 * @param {Number} firstRow The first row of the selection
 * @param {Number} lastRow The last row of the selection
 * @returns {Array} Array with [before wrap, to wrap, after wrap]
 */
function splitCode (sequence, firstRow, lastRow) {
  return [
    sequence.slice(0, firstRow),
    sequence.slice(firstRow, lastRow),
    sequence.slice(lastRow)
  ]
}

/**
 * shouldWrap
 * Check to see if we need to wrap a selection
 * @param {Object} info The insert object
 * @param {Object} selection The selection object
 * @param {Number} firstRow The first row of the selection
 * @param {Number} lastRow The last row of the selection
 * @returns {Boolean}
 */
function shouldWrap (info, selection, firstRow, lastRow) {
  return (
    info.wrapSnippet &&
    (firstRow !== lastRow ||
      selection.selectionLead.column !== selection.selectionAnchor.column)
  )
}

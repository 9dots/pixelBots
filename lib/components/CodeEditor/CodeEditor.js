/**
 * Imports
 */

import CodeButtons from 'components/CodeButtons'
import EditorBar from 'components/EditorBar'
import { component, element } from 'vdux'
import { Block, Box } from 'vdux-ui'
import beautify from 'js-beautify'
import Ace from 'vdux-ace'

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
      predef: [...Object.keys(docs), 'require', 'console', 'frame']
    }
    const lastUsedRow = 0

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
            {!props.hideApi && (
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
      const [firstRow, lastRow] = getWrapRows(state.editor.selection)

      if (shouldWrap(info, state.editor.selection, firstRow, lastRow)) {
        // wrapping code (repeat, ifColor)
        const newSequence = wrapCode(sequence, info, key, firstRow, lastRow)
        const formattedCode = beautifyCode(newSequence, key)
        state.editor.setValue(formattedCode, 1)
        yield state.editor.focus()
        yield state.editor.selection.moveCursorToPosition({
          row: lastRow + 3,
          column: cursorPosition.column
        })
      } else {
        let usedSnippet = getSnippet(info, palette)
        if (sequence || startCode) {
          const editorCode = insertSnippet(
            sequence,
            startCode,
            cursorPosition,
            usedSnippet
          )
          // const formattedCode = beautifyCode(editorCode, key)
          state.editor.setValue(editorCode, 1)
        } else {
          state.editor.setValue(usedSnippet + '\n')
        }
        yield state.editor.focus()
        yield state.editor.selection.moveCursorToPosition({
          row: cursorPosition.row + 1,
          column: cursorPosition.column + 2
        })
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
 * getWrapRows
 * @param {Object} selection ace selection object
 * @returns {Array} [min, max]
 */
function getWrapRows (selection) {
  const lead = selection.selectionLead.row
  const anchor = selection.selectionAnchor.row
  return [Math.min(lead, anchor), Math.max(lead, anchor)]
}

/**
 * wrapCode
 * @param {String} sequence code to be edited
 * @param {String} key insert type
 * @returns {String} new formatted code
 */
function beautifyCode (sequence, key) {
  const formattedCode =
    key === 'lineBreak'
      ? sequence
      : beautify.js_beautify(sequence, { indent_size: 2 }) + '\n'
  return formattedCode
}

/**
 *
 * @param {String} sequence code to be edited
 * @param {String} startCode initial code
 * @param {Object} cursorPosition where to insert
 * @param {String} usedSnippet which snippet to insert
 * @returns {String} new code with inserted code
 */
function insertSnippet (sequence, startCode, cursorPosition, usedSnippet) {
  let newsequence = sequence ? sequence.split('\n') : startCode
  let editLine = newsequence[cursorPosition.row]
  newsequence[cursorPosition.row] =
    editLine.slice(0, cursorPosition.column) +
    usedSnippet +
    editLine.slice(cursorPosition.column) +
    '\n'
  return newsequence.join('\n')
}

/**
 *
 * @param {Object} info insert object
 * @param {Array} palette available colors for paint
 * @returns {String} snippet that should be used
 */
function getSnippet (info, palette) {
  if (info.argsSnippet && info.args.length > 0) {
    if (
      info.type !== 'paint' ||
      (info.type === 'paint' && palette.length > 2)
    ) {
      return info.argsSnippet
    }
  }
  return info.snippet
}

/**
 *
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

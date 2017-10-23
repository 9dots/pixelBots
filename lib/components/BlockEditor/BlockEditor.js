/**
 * Imports
 */

import ParameterModal from 'components/ParameterModal'
import { decodeRaw, component, element } from 'vdux'
import FunctionModal from 'components/FunctionModal'
import BlockButtons from 'components/BlockButtons'
import BlockCursor from 'components/BlockCursor'
import CodeBlock from 'components/CodeBlock'
import EditorBar from 'components/EditorBar'
import { Block } from 'vdux-ui'
import range from '@f/range'
import {
  expandSelectedLoops,
  computeIndentation,
  getVariableScopes,
  setBlockPayload,
  surroundBlocks,
  insertBlocks,
  stateHistory,
  removeBlocks,
  selIndices,
  getUserFns,
  genId
} from './utils'

/**
  * Constants
  */

const width = 200
const margin = 18

/**
 * <BlockEditor/>
 */

export default component({
  initialState: ({ props }) => ({
    cursor: 0,
    selected: [],
    clipboard: [],
    editorState: [],
    sequence: (props.sequence || []).map((block, i) => ({
      ...block,
      id: block.id || genId()
    }))
  }),

  onCreate ({ state }) {
    return {
      type: 'INITIALIZE_BLOCK_EDITOR'
    }
  },

  render ({ props, state, actions }) {
    const {
      canAutoComplete,
      modifications,
      gameActions,
      initialData,
      activeLine,
      readOnly,
      stretch,
      running,
      saveRef,
      hasRun,
      saved,
      lloc,
      docs
    } = props
    const {
      cursor,
      sequence,
      selected,
      editorState,
      clipboard,
      scopes = {}
    } = state
    const indentations = computeIndentation(sequence)

    return (
      <Block column tall>
        {!readOnly && (
          <EditorBar
            {...actions}
            stretch={stretch}
            bgColor='#A7B4CB'
            canAutoComplete={canAutoComplete}
            startOver={props.startOver}
            sequence={sequence}
            selected={selected}
            canUndo={editorState.length > 0}
            clipboard={clipboard}
            initialData={initialData}
            saveRef={saveRef}
            modifications={modifications}
            saved={saved}
            lloc={lloc}
            inputType='icons' />
        )}
        <Block flex tall wide align='start start'>
          <Block wide tall align='center center'>
            {props.hideApi || (
              <BlockButtons
                {...props}
                {...actions}
                w='205px'
                bgColor='offSecondary' />
            )}
            <Block
              onClick={decodeRaw(actions.selectEnd)}
              bgColor='#A7B4CB'
              id='block-editor'
              minWidth='480px'
              overflowY='auto'
              flex
              tall>
              {sequence.map((block, i) => (
                <CodeBlock
                  line={i}
                  key={block.id}
                  block={block}
                  scopedVars={scopes[i]}
                  running={running}
                  readOnly={readOnly}
                  docs={
                    block.type === 'userFn'
                      ? docs[block.payload]
                      : docs[block.type]
                  }
                  isAtCursor={cursor === i}
                  indentation={indentations[i]}
                  isNew={
                    cursor === sequence.length && i === sequence.length - 1
                  }
                  active={hasRun && activeLine === i + 1}
                  setArgument={actions.setArgument}
                  removeBlock={actions.removeBlock}
                  clearSelection={actions.clearSelection}
                  openFunctionModal={actions.openFunctionModal}
                  isSelecting={!!selected.length}
                  addCapability={gameActions.addCapability}
                  isSelected={selected.indexOf(block) !== -1}
                  openParameterModal={actions.openParameterModal}
                  setBlockPayload={actions.setBlockPayload}
                  onClick={decodeRaw(actions.maybeSetCursor(i))}
                  removeCapability={gameActions.removeCapability}
                  select={!readOnly && actions.selectBlock(block)}
                  numLineDigits={sequence.length.toString().length} />
              ))}
              <BlockCursor
                id='block-editor-cursor'
                hidden={
                  readOnly || selected.length || cursor !== sequence.length
                }
                w={width}
                h={margin} />
            </Block>
          </Block>
        </Block>
      </Block>
    )
  },

  * onUpdate (prev, next) {
    if (next.state.cursor > next.state.sequence.length) {
      yield next.actions.setCursor(next.state.sequence.length)
    }

    if (prev.state.sequence !== next.state.sequence && next.props.onChange) {
      yield next.props.onChange(
        next.state.sequence,
        next.state.editorState.length
      )
    }

    if (
      prev.props.sequence !== next.props.sequence &&
      next.props.sequence !== next.state.sequence
    ) {
      yield next.actions.setSequence(next.props.sequence || [])
    }

    if (
      prev.props.modifications !== next.props.modifications &&
      next.props.modifications === 0
    ) {
      yield next.actions.clearStateHistory()
    }
  },

  controller: {
    * setArgument ({ state, actions }, block, pos, arg) {
      const payload = (block.payload || []).slice()
      payload[pos] = arg
      yield actions.setBlockPayload(block, payload)
    },
    * removeArgument ({ props, state, actions }, block, arg) {
      const payload = (block.payload || []).slice()

      const idx = payload.findIndex((val, i) => val.id === arg.id)
      payload.splice(idx, 1)

      yield props.editCapability(payload[0], payload.slice(1))
      yield actions.setBlockPayload(block, payload)
    },
    * createNewArgument ({ props, state, actions }, block, arg) {
      let payload = (block.payload || []).slice()

      const exists = payload.some((val, i) => {
        if (val.id === arg.id) {
          return (payload[i] = arg)
        }
      })

      if (!exists) {
        payload = payload.concat(arg)
      }

      yield props.editCapability(payload[0], payload.slice(1))
      yield actions.setBlockPayload(block, payload)
    },
    * selectEnd ({ state, actions }, e) {
      if (e.target === e.currentTarget) {
        yield actions.setCursor(state.sequence.length)
      }
    },
    * maybeSetCursor ({ actions }, i, e) {
      let p = e.target
      let found = false
      while (p && p !== document.body) {
        if (p.classList.contains('block-argument')) {
          found = true
          break
        }
        p = p.parentNode
      }

      if (!found) {
        yield actions.setCursor(i)
      }
    },
    * addBlock ({ props, actions, context }, block) {
      const { openFunctionModal, createBlock } = actions
      const blockWithID = { ...block, id: genId() }

      if (block.type === 'userFn' && !block.payload) {
        yield openFunctionModal(blockWithID, createBlock)
      } else {
        yield actions.createBlock(blockWithID)
      }
    },
    * openFunctionModal ({ context, actions }, block, fn) {
      yield context.openModal(() => (
        <FunctionModal onSubmit={actions.nameFunction} block={block} fn={fn} />
      ))
    },
    * openParameterModal ({ context, actions }, block, arg) {
      yield context.openModal(() => (
        <ParameterModal
          onSubmit={actions.createNewArgument}
          arg={arg}
          block={block}
          remove={actions.removeArgument} />
      ))
    },
    * nameFunction ({ props, actions }, block, val) {
      yield [
        actions.setBlockPayload(block, [val]),
        props.addCapability(
          val,
          { type: 'functions', args: [] },
          (block.payload || [])[0]
        )
      ]
    },
    * removeCapability ({props}, ...args) {
      yield props.removeCapability(...args)
    },
    * addCapability ({ props }, ...args) {
      yield props.addCapability(...args)
    }
  },

  middleware: [stateHistory, getVariableScopes, getUserFns],

  reducer: {
    setBlockPayload,
    createBlock: ({ cursor, sequence, selected }, block) => {
      if (block.block) {
        if (selected.length) {
          sequence = surroundBlocks(sequence, selected, block)
        } else {
          sequence = insertBlocks(
            sequence,
            [block, { type: 'block_end', parentType: block.type, id: genId() }],
            cursor
          )
          cursor++
        }
      } else if (selected.length) {
        const idxs = selIndices(sequence, selected)
        sequence = insertBlocks(
          removeBlocks(sequence, selected),
          block,
          idxs[0]
        )
        cursor = idxs[0] + 1
      } else {
        sequence = insertBlocks(sequence, block, cursor)
        cursor++
      }

      return {
        cursor,
        sequence,
        selected: []
      }
    },
    invertSelection: ({ selected, sequence }) => ({
      selected: selected.length
        ? []
        : (sequence || []).filter(b => b.type !== 'block_end')
    }),
    removeSelected: ({ sequence, selected }) => ({
      selected: [],
      sequence: removeBlocks(sequence, selected)
    }),
    cutSelection: ({ sequence, selected }) => ({
      selected: [],
      sequence: removeBlocks(sequence, selected),
      clipboard: expandSelectedLoops(sequence, selected)
    }),
    copySelection: ({ sequence, selected }) => ({
      clipboard: expandSelectedLoops(sequence, selected)
    }),
    clearSelection: () => ({
      selected: []
    }),
    removeBlock: ({ selected, sequence }, block) => ({
      sequence: removeBlocks(sequence, block),
      selected: selected.filter(b => b !== block)
    }),
    setSequence: (state, sequence) => ({ sequence }),
    setParameterScopes: (state, scopes) => ({ scopes }),
    paste: ({ sequence, selected, cursor, clipboard }) => ({
      selected: [],
      sequence: insertBlocks(
        removeBlocks(sequence, selected),
        clipboard.map(block => ({ ...block, id: genId() })),
        selected.length ? selIndices(sequence, selected)[0] : cursor
      )
    }),
    selectBlock: ({ sequence, selected }, block) => {
      if (selected.length === 0) {
        selected = [block]
      } else if (selected.indexOf(block) !== -1) {
        selected = []
      } else {
        const seqIdx = sequence.indexOf(block)
        const idxs = selIndices(sequence, selected)
        const start = Math.min(idxs[0], seqIdx)
        const end = Math.max(idxs[idxs.length - 1], seqIdx)

        selected = range(start, end + 1).map(i => sequence[i])
      }

      return { selected }
    },
    setCursor: (state, cursor) => ({ cursor }),
    clearStateHistory: () => ({ editorState: [] }),
    saveEditorState: ({ editorState }, prevState) => ({
      editorState: editorState.concat(prevState)
    }),
    undo: ({ editorState }) => editorState[editorState.length - 1]
  }
})

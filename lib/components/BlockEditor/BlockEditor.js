/**
 * Imports
 */

import {stopPropagation, decodeValue, decodeRaw, component, element} from 'vdux'
import {CSSContainer, Input, wrap, Icon} from 'vdux-containers'
import BlockArgument from 'components/BlockArgument'
import BlockButtons from 'components/BlockButtons'
import containsElement from '@f/contains-element'
import BlockCursor from 'components/BlockCursor'
import EditorBar from 'components/EditorBar'
import BlockIcon from 'components/BlockIcon'
import {Checkbox, Block} from 'vdux-ui'
import objEqual from '@f/equal-obj'
import unique from '@f/unique'
import range from '@f/range'
import times from '@f/times'
import sleep from '@f/sleep'

/**
 * <BlockEditor/>
 */

export default component({
  initialState: ({props}) => ({
    cursor: 0,
    selected: [],
    clipboard: [],
    editorState: [],
    sequence: props.sequence || []
  }),

  render ({props, state, actions}) {
    const {docs, readOnly, running, canAutoComplete, activeLine, initialData, saveRef, saved, hasRun} = props
    const {cursor, sequence, selected, editorState, clipboard} = state
    const indentations = computeIndentation(sequence)

    return (
      <Block column tall>
        {
          !readOnly && <EditorBar
            {...actions}
            bgColor='#A7B4CB'
            canAutoComplete={canAutoComplete}
            startOver={actions.startOver}
            sequence={sequence}
            selected={selected}
            canUndo={editorState.length > 0}
            clipboard={clipboard}
            initialData={initialData}
            saveRef={saveRef}
            saved={saved}
            loc={sequence.length}
            inputType='icons' />
        }
        <Block flex tall wide align='start start'>
          <Block wide tall align='center center'>
            <BlockButtons {...props} {...actions} w='205px' bgColor='offSecondary' />
            <Block
              onClick={decodeRaw(actions.selectEnd)}
              bgColor='#A7B4CB'
              id='block-editor'
              minWidth='480px'
              overflowY='auto'
              flex
              tall>
              {
                sequence.map((block, i) => <CodeBlock
                  line={i}
                  key={block.id}
                  block={block}
                  running={running}
                  readOnly={readOnly}
                  selected={selected}
                  docs={docs[block.type]}
                  isAtCursor={cursor === i}
                  indentation={indentations[i]}
                  active={hasRun && activeLine === i + 1}
                  key={'block-editor-block-' + i}
                  setArgument={actions.setArgument}
                  removeBlock={actions.removeBlock}
                  clearSelection={actions.clearSelection}
                  setBlockPayload={actions.setBlockPayload}
                  onClick={decodeRaw(actions.maybeSetCursor(i))}
                  select={!readOnly && actions.selectBlock(block)}
                  numLineDigits={sequence.length.toString().length} />
                )
              }
              <BlockCursor id='block-editor-cursor' hidden={selected.length || cursor !== sequence.length} w={width} h={margin} />
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
      yield next.props.onChange(next.state.sequence)
    }
  },

  controller: {
    * setArgument ({state, actions}, block, pos, arg) {
      const payload = (block.payload || []).slice()
      payload[pos] = arg
      yield actions.setBlockPayload(block, payload)
    },
    * selectEnd ({state, actions}, e) {
      if (e.target === e.currentTarget) {
        yield actions.setCursor(state.sequence.length)
      }
    },
    * maybeSetCursor ({actions}, i, e) {
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
    * startOver ({state, actions}) {
      yield actions.setSequence([])
    }
  },

  middleware: [
    stateHistory
  ],

  reducer: {
    setBlockPayload: (state, block, payload) => setBlockPayload(state, block, payload),
    addBlock: ({cursor, sequence, selected}, block) => {
      if (block.block) {
        if (selected.length) {
          sequence = surroundBlocks(sequence, selected, block)
        } else {
          sequence = insertBlocks(sequence, [block, {type: 'block_end'}], cursor)
          cursor++
        }
      } else if (selected.length) {
        const idxs = selIndices(sequence, selected)
        sequence = insertBlocks(removeBlocks(sequence, selected), block, idxs[0])
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
    invertSelection: ({selected, sequence}) => ({
      selected: selected.length
        ? []
        : (sequence || []).filter(b => b.type !== 'block_end')
    }),
    removeSelected: ({sequence, selected}) => ({
      selected: [],
      sequence: removeBlocks(sequence, selected)
    }),
    cutSelection: ({sequence, selected}) => ({
      selected: [],
      sequence: removeBlocks(sequence, selected),
      clipboard: expandSelectedLoops(sequence, selected)
    }),
    copySelection: ({sequence, selected}) => ({
      clipboard: expandSelectedLoops(sequence, selected)
    }),
    clearSelection: () => ({
      selected: []
    }),
    removeBlock: ({selected, sequence}, block) => ({
      sequence: removeBlocks(sequence, block),
      selected: selected.filter(b => b !== block)
    }),
    setSequence: (state, sequence) => ({sequence}),
    paste: ({sequence, selected, cursor, clipboard}) => ({
      selected: [],
      sequence: insertBlocks(
        removeBlocks(sequence, selected),
        clipboard,
        selected.length
          ? selIndices(sequence, selected)[0]
          : cursor
      )
    }),
    selectBlock: ({sequence, selected}, block) => {
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

      return {selected}
    },
    setCursor: (state, cursor) => ({cursor}),
    saveEditorState: ({editorState}, prevState) => ({editorState: editorState.concat(prevState)}),
    undo: ({editorState}) => editorState[editorState.length - 1]
  }
})

function setBlockPayload ({active, selected, sequence}, block, payload) {
  const newBlock = {...block, payload}

  return {
    sequence: sequence.map(b => b === block ? newBlock : b),
    selected: selected.map(b => b === block ? newBlock : b)
  }
}

function insertBlocks (sequence = [], blocks, idx) {
  sequence = sequence.slice()
  sequence.splice(idx, 0, ...([].concat(blocks).filter(Boolean).map(b => ({...b}))))
  return sequence
}

function surroundBlocks (sequence, selected, block) {
  selected = expandSelectedLoops(sequence, selected)

  const idxs = selIndices(sequence, selected)
  let start = idxs[0]
  let inserted = 0
  sequence = sequence.slice()

  for (let i = 1; i < idxs.length; i++) {
    if (idxs[i] > idxs[i-1] + 1) {
      sequence.splice((start + inserted++), 0, {...block})
      sequence.splice(idxs[i-1] + 1 + (inserted++), 0, {type: 'block_end'})
      start = idxs[i]
    }
  }

  sequence.splice((start + inserted++), 0, {...block})
  sequence.splice(idxs[idxs.length - 1] + 1 + (inserted++), 0, {type: 'block_end'})

  return sequence
}

function selIndices (sequence, selected) {
  return selected.map(b => sequence.indexOf(b)).sort(cmp)
}

function cmp (a, b) {
  return a === b ? 0 : a < b ? -1 : 1
}

function stateHistory ({actions, dispatch, getState}) {
  return next => action => {
    const prevState = getState()
    const result = next(action)
    const nextState = getState()

    if (action.type !== 'undo' && prevState.sequence !== nextState.sequence) {
      dispatch(actions.saveEditorState(prevState))
    }

    return result
  }
}

/**
 * expandSelectedLoops
 *
 * Expand the selection to include the entirety of any loops
 * that have been selected
 */

function expandSelectedLoops (sequence, selected) {
  return unique(selected.reduce((acc, block) => {
    if (block.block) {
      const idx = sequence.indexOf(block)
      const loop = [block]
      let level = 0

      for (let i = idx + 1; i < sequence.length; i++) {
        const item = sequence[i]
        loop.push(item)

        if (item.block) {
          level++
        } else if (item.type === 'block_end') {
          if (level === 0) {
            break
          } else {
            level--
          }
        }
      }

      return acc.concat(unique(loop))
    }

    return acc.concat(block)
  }, []))
}

function removeBlocks (sequence, block) {
  if (Array.isArray(block)) {
    return block.reduce(removeBlocks, sequence)
  }

  if (block.block) {
    const idx = sequence.indexOf(block)
    let endBlock
    let level = 0

    for (let i = idx + 1; i < sequence.length; i++) {
      const item = sequence[i]
      if (item.block) level++
      if (item.type === 'block_end') {
        if (level === 0) {
          endBlock = item
          break
        }

        level--
      }
    }

    if (endBlock) {
      sequence = removeBlocks(sequence, endBlock)
    }
  }

  return sequence.filter(b => b !== block)
}

function computeIndentation (sequence) {
  let indentations = []
  let level = 0

  return sequence.reduce((acc, block) => {
    if (block.type === 'block_end') {
      level--
    }

    acc.push(level)

    if (block.block) {
      level++
    }

    return acc
  }, [])
}

/**
 * Constants
 */

const tabSize = 30
const width = 200
const height = 40
const margin = 18

/**
 * <CodeBlock/>
 */

const CodeBlock = wrap(CSSContainer, {
  hoverProps: {
    hovering: true
  }
})(component({
  * onCreate ({props}) {
    let element = document.querySelector('.code-block.new')
    if (element) element = element.nextSibling

    if (element) {
      yield element.scrollIntoViewIfNeeded(false)
    } else {
      yield sleep(50)
      document.getElementById('block-editor').scrollTop = document.getElementById('block-editor').scrollHeight
    }
  },

  render ({props, actions}) {
    const {block, indentation, line, selected, readOnly, hovering, active, docs, numLineDigits, setArgument, select, isAtCursor, clearSelection, removeBlock, ...rest} = props
    const {type} = block
    const isSelected = selected.indexOf(block) !== -1
    const isComment = type === 'comment'
    const isBlockEnd = type === 'block_end'
    const isBlock = block.block || isBlockEnd
    const bgColor = isBlock ? '#8c1010' : 'buttons'

    const blockProps = {
      boxShadow: active
        ? '0 0 7px 2px  rgba(white,.7), 0 0px 3px rgba(0,0,0,.7)'
        : '0 0',
      bgColor: bgColor,
      h: height
    }

    return (
      <Block id={`code-block-${line}`} class={['code-block', {'active': active, 'new': isAtCursor}]} {...rest}>
        <BlockCursor ml={(indentation + isBlockEnd) * tabSize} hidden={selected.length || !isAtCursor} w={width} h={margin} />
         <Block wide align='start center' relative boxShadow={isSelected ? '0 0 0 9px rgba(white, .2), inset 0 0 0 99px rgba(white, .2)' : ''} {...rest}>
          <LineNumber line={line} selected={selected} select={select} hovering={!readOnly && hovering} unselectable={docs.unselectable} numLineDigits={numLineDigits} isSelected={isSelected} />
          {
            times(indentation > 0 ? indentation : 0, (i) => (
              <Block
                borderRight='3px dotted #a01313'
                left={((i + 1) * tabSize) + 5}
                h={height + margin + 2}
                top={margin / -2}
                absolute/>
            ))
          }
          {
            isComment
              ? <CommentBlock ml={indentation * tabSize} {...props} />
              : <Block
                  fs='14px'
                  highlight={active ?  0.35 : 0}
                  align='center center'
                  ml={5 + (indentation * tabSize)}
                  w={isBlockEnd ? width / 1.3 : width}
                  { ...blockProps}>
                  <BlockIcon type={block.type} />
                </Block>
          }
          {
            (docs.args || []).map((arg, i) => <BlockArgument
              readOnly={readOnly}
              arg={arg}
              setArgument={!readOnly && setArgument(block, i)}
              {...blockProps}
              value={(block.payload || [])[i]} />)
          }
          {
            hovering && !readOnly && !docs.unselectable &&
              <Icon pointer opacity={.6} name='delete' hoverProps={{opacity: 1}} ml='s' fs='m' onClick={removeBlock(block)} />
          }
        </Block>
      </Block>
    )
  },

  * onUpdate (prev, next) {
    if (!objEqual(prev.props, next.props) && next.props.active && next.props.running) {
      let element = document.getElementById(`code-block-${next.props.line}`)
      if (!element.previousSibling) {
        return yield element.scrollIntoViewIfNeeded(false)
      }
      if (element && element.nextSibling) element = element.nextSibling
      yield element.scrollIntoViewIfNeeded(false)
    }
  }
}))

/**
 * Constants
 */

const inputProps = {bgColor: 'transparent', h: '100%', borderWidth: '0px', color: 'white'}

/**
 * <CommentBlock/>
 */

const CommentBlock = component({
  render ({props}) {
    const {setBlockPayload, block, ml} = props

    return (
      <Block ml={7 + ml} relative align='left center'>
        <Block h='36px' relative {...props} fs='14px' align='left center' bgColor='#666' fs='28px' w={width} fontFamily='monospace'>
          <Block ml='s' mr='3' fs='s' bold color='white'>//</Block>
          <Input
            m='0'
            h='90%'
            fs='s'
            inputProps={inputProps}
            onClick={stopPropagation}
            onKeyUp={decodeValue(setBlockPayload(block))}
            value={block.payload} />
        </Block>
      </Block>
    )
  }
})

/**
 * <LineNumber/>
 */

const LineNumber = component({
  render ({props}) {
    const {selected, select, isSelected, hovering, line, unselectable, numLineDigits} = props
    const offset = numLineDigits * 6
    const checkProps = {line: line, circle: 25, ml: 5, align: 'center center', fs: 14, textIndent: -1, lh: '24px'}

    return (
      <Block align='center center' color='#666' w='30px' left={`${offset}px`} {...props}>
        {
          !unselectable && (selected.length || hovering)
            ? <Checkbox
                checkProps={{...checkProps}}
                onClick={stopPropagation}
                btn={Check}
                checked={isSelected}
                onChange={select} />
            : <Block {...checkProps} >
                {line + 1}
              </Block>
        }
      </Block>
    )
  }
})

function Check ({props}) {
  const {checkProps, checked} = props
  const {line, ...rest} = checkProps

  return (
    <Block
      bgColor={checked ? 'green' : 'white'}
      color={checked ? 'white' : '#666'}
      border='1px solid rgba(black, .2)'
      align='center center'
      pointer
      {...rest} >
      { line + 1 }
    </Block>
  )
}

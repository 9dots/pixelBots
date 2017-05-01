/**
 * Imports
 */

import {stopPropagation, decodeValue, decodeRaw, component, element} from 'vdux'
import {CSSContainer, Input, wrap, Icon} from 'vdux-containers'
import BlockArgument from 'components/BlockArgument'
import containsElement from '@f/contains-element'
import BlockCursor from 'components/BlockCursor'
import {Checkbox, Block} from 'vdux-ui'
import nameToColor from 'utils/nameToColor'
import nameToIcon from 'utils/nameToIcon'
import LoopIcon from 'utils/icons/loop'
import objEqual from '@f/equal-obj'
import times from '@f/times'
import sleep from '@f/sleep'

/**
 * <BlockEditor/>
 */

export default component({
  render ({props, actions}) {
    const {docs, readOnly, running, sequence, cursor, activeLine, setCursor, selectBlock, selected = [], setArgument, setBlockPayload, clearSelection, removeBlock} = props
    const indentations = computeIndentation(sequence)

    return (
      <Block 
        onClick={decodeRaw(actions.selectEnd)} 
        bgColor={props.bgColor} 
        id='block-editor' 
        minWidth='480px'
        overflowY='auto' 
        flex 
        tall>
        {
          sequence.map((block, i) => <CodeBlock
            key={block.id}
            block={block}
            readOnly={readOnly}
            select={!readOnly && selectBlock(block)}
            indentation={indentations[i]}
            docs={docs[block.type]}
            isAtCursor={cursor === i}
            selected={selected}
            active={activeLine === i + 1}
            key={'block-editor-block-' + i}
            onClick={decodeRaw(actions.maybeSetCursor(i))}
            running={running}
            line={i}
            clearSelection={clearSelection}
            removeBlock={removeBlock}
            numLineDigits={sequence.length.toString().length}
            setArgument={setArgument}
            setBlockPayload={setBlockPayload} />)
        }
        <BlockCursor id='block-editor-cursor' hidden={selected.length || cursor !== sequence.length} w={width} h={margin} />
      </Block>
    )
  },
  controller: {
    * selectEnd ({props}, e) {
      const {setCursor, sequence} = props

      if (e.target === e.currentTarget) {
        yield setCursor(sequence.length)
      }
    },
    * maybeSetCursor ({props}, i, e) {
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
        yield props.setCursor(i)
      }
    }
  }
})

function computeIndentation (sequence) {
  let indentations = []
  let level = 0

  return sequence.reduce((acc, block) => {
    if (block.type === 'repeat_end') {
      level--
    }

    acc.push(level)

    if (block.type === 'repeat') {
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
    const isLoopEnd = type === 'repeat_end'
    const isLoop = type === 'repeat' || isLoopEnd
    const bgColor = isLoop ? '#8c1010' : 'buttons'

    const blockProps = {
      boxShadow: active
        ? '0 0 7px 2px  rgba(white,.7), 0 0px 3px rgba(0,0,0,.7)'
        : '0 0',
      bgColor: bgColor,
      h: height
    }

    return (
      <Block id={`code-block-${line}`} class={['code-block', {'active': active, 'new': isAtCursor}]} {...rest}>
        <BlockCursor ml={(indentation + isLoopEnd) * tabSize} hidden={selected.length || !isAtCursor} w={width} h={margin} />
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
                  w={isLoopEnd ? width / 1.3 : width}
                  { ...blockProps}>
                  {
                    isLoop
                      ? <LoopIcon hide={isLoopEnd}  />
                      : <Icon bold fs='30px' name={nameToIcon(block.type)} color={nameToColor(block.type)} />
                  }
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
              <Icon pointer opacity={.6} name='delete' hoverProps={{opacity: 1}} ml='s' fs='m' onClick={[removeBlock(0, block), clearSelection]} />
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
    const checkProps = {line: line, circle: 25, ml: 5, align: 'center center', fs: 14}

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

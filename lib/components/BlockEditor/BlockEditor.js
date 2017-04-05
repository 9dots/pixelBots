/**
 * Imports
 */

import {stopPropagation, decodeValue, decodeRaw, component, element} from 'vdux'
import {CSSContainer, Input, wrap} from 'vdux-containers'
import BlockArgument from 'components/BlockArgument'
import BlockCursor from 'components/BlockCursor'
import {Checkbox, Block, Icon} from 'vdux-ui'
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
    const {docs, running, sequence, cursor, activeLine, setCursor, selectBlock, selected, setArgument, setBlockPayload} = props
    const indentations = computeIndentation(sequence)

    return (
      <Block id='block-editor' onClick={decodeRaw(actions.selectEnd)} overflowY='auto' flex tall bgColor='#A7B4CB' minWidth='480px'>
        {
          sequence.map((block, i) => <CodeBlock
                block={block}
                select={selectBlock(block)}
                indentation={indentations[i]}
                docs={docs[block.type]}
                isAtCursor={cursor === i}
                selected={selected}
                active={activeLine === i + 1}
                onClick={setCursor(i)}
                running={running}
                line={i}
                key={'code-editor-block' + i}
                numLines={sequence.length}
                cursor={cursor}
                setArgument={setArgument}
                setBlockPayload={setBlockPayload} />)
        }
        <BlockCursor id='block-editor-cursor' hidden={cursor !== sequence.length} w={width} h={margin} />
      </Block>
    )
  },
  controller: {
    * selectEnd ({props}, e) {
      const {setCursor, sequence} = props

      if (e.target === e.currentTarget) {
        yield setCursor(sequence.length)
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
    const element = document.getElementById(`code-block-${props.cursor}`)
    if (element) {
      yield element.scrollIntoViewIfNeeded(false)
    } else {
      yield sleep(50)
      document.getElementById('block-editor').scrollTop = document.getElementById('block-editor').scrollHeight
    }
  },

  render ({props}) {

    const {block, indentation, line, selected, hovering, active, docs, numLines, setArgument, select, isAtCursor, ...rest} = props
    const {type} = block
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
      <Block id={`code-block-${line}`} {...rest}>
        <BlockCursor ml={(indentation + isLoopEnd) * tabSize} hidden={!isAtCursor} w={width} h={margin} />
        <Block wide align='start' relative {...rest}>
          <LineNumber line={line} selected={selected} select={select} hovering={hovering} unselectable={docs.unselectable} numLines={numLines} block={block} />
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
              (docs.args || []).map((arg, i) => <BlockArgument arg={arg} setArgument={setArgument(block, i)} {...blockProps} value={(block.payload || [])[i]} />)
            }
        </Block>
      </Block>
    )
  },

  * onUpdate (prev, next) {
    if (!objEqual(prev.props, next.props) && next.props.active && next.props.running) {
      const element = document.getElementById(`code-block-${next.props.line + 1}`) || document.getElementById(`block-editor-cursor`)
      if (element) {
        yield element.scrollIntoViewIfNeeded(false)
      }
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
    const {selected, select, block, hovering, line, unselectable, numLines} = props
    const digits = numLines.toString().length
    const offset = digits * 6

    return (
      <Block align='center center' fs='22px' color='#666' w='30px' left={`${offset}px`} {...props}>
        {
          !unselectable && (selected.length || hovering)
            ? <Checkbox checkProps={{borderColor: 'rgba(black, .2)', borderRadius: 5, sq: 22, ml: 12, fs: 's'}} onClick={stopPropagation} checked={selected.indexOf(block) !== -1} onChange={select} />
            : <Block mt={2} ml={2}>{line + 1}</Block>
        }
      </Block>
    )
  }
})

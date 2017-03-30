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

/**
 * <BlockEditor/>
 */

export default component({
  render ({props, actions}) {
    const {docs, sequence, cursor, activeLine, setCursor, selectBlock, selected, setArgument, setBlockPayload} = props
    const indentations = computeIndentation(sequence)

    return (
      <Block onClick={decodeRaw(actions.selectEnd)} overflowY='auto' flex tall bgColor='#A7B4CB' minWidth='480px'>
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
                line={i}
                numLines={sequence.length}
                setArgument={setArgument}
                setBlockPayload={setBlockPayload} />)
        }
        <BlockCursor hidden={cursor !== sequence.length} w='250px' h='18px' />
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

const tabSize = 16

/**
 * <CodeBlock/>
 */

const CodeBlock = wrap(CSSContainer, {
  hoverProps: {
    hovering: true
  }
})(component({
  render ({props}) {
    const {block, indentation, line, selected, hovering, active, docs, numLines, setArgument, select, isAtCursor, ...rest} = props

    return (
      <Block {...rest}>
        <BlockCursor ml={indentation * tabSize} hidden={!isAtCursor} w='250px' h='18px' />
        <Block wide align='start' relative {...rest}>
          <LineNumber line={line} selected={selected} select={select} hovering={hovering} unselectable={docs.unselectable} numLines={numLines} block={block} />
            {
              block.type === 'comment'
                ? <CommentBlock ml={indentation * tabSize} {...props} />
                : <Block
                    h='36px'
                    w='250px'
                    fs='14px'
                    bgColor={active ? '#B43C3C' : 'buttons'}
                    align='center center'
                    ml={5 + (indentation * tabSize)}
                    boxShadow='0 2px 5px 0px rgba(0,0,0,0.8)'>
                    <Icon bold fs='30px' name={nameToIcon(block.type)} color={nameToColor(block.type)} />
                  </Block>
            }
            {
              (docs.args || []).map((arg, i) => <BlockArgument arg={arg} setArgument={setArgument(i)} value={(block.payload || [])[i]} />)
            }
        </Block>
      </Block>
    )
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
      <Block m='5px' ml={5 + ml} relative wide align='left center'>
        <Block h='36px' relative {...props} fs='14px' boxShadow='0 2px 5px 0px rgba(0,0,0,0.8)' align='left center' bgColor='#666' fs='28px' w='250px'>
          <Block mx='3px' color='white'>//</Block>
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
      <Block align='center center' fs='22px' mt='5px' color='#666' w='30px' left={`${offset}px`} {...props}>
        {
          !unselectable && (selected.length || hovering)
            ? <Checkbox onClick={stopPropagation} checked={selected.indexOf(block) !== -1} onChange={select} />
            : line + 1
        }
      </Block>
    )
  }
})

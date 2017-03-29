/**
 * Imports
 */

import {stopPropagation, decodeValue, decodeRaw, component, element} from 'vdux'
import BlockArgument from 'components/BlockArgument'
import BlockCursor from 'components/BlockCursor'
import nameToColor from 'utils/nameToColor'
import nameToIcon from 'utils/nameToIcon'
import {Input} from 'vdux-containers'
import {Block, Icon} from 'vdux-ui'

/**
 * <BlockEditor/>
 */

export default component({
  render ({props, actions}) {
    const {docs, sequence, selectedLine, setSelectedLine, removeBlock, setArgument, setBlockPayload} = props
    const indentations = computeIndentation(sequence)

    return (
      <Block onClick={decodeRaw(actions.selectEnd)} overflowY='auto' flex tall bgColor='#A7B4CB' minWidth='480px'>
        {
          sequence.map((block, i) => <CodeBlock
                block={block}
                indentation={indentations[i]}
                docs={docs[block.type]}
                selected={selectedLine === i}
                onClick={setSelectedLine(i)}
                remove={removeBlock(block)}
                line={i}
                numLines={sequence.length}
                setArgument={setArgument}
                setBlockPayload={setBlockPayload} />)
        }
        <BlockCursor hidden={selectedLine !== sequence.length} w={width} h='18px' />
      </Block>
    )
  },
  controller: {
    * selectEnd ({props}, e) {
      const {setSelectedLine, sequence} = props

      if (e.target === e.currentTarget) {
        yield setSelectedLine(sequence.length)
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

/**
 * <CodeBlock/>
 */

const CodeBlock = component({
  render ({props}) {
    const {block, indentation, line, selected, remove, docs, numLines, setArgument, ...rest} = props
    
    return (
      <Block {...rest}>
        <BlockCursor ml={indentation * tabSize} hidden={!selected} w={width} h='18px' />
        <Block wide align='start' relative {...rest}>
          <LineNumber line={line} selected={selected} remove={remove} numLines={numLines} unremovable={docs.unremovable} />
            {
              block.type === 'comment'
                ? <CommentBlock ml={indentation * tabSize} {...props} />
                : <Block
                    fs='14px'
                    bgColor='buttons'
                    align='center center'
                    ml={5 + (indentation * tabSize)}
                    h={height}
                    w={width}>
                    <Icon bold fs='30px' name={nameToIcon(block.type)} color={nameToColor(block.type)} />
                  </Block>
            }
            {
              (docs.args || []).map((arg, i) => <BlockArgument arg={arg} setArgument={setArgument(i)} value={(block.payload || [])[i]} h={height} />)
            }
        </Block>
      </Block>
    )
  }
})

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
    const {remove, selected, unremovable, line, numLines} = props
    const digits = numLines.toString().length
    const offset = digits * 6

    return (
      <Block align='center center' fs='22px' mt='5px' color='#666' w='30px' left={`${offset}px`} {...props}>
        {
          selected && !unremovable
            ? <Icon pointer color='#666' name='delete' onClick={[stopPropagation, remove]} />
            : line + 1
        }
      </Block>
    )
  }
})

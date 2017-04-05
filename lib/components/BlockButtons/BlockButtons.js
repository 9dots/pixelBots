/** @jsx element */

import {Button, Icon, Text} from 'vdux-containers'
import nameToColor from 'utils/nameToColor'
import nameToIcon from 'utils/nameToIcon'
import {component, element} from 'vdux'
import LoopIcon from 'utils/icons/loop'
import mapValues from '@f/map-values'
import {Block} from 'vdux-ui'

/**
 * <BlockButtons/>
 */

export default component({
  render ({props}) {
    const {canCode, addBlock, docs, readOnly, ...rest} = props

    return (
      <Block column align='start center' wide tall py {...rest}>
        {
          mapValues((spec, key) => <BlockButton
            disabled={!canCode}
            addBlock={!readOnly && addBlock(createBlock(key, docs))}
            name={key}
            spec={spec} />, docs)
        }
      </Block>
    )
  }
})

function createBlock (type, docs) {
  switch (type) {
    case 'up':
    case 'down':
    case 'left':
    case 'right':
      return {type, payload: [1]}
    case 'repeat':
      return {type: 'repeat', payload: [1]}
    default:
      const payload = docs[type].args && docs[type].args.map(arg => arg.default)
      const block = {type}
      if (payload) block.payload = payload
      return block
  }
}

/**
 * Constants
 */

const hoverProps = {highlight: true, boxShadow: '0 2px 5px 0px rgba(0,0,0,0.6)'}

/**
 * <BlockButton/>
 */

const BlockButton = component({
  render ({props}) {
    const {disabled, addBlock, name, spec} = props

    return (
      <Button
        hoverProps={hoverProps}
        w='140px'
        h='40px'
        m='5px'
        fs='14px'
        bgColor='buttons'
        align='center center'
        boxShadow='0 2px 5px 0px rgba(0,0,0,0.8)'
        transition='all .3s ease-in-out'
        hide={spec.hidden}
        onClick={!disabled && addBlock}>
        {
          name === 'repeat'
            ? <LoopIcon mt={-3} />
            : <Icon bold fs='30px' name={nameToIcon(name)} color={nameToColor(name)} />
        }
      </Button>
    )
  }
})

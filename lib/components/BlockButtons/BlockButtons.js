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
    const {canCode, addBlock, docs, ...rest} = props

    return (
      <Block column align='start center' wide tall py {...rest}>
        {
          mapValues((spec, key) => <BlockButton
            disabled={!canCode}
            addBlock={addBlock(createBlock(key, docs))}
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
 * <BlockButton/>
 */

const BlockButton = component({
  render ({props}) {
    const {disabled, addBlock, name, spec} = props

    return (
      <Button
        w='140px'
        h='40px'
        m='5px'
        fs='14px'
        activeProps={{boxShadow: '0 1px 1px rgba(0,0,0,.4)'}}
        bgColor='buttons'
        align='center center'
        boxShadow='0 1px 3px rgba(0,0,0,0.5)'
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

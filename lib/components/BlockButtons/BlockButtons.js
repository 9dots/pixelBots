/** @jsx element */

import {Button, Icon, Text} from 'vdux-containers'
import BlockIcon from 'components/BlockIcon'
import {capabilityOrder, typeColors} from 'animalApis'
import {component, element} from 'vdux'
import LoopIcon from 'utils/icons/loop'
import {Block} from 'vdux-ui'
import omit from '@f/omit'

/**
 * <BlockButtons/>
 */

export default component({
  render ({props}) {
    const {canCode, addBlock, docs, readOnly, type, ...rest} = props
    let keys = Object.keys(docs).sort(cmp)
    keys.splice(keys.indexOf('block_end'), 1)

    return (
      <Block column align='start center' wide tall py overflowY='auto' {...omit('title', rest)}>
        {
          keys.map((key, i) => <BlockButton
            prev={docs[keys[i - 1]]}
            disabled={!canCode || readOnly}
            addBlock={!readOnly && addBlock(createBlock(key, docs))}
            name={key}
            spec={docs[key]} />, docs)
        }
      </Block>
    )
  }
})

function cmp (a, b) {
  const idxA = capabilityOrder.indexOf(a)
  const idxB = capabilityOrder.indexOf(b)

  return idxA < idxB
    ? -1
    : idxA === idxB ? 0 : 1
}

function createBlock (type, docs) {
  switch (type) {
    case 'up':
    case 'down':
    case 'left':
    case 'right':
    case 'repeat':
      return {...docs[type], type, payload: [1]}
    default:
      const payload = docs[type].args && docs[type].args.map(arg => arg.default)
      const block = {...docs[type], type}
      if (payload) block.payload = payload
      return block
  }
}

/**
 * <BlockButton/>
 */

const BlockButton = component({
  render ({props}) {
    const {disabled, addBlock, name, spec, prev} = props
    const arrowColors = {"up":"#B01313","right":"#CA6206","down":"#0B6399","left":"yellow"}
    return (
      <Block>
        <Block p='s' hide={prev && prev.type === spec.type} textTransform='capitalize'>
          {spec.type}
        </Block>
        <Button
          w='140px'
          h='40px'
          m='5px'
          fs='14px'
          color={name === "paint" || name === "comment" ? "white" : arrowColors[name]}
          py={0}
          activeProps={{boxShadow: '0 1px 1px rgba(0,0,0,.4)'}}
          bgColor={typeColors[spec.type]}
          align='center center'
          boxShadow='0 1px 3px rgba(0,0,0,0.5)'
          disabled={disabled}
          hide={spec.hidden}
          onClick={!disabled && addBlock}>
          <BlockIcon type={name} />
        </Button>
      </Block>
    )
  }
})

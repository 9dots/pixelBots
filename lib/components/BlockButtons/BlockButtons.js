/** @jsx element */

import FunctionModal from 'components/FunctionModal'
import {Button, Icon, Text} from 'vdux-containers'
import BlockIcon from 'components/BlockIcon'
import {capabilityOrder, typeColors, arrowColors, typeOrder} from 'animalApis'
import {component, element} from 'vdux'
import LoopIcon from 'utils/icons/loop'
import reduceObj from '@f/reduce-obj'
import {Block} from 'vdux-ui'
import omit from '@f/omit'

/**
 * <BlockButtons/>
 */

export default component({
  render ({props}) {
    const {
      setBlockPayload, 
      addCapability,
      readOnly, 
      addBlock, 
      canCode, 
      block,
      docs, 
      type, 
      ...rest
    } = props

    const map = reduceObj(function(memo, val, key) {
      if(val.type && !val.hidden) {
        if(!memo[val.type])
          memo[val.type] = []

        memo[val.type].push(key)
      }

      return memo
    }, {}, docs)


    return (
      <Block tall overflowY='auto' pb pt='s' {...omit('title', rest)}>
        {
          typeOrder.map(function(type) {
            if(map[type])
              return (
                <Block column align='start center' wide>
                  <Block textAlign='left' w={140} py='s' textTransform='capitalize'>
                    {type}
                  </Block>
                  {
                    map[type].sort(cmp).map((key) => <BlockButton 
                      disabled={!canCode || readOnly}
                      addBlock={!readOnly && addBlock(createBlock(key, docs))}
                      block={block}
                      addCapability={addCapability}
                      setBlockPayload={setBlockPayload}
                      name={key}
                      spec={docs[key]} />)
                  }
                </Block>
              )
          })
        }
      </Block>
    )
  }
})

function cmp (a, b) {
  if(a === 'createFunction') {
    return 1
  } else if(b === 'createFunction') {
    return 0
  }

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
    case 'createFunction':
      return {type: 'userFn', args: [], block: true}
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
  render ({props, context, actions}) {
    const {disabled, addBlock, name, spec} = props

    // const onClick = name === 'createFunction' 
    //   ? context.openModal(() => 
    //       <FunctionModal onSubmit={addBlock} />)
    //   : addBlock    

    return (
      <Button
        w='140px'
        h='40px'
        m='5px'
        fs='14px'
        color={name !== "up" && name !== "down" && 
             name !== "left" && name !== "right" ? "white" : arrowColors[name]}
        py={0}
        activeProps={{boxShadow: '0 1px 1px rgba(0,0,0,.4)'}}
        bgColor={typeColors[spec.type]}
        align='center center'
        boxShadow='0 1px 3px rgba(0,0,0,0.5)'
        disabled={disabled}
        hide={spec.hidden}
        onClick={!disabled && addBlock}>
        <BlockIcon name={name} />
      </Button>
    )
  },
  controller: {
    // * nameFunction ({props}, val) {
    //   const {setBlockPayload, addCapability, addBlock} = props
    //   console.log(addCapability)
    //   const block =  addBlock()

    //   yield [
    //     addBlock()
    //     setBlockPayload(block, val),
    //     addCapability(val, {type: 'functions', args: []}, 'taco')
    //   ]
    // }
  }

})

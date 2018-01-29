/** @jsx element */

import { capabilityOrder, typeColors, arrowColors, typeOrder } from 'animalApis'
import BlockIcon from 'components/BlockIcon'
import { component, element } from 'vdux'
import { Button } from 'vdux-containers'
import reduceObj from '@f/reduce-obj'
import setProp from '@f/set-prop'
import template from 'lodash/template'
import { Block, Text } from 'vdux-ui'
import omit from '@f/omit'
import map from '@f/map'

/**
 * <BlockButtons/>
 */

export default component({
  render ({ props }) {
    const { readOnly, addBlock, docs, ...rest } = props

    const fnMap = map(
      (arr, key) =>
        key === 'functions' ? arr.concat('createFunction') : arr.sort(cmp),
      { [docs.createFunction && 'functions']: [], ...mapDocs(docs) }
    )

    return (
      <Block tall overflowY='auto' pb pt='s' {...omit('title', rest)}>
        {typeOrder.map(function (type) {
          if (fnMap[type]) {
            return (
              <Block column align='start center' wide>
                <Block
                  textAlign='left'
                  w={140}
                  py='s'
                  textTransform='capitalize'>
                  {type}
                </Block>
                {fnMap[type].map(key => (
                  <CodeButton
                    key={key}
                    disabled={readOnly}
                    //addBlock={!readOnly && addBlock(createBlock(key, docs))}
                    name={key}
                    spec={docs[key]} />
                ))}
              </Block>
            )
          }
        })}
      </Block>
    )
  }
})

function mapDocs (docs) {
  return reduceObj(
    function (memo, val, key) {
      if (!val.hidden && key !== 'createFunction') {
        return setProp(val.type, memo, (memo[val.type] || []).concat(key))
      }

      return memo
    },
    {},
    docs
  )
}

function cmp (a, b) {
  const idxA = getPosition(a)
  const idxB = getPosition(b)

  return idxA < idxB ? -1 : idxA === idxB ? 0 : 1
}

function createBlock (type, docs) {
  switch (type) {
    case 'up':
    case 'down':
    case 'left':
    case 'right':
    case 'repeat':
      return { ...docs[type], type, payload: [1] }
    case 'ifColor':
      return { ...docs[type], type, payload: ['white'] }
    case 'createFunction':
      const userFns = Object.keys(docs).filter(
        doc => doc.search(/^f([0-9]*?)$/gm) > -1
      ).length
      return { type: 'userFn', block: true, payload: ['f' + (userFns + 1)] }
    default:
      const payload = docs[type].args && docs[type].args.map(arg => arg.default)
      const block = { ...docs[type], type }
      if (payload) block.payload = payload
      return block
  }
}

/**
 * <CodeButton/>
 */

const CodeButton = component({
  render ({ props, context, actions }) {
    const { disabled, addBlock, name, show, spec = {} } = props
    const args = Array.isArray(spec.args)
      ? spec.args.map(arg => arg.name)
      : []
    const description = template(spec.description)
    const defaultArgs = spec.defaultArgs || []
    const params = args.length === 0 ? defaultArgs : args
    let fixedArgs = ''
    switch (name) {
      case 'comment':
      case 'lineBreak':
        fixedArgs = null
        break;
      default:
        fixedArgs = `(${args.join(',')})`
    }

    return (
      <Button
        w='140px'
        h='40px'
        m='5px'
        fs='14px'
        py={0}
        activeProps={{ boxShadow: '0 1px 1px rgba(0,0,0,.4)' }}
        bgColor={typeColors[spec.type]}
        align='center center'
        boxShadow='0 1px 3px rgba(0,0,0,0.5)'
        disabled={disabled}
        hide={spec.hidden}
        onClick={!disabled && addBlock}
        title={description({args: params.map(wrapString)})}>
        <Text fs='12'> <b> {name === 'comment' ? '\\\\ comment' : name} </b>{fixedArgs} </Text>
      </Button>
    )
  }
})


/**
 * Helper Functions
 */

function wrapString (string) {
	return typeof string === 'string' ? '`' + string + '`' : string
}

function getPosition (val) {
  return capabilityOrder.indexOf(val)
}


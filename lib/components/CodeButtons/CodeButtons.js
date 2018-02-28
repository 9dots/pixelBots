/** @jsx element */

import { capabilityOrder, typeColors, arrowColors, typeOrder } from 'animalApis'
import BlockIcon from 'components/BlockIcon'
import { component, element } from 'vdux'
import { Button } from 'vdux-containers'
import reduceObj from '@f/reduce-obj'
import setProp from '@f/set-prop'
import template from 'lodash/template'
import { Icon, Block, Text } from 'vdux-ui'
import omit from '@f/omit'
import map from '@f/map'
import { parse } from 'babylon';
import { inspect } from 'util'

/**
 * <BlockButtons/>
 */

export default component({
  render({ props }) {
    const { readOnly, insertCode, docs, sequence, startCode, ...rest } = props
    const newDocs = getFunctionButtons(docs, sequence, startCode)
    const fnMap = map(
      (arr, key) =>
        key === 'functions' ? arr.concat('createFunction') : arr.sort(cmp),
      { [newDocs.createFunction && 'functions']: [], ...mapDocs(newDocs) }
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
                    insertCode={!readOnly && insertCode(key, newDocs[key])}
                    name={key}
                    spec={newDocs[key]} />
                ))}
              </Block>
            )
          }
        })}
      </Block>
    )
  }
})

function mapDocs(docs) {
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

function cmp(a, b) {
  const idxA = getPosition(a)
  const idxB = getPosition(b)

  return idxA < idxB ? -1 : idxA === idxB ? 0 : 1
}

function createBlock(type, docs) {
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
  render({ props, context, actions }) {
    const { disabled, insertCode, name, show, spec = {} } = props
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
      case 'repeat':
      case 'draw':
      case 'ifColor':
      case 'frameOf':
      case 'createFunction':
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
        fs='20px'
        py={0}
        activeProps={{ boxShadow: '0 1px 1px rgba(0,0,0,.4)' }}
        bgColor={typeColors[spec.type]}
        align='center center'
        boxShadow='0 1px 3px rgba(0,0,0,0.5)'
        disabled={disabled}
        hide={spec.hidden}
        onClick={!disabled && insertCode}
        title={description({ args: params.map(wrapString) })}>
        <Text fs='15'> <b> {name === 'comment' ? '\/\/ comment' : (name === 'createFunction' ? 
            <Icon fs='l' bolder name='add' /> : name)} </b>
        {fixedArgs === '(color)' ? '(\'color\')' : fixedArgs} </Text>
      </Button>
    )
  }
})


/**
 * Helper Functions
 */

function wrapString(string) {
  return typeof string === 'string' ? '`' + string + '`' : string
}

function getPosition(val) {
  return capabilityOrder.indexOf(val)
}

function getFunctionButtons(docs, sequence, startCode) {
  let newDocs = {...docs}
  if (sequence || startCode) {
    try {
      const AST = parse(sequence)
      AST.program.body.forEach(element => {
        if (element.type === "FunctionDeclaration") {
          console.log(element)
          const functionName = element.id.name
          let functionParams = []
          if (element.params){ 
            element.params.forEach((param)=>{
              functionParams.push({name: param.name})
            })
          }
          newDocs[functionName] = { snippet: functionName + '()', args: functionParams, description: "Custom function", type: 'functions' }
        }
      })
    }
    catch (e) {
      console.log(e)
      return docs
    }
  }
  return newDocs
}
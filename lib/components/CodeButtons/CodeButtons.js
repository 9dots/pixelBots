/** @jsx element */

import { capabilityOrder, typeColors, typeOrder } from 'animalApis'
import { component, element } from 'vdux'
import { Button } from 'vdux-containers'
import reduceObj from '@f/reduce-obj'
import setProp from '@f/set-prop'
import template from 'lodash/template'
import { Icon, Block, Text } from 'vdux-ui'
import omit from '@f/omit'
import map from '@f/map'
import { parse } from 'babylon'

/**
 * <CodeButtons/>
 */

export default component({
  render ({ props }) {
    const {
      readOnly,
      insertCode,
      docs,
      sequence,
      startCode,
      palette,
      ...rest
    } = props
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
                    palette={palette}
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

/**
 * <CodeButton/>
 */

const CodeButton = component({
  render ({ props, context, actions }) {
    const { disabled, insertCode, name, palette, spec = {} } = props
    const args = Array.isArray(spec.args) ? spec.args.map(arg => arg.name) : []
    const description = template(spec.description)
    const defaultArgs = spec.defaultArgs || []
    const params = args.length === 0 ? defaultArgs : args
    let fixedArgs = ''
    switch (name) {
      case 'comment':
      case 'lineBreak':
      case 'repeat':
      case 'draw':
      case 'ifStatement':
      case 'ifColor':
      case 'frameOf':
      case 'createFunction':
      case 'frameVar':
        fixedArgs = null
        break
      case 'paint':
      case 'paintI':
      case 'paintZ':
      case 'paintO':
      case 'paintT':
      case 'paintL':
      case 'paintS':
      case 'paintJ':
        palette && palette.length > 2
          ? (fixedArgs = "('color')")
          : (fixedArgs = '()')
        break
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
        <Text fs='15'>
          <b>
            {name === 'comment' ? (
              '// comment'
            ) : name === 'createFunction' ? (
              <Icon fs='l' bolder name='add' />
            ) : name === 'ifStatement' ? (
              'if'
            ) : name === 'frameVar' ? (
              'frame'
            ) : (
              name
            )}
          </b>
          {fixedArgs}
        </Text>
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

function getFunctionButtons (docs, sequence, startCode) {
  if (sequence || startCode) {
    try {
      const AST = parse(sequence)
      return AST.program.body.reduce((acc, element) => {
        if (element.type === 'FunctionDeclaration') {
          const { name } = element.id
          return {
            ...acc,
            [name]: {
              snippet: name + '()',
              args: element.params.map(p => ({ name: p.name })),
              description: 'Custom function',
              type: 'functions'
            }
          }
        }
        return acc
      }, docs)
    } catch (e) {}
  }
  return docs
}

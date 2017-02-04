/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import marked from 'marked'
import isArray from '@f/is-array'

marked.setOptions({
  highlight: (code) => hljs.highlightAuto(code).value
})

function render ({props}) {
  const {code = ''} = props
  console.log(code)
  return (
    <Block overflow='visible' id='print-container' visibility='hidden' absolute top='0' left='0' wide >
      <Block innerHTML={marked(stringify(code))}/>
    </Block>
  )
}

function wrapCode (code) {
  return `
\`\`\`js
${code}
\`\`\`
`
}

function stringify (code) {
  if (isArray(code)) {
    return wrapCode(code.join('\n'))
  }
  return wrapCode(code)
}

export default {
  render
}

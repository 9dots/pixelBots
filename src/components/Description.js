/** @jsx element */

import element from 'vdux/element'
import marked from 'marked'
import {Block} from 'vdux-ui'

const CLASS_NAME = 'task-list-item-checkbox'

var renderer = new marked.Renderer()
renderer.listitem = function (text) {
  if (/^\s*\[[x ]\]\s*/.test(text)) {
    text = text
      .replace(/^\s*\[ \]\s*/, '<div><input type="checkbox" class="task-list-item-checkbox"></div><div>')
      .replace(/^\s*\[x\]\s*/, '<div><input type="checkbox" class="task-list-item-checkbox" checked></div><div>')
    return '<li style="list-style: none; display: flex;">' + text + '</div></li>'
  } else {
    return '<li>' + text + '</li>'
  }
}

marked.setOptions({
  renderer: renderer,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
})

function render ({props}) {
  const {content, saveDocumentation} = props

  const html = content ? marked(content) : ''

  return <Block w='60%' m='0 auto'>
    <Block onClick={handleClick} innerHTML={html}/>
  </Block>

  function * handleClick (e) {
    if (e.target.className === CLASS_NAME) {
      const elements = document.getElementsByClassName(CLASS_NAME)
      const arrElements = Array.prototype.slice.call(elements)
      const idx = arrElements.findIndex((ele) => e.target.isSameNode(ele))
      let nth = 0
      const updated = content.replace(/(\-\s\[[\s|x]\])(.*)/g, (match, p1, p2, original) => {
        const replacement = p1 === '- [ ]' ? '- [x]' : '- [ ]'
        return nth++ === idx ? `${replacement} ${p2}` : match
      })
      yield saveDocumentation(updated)
    }
  }
}

export default {
  render
}

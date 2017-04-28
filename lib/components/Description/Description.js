/**
 * Imports
 */

import {component, element, decodeRaw} from 'vdux'
import {Block} from 'vdux-ui'
import marked from 'marked'

const CLASS_NAME = 'task-list-item-checkbox'
let renderer = new marked.Renderer()
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

/**
 * <Description/>
 */

export default component({
  render ({props, actions}) {
	  const {content, saveDocumentation = () => {}, ...restProps} = props

	  const html = content ? marked(content) : ''

	  return <Block w='60%' m='0 auto' {...restProps}>
	    <Block onClick={decodeRaw(actions.handleClick)} innerHTML={html}/>
	  </Block>
  },
  controller: {
  	* handleClick ({props}, e) {
  		if (e.target.className === CLASS_NAME) {
	      const elements = document.getElementsByClassName(CLASS_NAME)
	      const arrElements = Array.prototype.slice.call(elements)
	      const idx = arrElements.findIndex((ele) => e.target.isSameNode(ele))
	      let nth = 0
	      const updated = props.content.replace(/(\-\s\[[\s|x]\])(.*)/g, (match, p1, p2, original) => {
	        const replacement = p1 === '- [ ]' ? '- [x]' : '- [ ]'
	        return nth++ === idx ? `${replacement} ${p2}` : match
	      })
        if (props.saveDocumentation) {
          yield props.saveDocumentation(updated)
        }
	    }
  	}
  }
})

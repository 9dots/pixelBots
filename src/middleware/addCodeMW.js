import {codeAdded} from '../actions'
import {scrollTo} from './scroll'
const lineHeight = 50

export default function ({dispatch, getState}) {
  return (next) => (action) => {
    if (action.type === codeAdded.type) {
      const editor = document.querySelector('.code-editor')
      if (!editor) return next(action)
      let selectedLine = action.payload || getState().selectedLine
      let numElements = Math.floor(editor.offsetHeight / lineHeight)
      let lastVisibleLinePos = editor.scrollTop + (editor.offsetHeight * ((numElements - 2) / numElements))
      let firstVisibleLinePos = editor.scrollTop + lineHeight * 2
      let tries = 0
      selectedLine--

      setTimeout(scroll)

      function scroll () {
        if (++tries > 5) {
          return
        }
        let elem = document.querySelector(`#code-icon-${selectedLine}`)
        if (!elem) return setTimeout(scroll)
        let elemPos = elem.offsetTop
        if (elemPos > lastVisibleLinePos) {
          dispatch(scrollTo('.code-editor', `#code-icon-${(selectedLine - (numElements - 2))}`))
        } else if (elemPos < firstVisibleLinePos) {
          selectedLine = selectedLine || 1
          dispatch(scrollTo('.code-editor', `#code-icon-${(selectedLine - 1)}`))
        }
      }
    }
    return next(action)
  }
}

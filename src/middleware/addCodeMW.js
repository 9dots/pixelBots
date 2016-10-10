import {addCode} from '../actions'
import {scrollTo} from './scroll'
const lineHeight = 68

export default function ({dispatch, getState}) {
  return (next) => (action) => {
    if (action.type === addCode.type) {
      const editor = document.querySelector('.code-editor')
      let {selectedLine} = getState()
      let numElements = Math.floor(editor.offsetHeight / lineHeight)
      let lastVisibleLinePos = editor.scrollTop + (editor.offsetHeight * ((numElements - 2) / numElements))
      let firstVisibleLinePos = editor.scrollTop + lineHeight * 2

      setTimeout(function () {
        let elemPos = document.querySelector(`#code-icon-${selectedLine}`).offsetTop
        if (elemPos > lastVisibleLinePos) {
          dispatch(scrollTo('.code-editor', `#code-icon-${(selectedLine - (numElements - 2))}`))
        } else if (elemPos < firstVisibleLinePos) {
          selectedLine = selectedLine || 1
          dispatch(scrollTo('.code-editor', `#code-icon-${(selectedLine - 1)}`))
        }
      })
    }
    return next(action)
  }
}

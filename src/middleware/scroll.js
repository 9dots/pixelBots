/**
* Imports
*/

import createAction from '@f/create-action'
import * as easingUtil from 'easing-utils'

/**
* Action types
*/

const SCROLL_TO = 'SCROLL_TO'

/**
* Scroll middleware
*/

function middleware () {
  return (next) => (action) =>
    action.type === SCROLL_TO
      ? scrollToElement(action.payload)
      : next(action)
}

/**
* Helpers
*/

function scrollToElement ({element, parent, duration = 0, easing, offsetX = 0, offsetY = 0}) {
  parent = asElement(parent)
  element = asElement(element)
  easing = typeof easing === 'string'
   ? easingUtil[easing]
   : easing

  const elemPosition = element.offsetTop

  parent.scrollTop = elemPosition
}

function asElement (element) {
  return typeof element === 'string'
   ? document.querySelector(element)
   : element
}

/**
* Action creators
*/

const scrollTo = createAction(
  SCROLL_TO,
  (parent, element, opts) => ({
    element,
    parent,
    ...opts
  })
)

/**
* Exports
*/

export default middleware
export {
 scrollTo
}

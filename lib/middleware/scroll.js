/**
 * Imports
 */

import animate from '@f/animate'
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
  return next => action =>
    action.type === SCROLL_TO
      ? scrollToElement(action.payload)
      : next(action)
}

/**
 * Helpers
 */

function scrollToElement ({element, duration, easing, offsetX = 0, offsetY = 0}) {
  element = asElement(element)
  easing = typeof easing === 'string'
    ? easingUtil[easing]
    : easing

  const {left, top} = element.getBoundingClientRect()
  const start = {
    left: window.pageXOffset,
    top: window.pageYOffset
  }

  const end = {
    left: start.left + left + offsetX,
    top: start.top + top + offsetY
  }

  animate(start, end, props => {
    window.scrollTo(props.left, props.top)
  }, duration, easing)
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
  (element, opts) => ({
    element,
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
/**
 * Imports
 */

import createAction from '@f/create-action'
import segment from 'utils/segment'

/**
 * Constants
 */

const writeKey = process.env.TRACKING_CODE

/**
 * Analytics middleware
 */

function analytics () {
  segment(writeKey)

  let analyticsReady = false
  const readyQueue = []

  window.analytics.ready(() => {
    analyticsReady = true
    readyQueue.forEach(fn => fn())
    readyQueue.length = 0
  })

  return next => action => {
    if (action.type === track.type || action.type === page.type) {
      if (analyticsReady) {
        return process(action)
      } else {
        readyQueue.push(() => process(action))
      }
    } else {
      return next(action)
    }
  }

  function process (action) {
    switch (action.type) {
      case track.type: {
        const {name, traits} = action.payload
        window.analytics.track(name, traits)
        break
      }
      case page.type: {
        const {name, params} = action.payload
        window.analytics.page(name, params)
        break
      }
    }
  }
}

/**
 * Actions
 */

const track = createAction('analytics: track')
const page = createAction('analytics: page')

/**
 * Exports
 */

export default analytics
export {
  track,
  page
}

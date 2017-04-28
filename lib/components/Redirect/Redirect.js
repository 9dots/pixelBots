
/**
 * Imports
 */

import {component, element} from 'vdux'

/**
 * <Redirect/>
 */

export default component({
  onCreate ({props, context}) {
    return context.setUrl(props.to, true)
  },

  render ({props}) {
    return <span />
  },

  /**
   * onUpdate
   *
   * Support multiple redirects (the original redirect may
   * not be destroyed in the diff if we've just swapped the
   * url)
   */

  onUpdate (prev, {context, props}) {
    return context.setUrl(props.to, true)
  }
})
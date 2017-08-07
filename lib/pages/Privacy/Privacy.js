/**
 * Imports
 */

 import MarkdownFile from 'components/MarkdownFile'
import {component, element} from 'vdux'
import privacy from './privacy.md'

/**
 * <Terms/>
 */

export default component({
  render ({props}) {
    return (
      <MarkdownFile html={privacy}/>
    )
  }
})

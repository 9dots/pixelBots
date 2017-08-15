/**
 * Imports
 */

 import MarkdownFile from 'components/MarkdownFile'
import {component, element} from 'vdux'
import terms from './terms.md'

/**
 * <Terms/>
 */

export default component({
  render ({props}) {
    return (
      <MarkdownFile html={terms}/>
    )
  }
})

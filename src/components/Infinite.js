/**
 * Imports
 */

import element from 'vdux/element'
import Window from 'vdux/window'
import Loading from '../components/Loading'
import {Block} from 'vdux-ui'

/**
 * <InfiniteScroll/>
 */

const initialState = ({props, local}) => ({
	actions: {
		* handleScroll (e) {
      const {more, threshold = 350} = props

      if (!more) return

      const delta = document.body.scrollHeight - (e.target.scrollTop)

      if (delta <= threshold) {
        yield more()
      }
    }
	}
})

function render ({props, state, children}) {
	const {loading, ...rest} = props
	const {handleScroll} = state.actions
	return (
    <Block pb='l' {...rest}>
      {children}
      <Window onScroll={handleScroll} />
    </Block>
  )
}

export default {
	initialState,
	render
}
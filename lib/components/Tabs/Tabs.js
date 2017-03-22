/**
 * Imports
 */

import toCamelCase from 'utils/toCamelCase'
import {component, element} from 'vdux'
import Tab from 'components/Tab'
import {Flex} from 'vdux-ui'

/**
 * <Tabs/>
 */

const colors = [
  'red',
  'blue',
  'green',
  'yellow'
]

export default component({
  initialState: function ({props}) {
  	return {
    	active: props.active || props.tabs[0]
  	}
  },
  render ({props, actions, state}) {
	  const {tabs, onClick, tabHeight, ...restProps} = props
  	const {active} = state
    return (
      <Flex
        borderBottom='1px solid #e0e0e0'
        wide
        relative
        bottom='0'
        color='lightBlue'
        h='42px'
        px
        {...restProps}>
        {tabs.filter(removeEmpty).map(toCamelCase).map((tab, i, arr) => <Tab
          label={tabs[tabs.length - arr.length + i]}
          name={tab}
          h={tabHeight}
          active={tab === active}
          handleClick={actions.handleClick}
          underlineColor={colors[i % 4]}
	      />)}
      </Flex>
    )
  },
  controller: {
  	* handleClick ({actions, props}, tab) {
  		const {onClick = () => {}} = props
  		yield onClick(tab)
  		yield actions.setActive(tab)
  	}
  },
  reducer: {
  	setActive: (state, tab) => ({active: tab})
  }
})

function removeEmpty (elem) {
  return !!elem
}

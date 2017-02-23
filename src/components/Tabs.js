/** @jsx element */

import ProfileTab from '../components/ProfileTab'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import {toCamelCase} from '../utils'
import element from 'vdux/element'
import {Flex} from 'vdux-ui'

const colors = [
  'red',
  'blue',
  'green',
  'yellow',
]

const setActive = createAction('<Tabs/>: SET_ACTIVE')
const initialState = ({props, local}) => ({
  active: props.active || props.tabs[0],
  actions: {
    setActive: local((tab) => setActive(tab))
  }
})

function render ({props, state, local}) {
  const {tabs, onClick, tabHeight, ...restProps} = props
  const {active, actions} = state
  return (
    <Flex
      borderBottom='1px solid #e0e0e0'
      wide
      relative
      bottom='0'
      color='lightBlue'
      h='42px'
      {...restProps}>
      {tabs.filter(removeEmpty).map(toCamelCase).map((tab, i, arr) => <ProfileTab
        label={tabs[tabs.length - arr.length + i]}
        name={tab}
        h={tabHeight}
        active={tab === active}
        handleClick={handleClick}
        underlineColor={colors[i % 4]}
      />)}
    </Flex>
  )

  function * handleClick (tab) {
    yield onClick(tab)
    yield actions.setActive(tab)
  }
}

function removeEmpty (elem) {
  return !!elem
}

const reducer = handleActions({
  [setActive.type]: (state, payload) => ({...state, active: payload})
})

export default {
  initialState,
  reducer,
  render
}

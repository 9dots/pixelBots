/** @jsx element */

import ProfileTab from '../components/ProfileTab'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import element from 'vdux/element'
import {Flex} from 'vdux-ui'

const colors = [
  'red',
  'blue',
  'yellow',
  'green'
]

const setActive = createAction('<Tabs/>: SET_ACTIVE')
const initialState = ({props, local}) => ({
  active: props.tabs[0],
  actions: {
    setActive: local((tab) => setActive(tab))
  }
})

function render ({props, state, local}) {
  const {tabs, onClick, tabHeight, ...restProps} = props
  const {active, actions} = state
  return (
    <Flex borderBottom='1px solid #999' wide relative bottom='0' color='lightBlue' h='42px' {...restProps}>
      {tabs.map((tab, i) => <ProfileTab
        title={tab}
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

const reducer = handleActions({
  [setActive.type]: (state, payload) => ({...state, active: payload})
})

export default {
  initialState,
  reducer,
  render
}

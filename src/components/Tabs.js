/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import Tab from './Tab'
import createAction from '@f/create-action'
import handleActions from '@f/handle-actions'

const setActive = createAction('<Tabs/>: SET_ACTIVE')
const initialState = ({props, local}) => ({
  active: props.tabs[0],
  actions: {
    setActive: local((tab) => setActive(tab))
  }
})

function render ({props, state, local}) {
  const {tabs, onClick, ...restProps} = props
  const {active, actions} = state
  return (
    <Block
      wide
      align='start center'
      bgColor='#999'
      h='40px'
      {...restProps}>
      {tabs.map((tab) => <Tab
        h='40px'
        bgColor='#999'
        color='white'
        name={tab}
        active={tab === active}
        handleClick={handleClick}
      />)}
    </Block>
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

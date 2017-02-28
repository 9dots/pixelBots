import {setUrl} from 'redux-effects-location'
import element from 'vdux/element'

function * onCreate ({props}) {
  yield setUrl(props.path, true)
}

function render () {
  return <span />
}

export default {
  onCreate,
  render
}

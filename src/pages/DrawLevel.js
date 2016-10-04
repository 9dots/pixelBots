/** @jsx element */

import element from 'vdux/element'
import {Block} from 'vdux-ui'
import {Button} from 'vdux-containers'
import {setUrl} from 'redux-effects-location'
import Level from '../components/Level'

function render ({props}) {
  return (
    <Block>
      Select Level
      <Level
        editMode={true}
        painted={[]}
        levelSize='500px'
        numRows={5}
        numColumns={5}/>
      <Button onClick={() => setUrl('/')}>Save</Button>
    </Block>
  )
}

export default {
  render
}

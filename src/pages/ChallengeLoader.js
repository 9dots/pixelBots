/** @jsx element */

import IndeterminateProgress from '../components/IndeterminateProgress'
import {Box, Block, Icon, MenuItem, Image} from 'vdux-ui'
import {setUrl} from 'redux-effects-location'
import fire, {refMethod} from 'vdux-fire'
import Button from '../components/Button'
import {createCode} from '../utils'
import element from 'vdux/element'

function render ({props}) {
  const {game, selected, mine, editable, toggleSelected, setModal, lastEdited} = props

  if (game.loading) {
    return <IndeterminateProgress />
  }
  if (game.value === null) {
    return <div />
  }

  const item = game.value

  return (
    <MenuItem
      wide
      relative
      cursor={mine ? 'move' : 'default'}
      fontWeight='300'
      bgColor='transparent'
      borderTop='1px solid #999'>
      <Block align='start center'>
        <Box align='start center' flex minWidth='250px'>
          <Image mr='2em' display='block' sq='50px' src={item.imageUrl} />
          {item.title}
        </Box>
        <Box w='180px' minWidth='180px'>
          <Block align='start center'>
            <Image mr='1em' sq='40px' src={`/animalImages/${item.animals[0].type}.jpg`} />
            {item.animals[0].type}
          </Block>
        </Box>
        <Box w='180px' minWidth='180px'>
          {item.inputType}
        </Box>
        <Box w='180px' minWidth='180px'>
          {lastEdited}
        </Box>
        {mine && <Box absolute lineHeight='0' right='2em'>
          <Icon name='delete' />
        </Box>}
      </Block>
    </MenuItem>
  )
}

export default fire((props) => ({
  game: `/games/${props.ref}`
}))({
  render
})

// function * createAssignment () {
//   const code = yield createCode()
//   yield refMethod({
//     ref: `/links/${code}`,
//     updates: {
//       method: 'set',
//       value: {
//         type: 'game',
//         payload: props.ref
//       }
//     }
//   })
//   yield setModal(code)
// }

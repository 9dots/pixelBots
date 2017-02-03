/** @jsx element */

import IndeterminateProgress from '../components/IndeterminateProgress'
import {Box, Block, Checkbox, Menu, Icon, Image} from 'vdux-ui'
import deepEqual from '@f/deep-equal'
import arrayEqual from '@f/array-equal'
import objectEqual from '@f/object-equal'
import {Dropdown, MenuItem} from 'vdux-containers'
import {setUrl} from 'redux-effects-location'
import {createAssignmentLink} from '../utils'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import fire, {refMethod} from 'vdux-fire'
import element from 'vdux/element'
import moment from 'moment'

const mouseOver = createAction('<ChallengeLoader/>: MOUSE_OVER')
const mouseOut = createAction('<ChallengeLoader/>: MOUSE_OUT')

const initialState = () => ({
  hovering: false
})

const btn = (
  <MenuItem
    bgColor='#e5e5e5'
    mr='1em'
    align='center center'
    circle='40px'>
    <Icon name='more_vert' />
  </MenuItem>
)

function render ({props, local, state}) {
  const {
    handleClick = () => {},
    lastEdited,
    selected = [],
    setModal,
    editable,
    userRef,
    remove = () => {},
    game,
    mine,
    key,
    ref,
    uid
  } = props

  const {hovering} = state
  const selectMode = selected.length > 0
  const isSelected = selected.indexOf(ref) > -1


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
      cursor='default'
      onMouseOver={local(mouseOver)}
      onMouseOut={local(mouseOut)}
      fontWeight='300'
      pl='5%'
      bgColor='transparent'
      borderTop='1px solid #999'>
      <Block align='start center'>
        <Box align='start center' flex minWidth='250px'>
          <Box align='start center' flex>
            <Image mr='2em' display='block' sq='50px' src={item.imageUrl} />
            {item.title}
          </Box>
          <Box>
          {(mine && hovering) && <Dropdown btn={btn} zIndex='999'>
              <Menu w='150px' column zIndex='999'>
                <MenuItem onClick={() => setUrl(`/games/${props.ref}`)}>
                  Play
                </MenuItem>
                <MenuItem onClick={() => assign(props.ref)}>
                  Assign
                </MenuItem>
                <MenuItem onClick={() => setUrl(`/edit/${props.ref}`)}>
                  Edit
                </MenuItem>
                <MenuItem onClick={() => remove(uid, userRef)}>
                  Remove
                </MenuItem>
              </Menu>
            </Dropdown>}
          </Box>
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
          {moment(lastEdited).fromNow()}
        </Box>
        {(mine && (hovering || selectMode)) && <Box absolute lineHeight='0' right='1em'>
          <Checkbox
            cursor='pointer'
            checked={isSelected}
            transition='all .2s ease-in-out'
            onChange={() => handleClick(props.ref)} />
        </Box>}
      </Block>
    </MenuItem>
  )

  function * assign (ref) {
    yield * createAssignmentLink(
      'game',
      ref,
      (code) => setModal(code)
    )
  }
}

const reducer = handleActions({
  [mouseOver.type]: (state) => ({...state, hovering: true}),
  [mouseOut.type]: (state) => ({...state, hovering: false})
})

export default fire((props) => ({
  game: `/games/${props.ref}`
}))({
  initialState,
  reducer,
  render
})

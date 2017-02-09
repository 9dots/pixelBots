/** @jsx element */

import IndeterminateProgress from '../components/IndeterminateProgress'
import {Box, Block, Checkbox, Menu, Icon, Image} from 'vdux-ui'
import ImageSelect from '../components/ImageSelect'
import IconButton from '../components/IconButton'
import {Dropdown, MenuItem} from 'vdux-containers'
import {setUrl} from 'redux-effects-location'
import {createAssignmentLink} from '../utils'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import element from 'vdux/element'
import fire from 'vdux-fire'
import moment from 'moment'

const mouseOver = createAction('<ChallengeLoader/>: MOUSE_OVER')
const mouseOut = createAction('<ChallengeLoader/>: MOUSE_OUT')

const initialState = () => ({
  hovering: false
})

function render ({props, local, state}) {
  const {
    playClick = () => setUrl(`/games/${props.ref}`),
    assignmentClick = () => assign(props.ref),
    handleClick = () => {},
    remove = () => {},
    selected = [],
    noAssign,
    lastEdited,
    checkbox,
    draggable,
    handleDragStart,
    handleDragEnter,
    handleDrop,
    dummy,
    setModal,
    userRef,
    game,
    mine,
    ref,
    uid
  } = props

  const isSelected = selected.indexOf(ref) > -1
  const selectMode = selected.length > 0
  const {hovering} = state

  if (game.loading) {
    return <IndeterminateProgress />
  }

  if (game.value === null) {
    return <div />
  }

  const item = game.value
  const animalImg = `/animalImages/${item.animals[0].type}.jpg`

  return (
    <Block>
      {dummy && dummy}
      <MenuItem
        wide
        relative
        userSelect='none'
        cursor='default'
        id={`game-${ref}`}
        draggable={draggable}
        onDragStart={draggable && maybeDragStart}
        onDragEnter={draggable && handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDrop={draggable && handleDrop}
        onMouseOver={local(mouseOver)}
        onMouseOut={local(mouseOut)}
        fontWeight='300'
        pl='5%'
        bgColor='transparent'
        borderTop='1px solid #999'>
        <Block align='start center'>
          <Box align='start center' flex minWidth='250px'>
            <Box align='start center' flex>
              {
                mine || checkbox
                  ? <ImageSelect
                      hoverItem={(mine && !checkbox) && <Icon id={`drag-handle-${ref}`} cursor='move' name='drag_handle'/>}
                      selectMode={selectMode}
                      imageUrl={item.imageUrl || animalImg}
                      isSelected={isSelected}
                      onSelect={handleClick}
                      ref={ref}/>
                  : <Image mr='2em' sq='50px' src={item.imageUrl || animalImg} />
              }
              {item.title}
            </Box>
            <Box auto pr='2em'>
            {(hovering && !selectMode) && (
              <Block align='center center' zIndex='999'>
                <IconButton
                  name='play_arrow'
                  onClick={playClick}/>
                {!noAssign && <IconButton
                  name='assignment'
                  onClick={assignmentClick}/>}
                {
                  mine && <Block align='center center'>
                    <IconButton
                      name='edit'
                      onClick={() => setUrl(`/edit/${props.ref}`)}/>
                    <IconButton
                      name='delete'
                      onClick={() => remove(uid, userRef)}/>
                  </Block>
                }
              </Block>
            )}
            </Box>
          </Box>
          <Box w='180px' minWidth='180px'>
            <Block align='start center'>
              <Image mr='1em' sq='40px' src={animalImg} />
              {item.animals[0].type}
            </Block>
          </Box>
          <Box w='180px' minWidth='180px'>
            {item.inputType}
          </Box>
          {lastEdited && <Box w='180px' minWidth='180px'>
            {moment(lastEdited).fromNow()}
          </Box>}
        </Block>
      </MenuItem>
    </Block>
  )

  function * maybeDragStart (e) {
    const handle = document.getElementById(`drag-handle-${ref}`)
    if (handle) {
      return yield handleDragStart(e)
    }
    e.preventDefault()
  }

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

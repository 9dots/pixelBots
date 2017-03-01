/** @jsx element */

import IndeterminateProgress from '../components/IndeterminateProgress'
import AddToPlaylistModal from '../components/AddToPlaylistModal'
import {Box, Block, Checkbox, Menu, Icon, Image} from 'vdux-ui'
import ImageSelect from '../components/ImageSelect'
import {Dropdown, MenuItem} from 'vdux-containers'
import IconButton from '../components/IconButton'
import {setUrl} from 'redux-effects-location'
import {createAssignmentLink} from '../utils'
import handleActions from '@f/handle-actions'
import createAction from '@f/create-action'
import {setModalMessage} from '../actions'
import element from 'vdux/element'
import objEqual from '@f/equal-obj'
import {diff} from 'deep-diff'
import fire from 'vdux-fire'
import moment from 'moment'

const mouseOver = createAction('<ChallengeLoader/>: MOUSE_OVER')
const mouseOut = createAction('<ChallengeLoader/>: MOUSE_OUT')

const initialState = () => ({
  hovering: false
})

function render ({props, local, state}) {
  const {
    playClick = () => setUrl(`/play/${props.ref}`),
    assignmentClick = () => assign(props.ref),
    handleClick = () => {},
    remove = () => {},
    isSelected,
    selectMode,
    noAssign,
    lastEdited,
    checkbox,
    draggable,
    handleDragStart = () => {},
    handleDragEnter = () => {},
    handleDrop = () => {},
    dummy,
    setModal,
    userRef,
    game,
    mine,
    ref,
    uid
  } = props

  const {hovering} = state

  if (game.loading) {
    return <IndeterminateProgress />
  }

  if (game.value === null) {
    return <div />
  }

  const item = game.value
  const animalImg = `/animalImages/${item.animals[0]}.jpg`
  console.log(item)

  return (
    <Block>
      {dummy && dummy}
      <MenuItem
        onClick={() => setUrl(`/games/${ref}`)}
        wide
        pl='5%'
        relative
        userSelect='none'
        fontWeight='300'
        bgColor='white'
        cursor='pointer'
        id={`game-${ref}`}
        draggable={draggable}
        onDragStart={draggable && maybeDragStart}
        onDragEnter={draggable && handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDrop={draggable && handleDrop}
        onMouseOver={local(mouseOver)}
        onMouseOut={local(mouseOut)}
        borderBottom='1px solid #e0e0e0'>
        <Block align='start center'>
          <Box align='start center' flex minWidth='250px'>
            <Block>
              {
                mine && !checkbox
                  ? <ImageSelect
                    hoverItem={(mine && !checkbox) && <Icon id={`drag-handle-${ref}`} cursor='move' name='drag_handle' />}
                    selectMode={selectMode}
                    border='1px solid #e0e0e0'
                    imageUrl={item.imageUrl || animalImg}
                    isSelected={isSelected}
                    onSelect={handleClick}
                    ref={ref} />
                  : <Image mr='2em' sq='50px' src={item.imageUrl || animalImg} />
              }
            </Block>
            <Block w='60%' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>{item.title}</Block>
            <Block mr='10px' auto>
              {(hovering) && (
                <Block id='challenge-loader-buttons' align='center center' zIndex='999'>
                  <IconButton
                    bgColor='transparent'
                    name='play_arrow'
                    onClick={[(e) => e.stopPropagation(), playClick]} />
                  <IconButton
                    bgColor='transparent'
                    name='add'
                    onClick={[
                      (e) => e.stopPropagation(),
                      () => setModalMessage(<AddToPlaylistModal gameID={ref} uid={uid} />)
                    ]} />
                  {
                  mine && <Block align='center center'>
                    <IconButton
                      bgColor='transparent'
                      name='edit'
                      onClick={[(e) => e.stopPropagation(), () => setUrl(`/edit/${props.ref}`)]} />
                    <IconButton
                      bgColor='transparent'
                      name='delete'
                      onClick={[(e) => e.stopPropagation(), () => remove(uid, userRef)]} />
                  </Block>
                }
                </Block>
            )}
            </Block>
          </Box>
          <Box w='180px' minWidth='180px'>
            <Block align='start center'>
              <Image mr='1em' sq='40px' src={animalImg} />
              {item.animals[0]}
            </Block>
          </Box>
          <Box w='180px' minWidth='180px'>
            {item.inputType === 'code' ? 'javascript' : item.inputType}
          </Box>
          <Box w='180px' minWidth='180px'>
            {lastEdited && moment(lastEdited).fromNow()}
          </Box>
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
}

const reducer = handleActions({
  [mouseOver.type]: (state) => ({...state, hovering: true}),
  [mouseOut.type]: (state) => ({...state, hovering: false})
})

export default fire((props) => ({
  game: `/games/${props.ref}/meta`
}))({
  initialState,
  reducer,
  render
})

/**
 * Imports
 */

import {component, element, decodeRaw, stopPropagation, preventDefault} from 'vdux'
import IndeterminateProgress from 'components/IndeterminateProgress'
import {Box, Block, Checkbox, Menu, Icon, Image} from 'vdux-ui'
import AddToPlaylistModal from 'components/AddToPlaylistModal'
import {Dropdown} from 'vdux-containers'
import ListItem from 'components/ListItem'
import IconButton from 'components/IconButton'
import DragHandle from 'components/DragHandle'
import fire from 'vdux-fire'
import moment from 'moment'

/**
 * <Challenge Loader/>
 */

export default fire((props) => ({
  game: `/games/${props.ref}/meta`
}))(component({
	initialState: {
		hovering: false
	},
  render ({props, context, actions, state}) {
	  const {
	    playClick = context.setUrl(`/play/${props.ref}`),
	    handleClick,
	    remove = {},
	    lastEdited,
	    checkbox,
	    draggable,
	    gameKey,
	    handleDragStart,
	    handleDragEnter,
	    handleDrop,
	    dummy,
	    game,
	    mine,
	    ref
	  } = props
	 	const {uid} = context

	  const {hovering} = state

	  if (game.loading) {
	    return <IndeterminateProgress />
	  }

	  if (game.value === null) {
	    return <div />
	  }

	  const item = game.value
	  const animalImg = `/animalImages/${item.animals[0]}.jpg`

	  return (
	    <Block>
	      {dummy && dummy}
	      <ListItem
	        onClick={context.setUrl(`/games/${ref}`)}
	        wide
	        pl='5%'
	        relative
	        userSelect='none'
	        fontWeight='300'
	        bgColor='white'
	        cursor='pointer'
	        id={`game-${ref}`}
	        draggable={draggable}
	        onDragStart={draggable ? decodeRaw(actions.maybeDragStart) : preventDefault}
	        onDragEnter={draggable && handleDragEnter}
	        onDragOver={preventDefault}
	        onDrop={draggable && handleDrop}
	        onMouseOver={actions.mouseOver()}
	        onMouseOut={actions.mouseOut()}
	        borderBottom='1px solid #e0e0e0'>
	        <Block align='start center'>
	          <Box align='start center' flex minWidth='250px'>
	            <Block mr='2em' border='1px solid grey'>
	            	<DragHandle
	            		imageSrc={item.imageUrl || animalImg}
	            		sortable={draggable}
	            		mine={mine}
	            		ref={ref}/>
	            </Block>
	            <Block w='60%' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>{item.title}</Block>
	            <Block mr='10px' auto>
	              {(hovering) && (
	                <Block id='challenge-loader-buttons' align='center center' zIndex='999'>
	                  <IconButton
	                    bgColor='transparent'
	                    name='play_arrow'
	                    onClick={[stopPropagation, playClick]} />
	                  {
	                  	!context.isAnonymous && <IconButton
  	                    bgColor='transparent'
  	                    name='add'
  	                    onClick={[
  	                      stopPropagation,
  	                      context.openModal(() => <AddToPlaylistModal gameID={ref} uid={uid} />)
  	                    ]} />
	                  }
	                  {
	                  mine && <Block align='center center'>
	                    <IconButton
	                      bgColor='transparent'
	                      name='edit'
	                      onClick={[stopPropagation, context.setUrl(`/edit/${props.ref}`)]} />
	                    <IconButton
	                      bgColor='transparent'
	                      name='delete'
	                      onClick={[stopPropagation, remove(gameKey)]} />
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
	      </ListItem>
	    </Block>
	  )
  },
  controller: {
  	* maybeDragStart ({props}, e) {
  		const {ref} = props
  		const handle = document.getElementById(`drag-handle-${ref}`)
	    if (handle) {
	      return yield props.handleDragStart()
	    } else {
	    	e.preventDefault()
	    }
  	}
  },
  reducer: {
  	mouseOver: () => ({hovering: true}),
  	mouseOut: () => ({hovering: false})
  }
}))

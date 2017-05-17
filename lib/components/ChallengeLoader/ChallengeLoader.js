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
import animalApis from 'animalApis'
import hasClass from '@f/has-class'
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
	    gameClick = context.setUrl(`/games/${props.ref}`),
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
	  const colWidth = '170px'

	  if (game.loading) {
	    return <Block h='70px' wide bgColor='white'>
	    	<IndeterminateProgress/>
	    </Block>
	  }


	  if (game.value === null) {
	    return <Block h='70px' wide bgColor='white'/>
	  }

	  const item = game.value
	  const animalImg = animalApis[item.animals[0]].imageURL

	  return (
	    <Block>
	      {dummy && dummy}
	      <ListItem
	        onClick={gameClick}
	        wide
	        pl='0%'
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
	          <Box align='start center' flex minWidth='220px' pr>
	          	<Block align='start center'>
	          		<DragHandle
		          		sq={40}
		          		hidden={!hovering || !draggable || !mine}	
	            		ref={ref}/>
		            <Block mr={20} sq={50} border='1px solid grey' bgImg={game.value.imageUrl || animalImg} backgroundSize='cover' />
	            </Block>
	           	<Block align='space-between center' flex minWidth={0} w={0} wordWrap='break-word'>
	            <Block ellipsis>{item.title}</Block>
	            <Block>
	              {(hovering) && (
	                <Block id='challenge-loader-buttons' align='center center' zIndex='999'>
	                  {
	                  	!context.isAnonymous && <IconButton
  	                    bgColor='transparent'
  	                    name='playlist_add'
  	                    circle={35}
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
	                      circle={30}
	                      border='1px solid divider'
	                      onClick={[stopPropagation, context.setUrl(`/edit/${props.ref}`)]} />
	                    <IconButton
	                      bgColor='transparent'
	                      name='delete'
	                      circle={35}
	                      onClick={[stopPropagation, remove(gameKey)]} />
	                  </Block>
	                }
	                </Block>
	            )}
	            </Block>
	            </Block>
	          </Box>
	          <Box w={colWidth} minWidth={colWidth}>
	            <Block align='start center'>
	              <Image mr='1em' sq={35} src={animalImg} />
	              {item.animals[0]}
	            </Block>
	          </Box>
	          <Box w={colWidth} minWidth={colWidth}>
	            {item.inputType === 'code' ? 'javascript' : item.inputType}
	          </Box>
	          <Box w={colWidth} minWidth={colWidth}>
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
	    if (hasClass('drag-over', handle)) {
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

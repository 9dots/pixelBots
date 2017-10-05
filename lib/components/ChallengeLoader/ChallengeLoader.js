/**
 * Imports
 */

import {
  component,
  element,
  decodeRaw,
  stopPropagation,
  preventDefault
} from 'vdux'
import IndeterminateProgress from 'components/IndeterminateProgress'
import AddToPlaylistModal from 'components/AddToPlaylistModal'
import IconButton from 'components/IconButton'
import { Box, Block, Icon, Text } from 'vdux-ui'
import DragHandle from 'components/DragHandle'
import ListItem from 'components/ListItem'
import Badge from 'components/Badge'
import hasClass from '@f/has-class'
import { images } from 'animalApis'
import getProp from '@f/get-prop'
import Switch from '@f/switch'
import fire from 'vdux-fire'
import moment from 'moment'

/**
 * <Challenge Loader/>
 */

export default fire(props => ({
  game: `/games/${props.ref}/meta`,
  saveGame: props.saveRef && `/saved/${props.saveRef}/meta`
}))(
  component({
    initialState: {
      hovering: false
    },
    render ({ props, context, actions, state }) {
      const {
        gameClick = context.setUrl(`/games/${props.ref}`),
        handleDragEnter,
        remove = {},
        handleDrop,
        isComplete,
        lastEdited,
        draggable,
        saveGame,
        gameKey,
        dummy,
        copy,
        game,
        mine,
        ref
      } = props
      const { uid } = context
      const { hovering } = state

      if (game.loading || (saveGame && saveGame.loading)) {
        return (
          <Block h='70px' wide bgColor='white'>
            <IndeterminateProgress />
          </Block>
        )
      }

      if (game.value === null) {
        return <Block h='70px' wide bgColor='white' />
      }

      const item = game.value
      const stretchType = (item.stretch || {}).type
      const count = getProp(`value.badges.${stretchType}`, saveGame) || 0
      const animalImg = images[item.animals[0]]

      return (
        <Block>
          {dummy && dummy}
          <ListItem
            onClick={gameClick}
            wide
            p='m'
            pl='0%'
            relative
            userSelect='none'
            fontWeight='300'
            bgColor='white'
            cursor='pointer'
            id={`game-${ref}`}
            color='primary'
            draggable={draggable}
            onDragStart={
              draggable ? decodeRaw(actions.maybeDragStart) : preventDefault
            }
            onDragEnter={draggable && handleDragEnter}
            onDragOver={preventDefault}
            onDrop={draggable && handleDrop}
            onMouseOver={actions.mouseOver()}
            onMouseOut={actions.mouseOut()}
            borderBottom='1px solid #e0e0e0'>
            <Block align='start center'>
              <Box align='start center' w='50%' minWidth={300} pr>
                <Block align='start center'>
                  <DragHandle
                    sq={35}
                    hidden={!hovering || !draggable || !mine}
                    ref={ref} />
                  <Block
                    mr={20}
                    sq={70}
                    border='1px solid grey'
                    bgImg={game.value.imageUrl || animalImg}
                    backgroundSize='cover' />
                </Block>
                <Block
                  align='space-between center'
                  flex
                  minWidth={0}
                  w={0}
                  wordWrap='break-word'>
                  <Block ellipsis>
                    <Block ellipsis bold pb='s'>
                      {item.title}
                    </Block>
                    <Block ellipsis>
                      <Text textTransform='capitalize'> {item.type} </Text>
                      <Text> with </Text>
                      <Text>
                        {item.inputType === 'code' ? 'Javascript' : 'Icons'}
                      </Text>
                    </Block>
                  </Block>
                  <Block>
                    {hovering && (
                      <Block
                        id='challenge-loader-buttons'
                        align='center center'
                        zIndex='999'>
                        {mine && (
                          <Block align='center center'>
                            <IconButton
                              bgColor='transparent'
                              circle={35}
                              transform='scaleX(-1)'
                              name='reply'
                              onClick={[
                                stopPropagation,
                                context.openModal(() => (
                                  <AddToPlaylistModal
                                    onSubmit={remove}
                                    gameID={ref}
                                    uid={uid} />
                                ))
                              ]} />
                            <IconButton
                              bgColor='transparent'
                              name='content_copy'
                              circle={30}
                              border='1px solid divider'
                              onClick={[stopPropagation, copy]} />
                            <IconButton
                              bgColor='transparent'
                              name='edit'
                              circle={30}
                              border='1px solid divider'
                              onClick={[
                                stopPropagation,
                                context.setUrl(`/edit/${props.ref}`)
                              ]} />
                            <IconButton
                              bgColor='transparent'
                              name='delete'
                              circle={35}
                              onClick={[stopPropagation, remove(gameKey)]} />
                          </Block>
                        )}
                      </Block>
                    )}
                  </Block>
                </Block>
              </Box>
              <Box flex hide>
                {Switch({
                  read: () => (
                    <Block align='start center'>
                      <Icon name='book' mr='s' /> Read
                    </Block>
                  ),
                  debug: () => (
                    <Block align='start center'>
                      <Icon name='bug_report' mr='s' /> Debug
                    </Block>
                  ),
                  project: () => (
                    <Block align='start center'>
                      <Icon name='grid_on' mr='s' /> Project
                    </Block>
                  ),
                  default: () => (
                    <Block align='start center'>
                      <Icon name='description' mr='s' /> Write
                    </Block>
                  )
                })(item.type)}
              </Box>
              <Box flex fs='s' align='start center' hide>
                {item.inputType === 'code'
                  ? [<Icon name='featured_play_list' mr='s' />, 'Javascript']
                  : [<Icon name='view_stream' mr='s' />, 'Icons']}
              </Box>
              <Box hide={isComplete !== undefined} flex>
                {lastEdited && moment(lastEdited).fromNow()}
              </Box>
              <Block flex align='start center' hide>
                <Block>
                  <Badge
                    type={stretchType}
                    size={32}
                    hideTitle
                    effects={false}
                    count={count || 0}
                    description={false} />
                </Block>
              </Block>
              <Block hide={isComplete === undefined} flex align='end center'>
                <Badge
                  type={stretchType}
                  size={31}
                  hideTitle
                  effects={false}
                  count={count || 0}
                  description={false}
                  mr />
                <Badge
                  type='completed'
                  size={31}
                  hideTitle
                  effects={false}
                  count={isComplete}
                  description={false} />
              </Block>
            </Block>
          </ListItem>
        </Block>
      )
    },
    controller: {
      * maybeDragStart ({ props }, e) {
        const { ref } = props
        const handle = document.getElementById(`drag-handle-${ref}`)
        if (hasClass('drag-over', handle)) {
          return yield props.handleDragStart()
        } else {
          e.preventDefault()
        }
      }
    },
    reducer: {
      mouseOver: () => ({ hovering: true }),
      mouseOut: () => ({ hovering: false })
    }
  })
)

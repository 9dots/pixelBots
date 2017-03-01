import {Block, Card, Icon, Flex, Image, Text} from 'vdux-ui'
import IndeterminateProgress from './IndeterminateProgress'
import fire, {set, transaction} from 'vdux-fire'
import handleActions from '@f/handle-actions'
import {setUrl} from 'redux-effects-location'
import createAction from '@f/create-action'
import {setModalMessage} from '../actions'
import {Box} from 'vdux-containers'
import element from 'vdux/element'
import throttle from '@f/throttle'
import Window from 'vdux/Window'
import {fbTask} from '../utils'
import moment from 'moment'

const like = createAction('<DisplayCard/>: LIKE')
const unlike = createAction('<DisplayCard/>: UNLIKE')

const initialState = ({props, local}) => ({
  likedByMe: false,
  actions: {
    like: local(like),
    unlike: local(unlike)
  }
})

function * onUpdate (prev, {props, state}) {
  if (!props.game.loading && !props.saved.loading && !state.likedByMe) {
  	const value = {...props.game.value, ...props.saved.value}
    if (value.likedBy && value.likedBy[props.username]) {
      yield state.actions.like()
    }
  }
}

function render ({props, state, local, children}) {
  const {game, saved, imageSize = '500px', username, uid, saveRef, ...restProps} = props
  const {likedByMe} = state
  if (game.loading || saved.loading) return <IndeterminateProgress />
  const value = {...game.value, ...saved.value}

  const addLikeAction = [addLike(saveRef, uid, username), username && local(like)]
  const removeLikeAction = [removeLike(saveRef, uid, username), local(unlike)]

  return (
    <Window>
      <Block id={saveRef} bgColor='white' w='500px' border='1px solid #e0e0e0' {...restProps}>
        <Flex p='20px'>
          <Box fontWeight='700' flex>
            <Text cursor='pointer' onClick={() => setUrl(`/${value.username}`)}>{value.username}</Text>
          </Box>
          <Box color='#999'>
            {moment(value.lastEdited).fromNow()}
          </Box>
        </Flex>
        <Block align='center center' border='1px solid #e0e0e0' borderWidth='1px 0'>
          <Image sq={imageSize} boxSizing='content-box' src={value.animatedGif} />
        </Block>
        <Flex p='20px'>
          <Box align='start center'>
            {
							likedByMe
								?	<Icon onClick={removeLikeAction} name='favorite' color='red' cursor='pointer' />
								: <Icon
  onClick={addLikeAction}
  name='favorite_border'
  cursor='pointer' />
						}
            <Text display='block' ml='6px'>{value.likes}</Text>
          </Box>
          <Box
            cursor='pointer'
            hoverProps={{color: 'link'}}
            onClick={() => setUrl(`/games/${props.gameRef}`)}
            align='center center'
            fontWeight='700'
            flex>
            {value.title}
          </Box>
          <Box align='center center'>
            <Icon name='more_horiz' cursor='pointer' />
          </Box>
        </Flex>
        {children}
      </Block>
    </Window>
  )
}

function buildRef (saveID, username) {
  return `/saved/${saveID}/likedBy/${username}`
}

function addLike (saveID, uid, username) {
  const ref = buildRef(saveID, username)
  if (username) {
    return function * () {
      yield set(ref, true)
      yield transaction(`/saved/${saveID}/likes`, (val = 0) => val + 1)
      yield fbTask('like_project', {
        saveID,
        uid,
        username
      })
    }
  } else {
    return function * () {
      yield setModalMessage({header: 'Sign In', body: 'You must be signed in to like a project.'})
    }
  }
}

function removeLike (saveID, uid, username) {
  const ref = buildRef(saveID, username)
  return function * () {
    yield set(ref, null)
    yield transaction(`/saved/${saveID}/likes`, (val = 0) => val - 1)
    yield fbTask('unlike_project', {
      saveID,
      uid,
      username
    })
  }
}

function checkVisible (query) {
  const {top, bottom} = document.querySelector(query).getBoundingClientRect()
  const visible = {top: window.scrollY, bottom: window.scrollY + window.innerHeight}
  if (top < visible.top && top > visible.bottom || bottom < visible.top && bottom > visible.bottom) {
    return true
  } else {
    return false
  }
}

const reducer = handleActions({
  [like.type]: (state) => ({...state, likedByMe: true}),
  [unlike.type]: (state) => ({...state, likedByMe: false})
})

function getProps (props, context) {
  return {
    ...props,
    username: context.username,
    uid: context.uid
  }
}

export default fire((props) => ({
  game: `/games/${props.gameRef}/meta`,
  saved: `/saved/${props.saveRef}`
}))({
  initialState,
  onUpdate,
  reducer,
  getProps,
  render
})

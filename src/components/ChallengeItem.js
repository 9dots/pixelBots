/** @jsx element */

import handleActions from '@f/handle-actions'
import {setUrl} from 'redux-effects-location'
import createAction from '@f/create-action'
import {Block, Icon, Image} from 'vdux-ui'
import Button from '../components/Button'
import {getLoc, fbTask} from '../utils'
import DetailInfo from './DetailInfo'
import {Text} from 'vdux-containers'
import element from 'vdux/element'
import Loading from './Loading'
import fire from 'vdux-fire'
import moment from 'moment'

const mouseOver = createAction('<ChallengeItem/>: MOUSE_OVER')
const mouseOut = createAction('<ChallengeItem/>: MOUSE_OUT')

const initialState = ({local}) => ({
  hovering: false
})

function render ({props, state, local}) {
  const {game, saved, link, shared, uid} = props
  const {hovering} = state

  if (game.loading || saved.loading) return <Loading/>

  const value = {...game.value, ...saved.value}

  return (
    <Block
      onMouseOver={local(mouseOver)}
      onMouseOut={local(mouseOut)}
      wide
      p='1em'
      bgColor='white'
      align='start center'
      borderBottom='1px solid #e0e0e0'>
      <Block mr='14px'>
        <Image sq='40px' src={value.imageUrl}/>
      </Block>
      <Block color='#666' column flex>
        <Block mb='4px' align='start start'>
          <Text
            transition='all 0.1s ease-in-out'
            fs='m'
            cursor='pointer'
            hoverProps={{color: 'link', textDecoration: 'underline'}}
            onClick={() => shared ? setUrl(`/${shared}`) : setUrl(`/play/${props.gameRef}`)}>
            {value.title}
          </Text>
        </Block>
        <Block wide align='start center'>
          <DetailInfo
            icon='view_headline'
            label={`${getLoc(value.animals[0].sequence || '')} lines`}/>
          <DetailInfo
            icon='gamepad'
            label={`${value.attempts || 0} runs`}/>
          <DetailInfo
            icon='date_range'
            label={moment(value.lastEdited).fromNow()}/>
          {
            value.likes > 0 && <DetailInfo
              icon='favorite'
              label={value.likes}/>
          }
        </Block>
      </Block>
      {
        (shared && hovering) && <Block ml='1em'>
        {
          value.shared
            ? <Button
                onClick={removeFromShowcase(uid, props.saveRef, props.gameRef)}
                color='#666'
                fs='xs'
                bgColor='white'
                border='2px solid #E0E0E0'>Remove From Gallery</Button>
            : <Button
                onClick={addToShowcase(uid, props.saveRef, props.gameRef)}
                color='#666'
                fs='xs'
                bgColor='white'
                border='2px solid #E0E0E0'>Add To Gallery</Button>
        }
        </Block>
      }
    </Block>
  )
}



function addToShowcase (uid, saveRef, gameRef) {
  return function * () {
    yield fbTask('add_to_showcase', {
      uid,
      saveRef,
      gameRef
    })
  }
}

function removeFromShowcase (uid, saveRef, gameRef) {
  return function * () {
    yield fbTask('remove_from_showcase', {
      uid,
      saveRef,
      gameRef
    })
  }
}

function getProps (props, context) {
  return {
    ...props,
    uid: context.currentUser.uid
  }
}

const reducer = handleActions({
  [mouseOver.type]: (state) => ({...state, hovering: true}),
  [mouseOut.type]: (state) => ({...state, hovering: false})
})

export default fire((props) => ({
  game: `/games/${props.gameRef}`,
  saved: `/saved/${props.saveRef}`
}))({
  initialState,
  getProps,
  reducer,
  render
})

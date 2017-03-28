/**
 * Imports
 */

import IndeterminateProgress from 'components/IndeterminateProgress'
import DetailInfo from 'components/DetailInfo'
import ListItem from 'components/ListItem'
import {Block, Icon, Image} from 'vdux-ui'
import {component, element,stopPropagation} from 'vdux'
import Button from 'components/Button'
import {Text} from 'vdux-containers'
import fire from 'vdux-fire'
import moment from 'moment'

/**
 * <Challenge Item/>
 */

export default fire((props) => ({
  game: `/games/${props.gameRef}/meta`,
  saved: `/saved/${props.saveRef}/meta`
}))(component({
  initialState: {
    hovering: false
  },
  render ({props, children, context, actions, state}) {
    const {game, saved, link, shared, uid} = props
    const {hovering} = state

    if (game.loading || saved.loading) return <IndeterminateProgress />

    const value = {...game.value, ...saved.value}

    const sequence = value.animals
    ? value.animals[0].sequence
    : ''

    return (
      <ListItem
        onMouseOver={actions.mouseOver}
        onMouseOut={actions.mouseOut}
        wide
        p='1em'
        bgColor='white'
        align='start center'
        onClick={shared ? context.setUrl(`/${shared}`) : context.setUrl(`/play/${props.gameRef}`)}>
        <Block mr='14px'>
          <Image sq='40px' src={value.imageUrl} />
        </Block>
        <Block color='#666' column flex>
          <Block mb='4px' align='start start'>
            <Text
              transition='all 0.1s ease-in-out'
              fs='m'
              cursor='pointer'
              hoverProps={{color: 'link', textDecoration: 'underline'}}
              onClick={shared ? context.setUrl(`/${shared}`) : context.setUrl(`/play/${props.gameRef}`)}>
              {value.title}
            </Text>
          </Block>
          <Block wide align='start center'>
            <DetailInfo
              icon='view_headline'
              label={`${value.loc || 0} lines`} />
            <DetailInfo
              icon='gamepad'
              label={`${value.attempts || 0} runs`} />
            <DetailInfo
              icon='date_range'
              label={moment(value.lastEdited).fromNow()} />
            {
            value.likes > 0 && <DetailInfo
              icon='favorite'
              label={value.likes} />
          }
          </Block>
        </Block>
        {(hovering && shared) && (
          <ShowcaseButton gameRef={props.gameRef} saveRef={props.saveRef} shared={value.shared}/>
        )}
      </ListItem>
    )
  },
  reducer: {
  	mouseOver: (state) => ({hovering: true}),
  	mouseOut: (state) => ({hovering: false})
  }
}))

const ShowcaseButton = component({
  render ({props, actions}) {
    const {shared} = props
    return (
      shared
        ? <Button fs='xs' bgColor='white' border='1px solid #e0e0e0' color='#666' onClick={[actions.removeFromShowcase, stopPropagation]}>Remove from showcase</Button>
        : <Button fs='xs' bgColor='white' border='1px solid #e0e0e0' color='#666' onClick={[actions.addToShowcase, stopPropagation]}>Add to showcase</Button>
    )
  },
  controller: {
    * addToShowcase ({context, props}) {
      const {uid, firebasePush, firebaseUpdate} = context
      const {gameRef, saveRef} = props
      yield firebaseUpdate(`/saved/${saveRef}/meta`, {shared: true})

    },
    * removeFromShowcase ({context, props}) {
      const {uid, firebasePush, firebaseUpdate} = context
      const {gameRef, saveRef} = props
      yield firebaseUpdate(`/saved/${saveRef}/meta`, {shared: false})
    }
  }
})

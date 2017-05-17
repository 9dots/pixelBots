/**
 * Imports
 */

import IndeterminateProgress from 'components/IndeterminateProgress'
import DetailInfo from 'components/DetailInfo'
import ListItem from 'components/ListItem'
import {Block, Icon, Image} from 'vdux-ui'
import {component, element, stopPropagation} from 'vdux'
import Button from 'components/Button'
import {Text} from 'vdux-containers'
import fire from 'vdux-fire'
import moment from 'moment'
import animalApis from 'animalApis'

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
    const animalImg = animalApis[value.animals[0]].imageURL

    return (
      <ListItem
        onMouseOver={actions.mouseOver}
        onMouseOut={actions.mouseOut}
        wide
        p='1em'
        bgColor='white'
        align='start center'
        relative
        onClick={shared ? context.setUrl(`/${shared}`) : context.setUrl(`/play/${props.gameRef}`)}>
        <Block mr='14px'>
          <Image sq='40px' src={value.imageUrl || animalImg} />
        </Block>
        <Block color='#666' column flex>
          <Block mb='4px' align='start start'>
            <Text
              transition='all 0.1s ease-in-out'
              fs='m'
              cursor='pointer'
              hoverProps={{color: 'link', textDecoration: 'underline'}}
              onClick={shared
                ? [context.setUrl(`/games/${props.gameRef}`), stopPropagation]
                : [context.setUrl(`/play/${props.gameRef}`), stopPropagation]}>
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
            {
              shared && <DetailInfo
                icon='search'
                label='View Code'
                onClick={[context.setUrl(`/play/${props.gameRef}/finished/${props.saveRef}`), stopPropagation]} />
            }
          </Block>
        </Block>
        {
          hovering && shared &&
            <Block bgColor='highlightBlue' pl absolute right={20} h='100%' align='end center' top m='auto'>
              <ShowcaseButton gameRef={props.gameRef} saveRef={props.saveRef} shared={value.shared}/>
            </Block>
        }
        <Icon hide={!value.shared} name='collections' fs='s' color='#f76a59' absolute top right m='xs'/>
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
    const btnProps = {
      fs: 'xxs',
      bgColor: 'white',
      border: '1px solid divider',
      color: 'primary',
      hoverProps: {highlight: .02},
      focusProps: {highlight: .02}
    }
    return (
      shared
        ? <Button {...btnProps} onClick={[actions.removeFromShowcase, stopPropagation]}>Remove from Showcase</Button>
        : <Button {...btnProps} onClick={[actions.addToShowcase, stopPropagation]}>Add to Showcase</Button>
    )
  },
  controller: {
    * addToShowcase ({context, props}) {
      const {uid, firebasePush, firebaseUpdate, firebaseSet} = context
      const {gameRef, saveRef} = props
      yield firebaseUpdate(`/saved/${saveRef}/meta`, {shared: true})
      yield firebaseSet(`/users/${context.uid}/showcase/${saveRef}`, {
        gameRef,
        saveRef,
        lastEdited: Date.now()
      })
    },
    * removeFromShowcase ({context, props}) {
      const {uid, firebasePush, firebaseUpdate, firebaseSet} = context
      const {gameRef, saveRef} = props
      yield firebaseUpdate(`/saved/${saveRef}/meta`, {shared: false})
      yield firebaseSet(`/users/${context.uid}/showcase/${saveRef}`, null)
    }
  }
})
